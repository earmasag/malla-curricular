import { useState, useCallback, useEffect, useMemo } from "react";
import type { ProgresoMalla } from "../../types/materia";
import { MallaCurricularGraph } from "../../core/MallaCurricularGraph";
import { StandardMallaEvaluator } from "../../rules/StandardMallaEvaluator";
import { MateriaRepository } from "../../repository/MateriaRepository";
import { obtenerPrerrequisitosFaltantes, obtenerCorrequisitosFaltantes } from "../../utils/mallaUtils";
import { useNotification } from "../ui/useNotification";
import { useToast } from "../ui/useToast";

export const useCustomRoute = (grafo: MallaCurricularGraph, progresoBase: ProgresoMalla) => {
    const { confirm } = useNotification();
    const { showToast } = useToast();

    // Instanciamos Evaluator y Repository independientemente para el hook
    const evaluator = useMemo(() => new StandardMallaEvaluator(), []);
    const repository = useMemo(() => new MateriaRepository(), []);

    const [isCustomRouteMode, setIsCustomRouteMode] = useState(false);
    const [customProgreso, setCustomProgreso] = useState<ProgresoMalla>({});
    const [customSemesters, setCustomSemesters] = useState<string[][]>([]);
    const [hasDraftRoute, setHasDraftRoute] = useState(false);
    const [currentSemesterUCs, setCurrentSemesterUCs] = useState(0);
    const [totalCustomUCs, setTotalCustomUCs] = useState(0);

    // Revisar si existe un borrador guardado al montar para habilitar/deshabilitar botón
    useEffect(() => {
        const savedRoute = repository.getDraftRoute();
        const hasValidRoute = savedRoute.length > 0 && savedRoute.some((s: string[]) => s.length > 0);
        setHasDraftRoute(hasValidRoute);
    }, [repository]);

    // Transforma las materias "cursando" de la base a "aprobada" para el modo diseño
    const getTransformedBaseProgress = useCallback(() => {
        const transformed = { ...progresoBase };
        Object.keys(transformed).forEach(codigo => {
            if (transformed[codigo] === "cursando") {
                transformed[codigo] = "aprobada";
            }
        });
        return transformed;
    }, [progresoBase]);

    const loadDraftCustomRoute = useCallback(() => {
        const savedRoute = repository.getDraftRoute();
        if (!savedRoute || savedRoute.length === 0) return false;

        setIsCustomRouteMode(true);
        setCustomSemesters(savedRoute);

        // Reconstruimos el customProgreso basado en el progreso actual + las materias de la ruta
        const nuevoProgreso = getTransformedBaseProgress();

        savedRoute.forEach((semester: string[], index: number) => {
            const isLast = index === savedRoute.length - 1;
            semester.forEach((code: string) => {
                nuevoProgreso[code] = isLast && semester.length === 0 ? "disponible" : (isLast ? "cursando" : "aprobada");
            });
        });

        setCustomProgreso(evaluator.evaluate(nuevoProgreso, grafo));
        return true;

    }, [getTransformedBaseProgress, evaluator, grafo, repository]);

    const startCustomRoute = useCallback(() => {
        // Intentar cargar el borrador primero si existe
        if (hasDraftRoute) {
            loadDraftCustomRoute();
            return;
        }

        setIsCustomRouteMode(true);
        const transformedProgress = getTransformedBaseProgress();
        setCustomProgreso(evaluator.evaluate(transformedProgress, grafo));
        setCustomSemesters([[]]);
    }, [getTransformedBaseProgress, hasDraftRoute, loadDraftCustomRoute, evaluator, grafo]);

    const deleteDraftRoute = useCallback(async () => {
        const isConfirmed = await confirm("¿Seguro que deseas descartar tu borrador actual?", {
            isDestructive: true,
            confirmText: "Descartar"
        });

        if (isConfirmed) {
            repository.clearDraftRoute();
            setHasDraftRoute(false);
            if (isCustomRouteMode) {
                setCustomSemesters([[]]);
                const transformedProgress = getTransformedBaseProgress();
                setCustomProgreso(evaluator.evaluate(transformedProgress, grafo));
            }
        }
    }, [repository, isCustomRouteMode, getTransformedBaseProgress, evaluator, grafo, confirm]);

    // Calcular UCs cada vez que cambia customSemesters
    useEffect(() => {
        let currentSemUCs = 0;
        let totalUCs = 0;

        customSemesters.forEach((semester, index) => {
            const isLastSemester = index === customSemesters.length - 1;
            let semUCs = 0;

            semester.forEach(codigo => {
                const materia = grafo.getNode(codigo);
                if (materia) {
                    semUCs += materia.unidadesCredito;
                }
            });

            if (isLastSemester) {
                currentSemUCs = semUCs;
            }
            totalUCs += semUCs;
        });

        setCurrentSemesterUCs(currentSemUCs);
        setTotalCustomUCs(totalUCs);
    }, [customSemesters, grafo]);

    // Efecto secundario: Cada vez que cambiamos los customSemesters en modo constructor, la persistimos.
    useEffect(() => {
        if (isCustomRouteMode && customSemesters.length > 0) {
            repository.saveDraftRoute(customSemesters);
            setHasDraftRoute(true);
        }
    }, [customSemesters, isCustomRouteMode, repository]);

    const toggleCustomMateria = useCallback((codigoMateria: string) => {

        // Validación preventiva y disparo de TOAST en modo Constructor
        const estadoActual = customProgreso[codigoMateria];
        if (estadoActual === "bloqueada") {
            const materia = grafo.getNode(codigoMateria);
            if (!materia) return;

            // 1. Check UC Limit
            if (currentSemesterUCs < materia.ucRequeridas) {
                showToast(
                    `No puedes añadir ${materia.nombre} al borrador`,
                    `Necesitas ${materia.ucRequeridas} UC, y tienes ${currentSemesterUCs} UC en este semestre.`,
                    'warning'
                );
                return;
            }

            // 2. Check Prerrequisitos
            const faltantesPre = obtenerPrerrequisitosFaltantes(codigoMateria, customProgreso, grafo);
            if (faltantesPre.length > 0) {
                const nombres = faltantesPre.map(f => f.nombre).join(", ");
                showToast(
                    `No puedes añadir ${materia.nombre} al borrador`,
                    `Te falta aprobar: ${nombres}`,
                    'warning'
                );
                return;
            }

            // 3. Check Correquisitos
            const faltantesCo = obtenerCorrequisitosFaltantes(codigoMateria, customProgreso, grafo);
            if (faltantesCo.length > 0) {
                const nombres = faltantesCo.map(f => f.nombre).join(", ");
                showToast(
                    `No puedes añadir ${materia.nombre} al borrador`,
                    `Debes cursar o tener aprobado: ${nombres}`,
                    'warning'
                );
                return;
            }

            return; // Cortocircuitamos si está bloqueada por alguna otra razón desconocida (raro)
        }

        // NUEVO CHECK para correquisitos estrictos al seleccionar en el Constructor
        if (estadoActual === "disponible") {
            const correqCodigos = grafo.getCorrequisitos(codigoMateria);
            const faltantesParaAvanzar = correqCodigos.filter(correq => {
                const estado = customProgreso[correq];
                // En el constructor, para agarrar una materia, su correquisito ya debe estar cursando o aprobado
                return estado !== 'aprobada' && estado !== 'cursando';
            });
            
            if (faltantesParaAvanzar.length > 0) {
                 const nombres = faltantesParaAvanzar.map(c => grafo.getNode(c)?.nombre || c).join(', ');
                 const materiaNode = grafo.getNode(codigoMateria);
                 showToast(
                     `No puedes añadir ${materiaNode?.nombre || codigoMateria} al borrador`,
                     `Debes seleccionar también su correquisito: ${nombres}`,
                     'warning'
                 );
                 return;
            }
        }

        setCustomProgreso(progresoActual => {
            const nuevoProgreso = { ...progresoActual };
            const estadoActualDeLaMateria = nuevoProgreso[codigoMateria];

            if (estadoActualDeLaMateria === "disponible") {
                nuevoProgreso[codigoMateria] = "cursando";
            } else if (estadoActualDeLaMateria === "cursando") {
                nuevoProgreso[codigoMateria] = "disponible";
            } else {
                return progresoActual;
            }
            return nuevoProgreso;
        });

        setCustomSemesters(semesters => {
            const newSemesters = [...semesters];
            const currentSemesterIndex = newSemesters.length - 1;
            const currentSemester = [...newSemesters[currentSemesterIndex]];

            if (currentSemester.includes(codigoMateria)) {
                newSemesters[currentSemesterIndex] = currentSemester.filter(code => code !== codigoMateria);
            } else {
                newSemesters[currentSemesterIndex] = [...currentSemester, codigoMateria];
            }
            return newSemesters;
        });
    }, [customProgreso, customSemesters, grafo, showToast]);

    const advanceCustomSemester = useCallback(() => {
        if (customSemesters.length > 0 && customSemesters[customSemesters.length - 1].length === 0) {
            return;
        }

        setCustomProgreso(progresoActual => {
            const nuevoProgreso = { ...progresoActual };
            const currentSemesterCodes = customSemesters[customSemesters.length - 1];

            currentSemesterCodes.forEach(code => {
                nuevoProgreso[code] = "aprobada";
            });

            return evaluator.evaluate(nuevoProgreso, grafo);
        });

        setCustomSemesters(semesters => [...semesters, []]);
    }, [customSemesters, evaluator, grafo]);

    const undoCustomSemester = useCallback(async () => {
        if (customSemesters.length <= 1) return;

        const isCurrentEmpty = customSemesters[customSemesters.length - 1].length === 0;

        if (!isCurrentEmpty) {
            const isConfirmed = await confirm("¿Seguro que deseas retroceder? Perderás las materias seleccionadas en este semestre.", {
                isDestructive: true,
                confirmText: "Retroceder"
            });
            if (!isConfirmed) return;
        }

        setCustomSemesters(semesters => {
            const newSemesters = [...semesters];
            newSemesters.pop();

            // Reconstruct customProgreso
            setCustomProgreso(() => {
                const nuevoProgreso = getTransformedBaseProgress();
                newSemesters.forEach((semester: string[], index: number) => {
                    const isLast = index === newSemesters.length - 1;
                    semester.forEach((code: string) => {
                        nuevoProgreso[code] = isLast ? "cursando" : "aprobada";
                    });
                });
                return evaluator.evaluate(nuevoProgreso, grafo);
            });

            return newSemesters;
        });
    }, [customSemesters, confirm, getTransformedBaseProgress, evaluator, grafo]);

    const cancelCustomRoute = useCallback(() => {
        setIsCustomRouteMode(false);
        setCustomSemesters([]);
        setCustomProgreso({});
    }, []);

    const saveAndFinishRoute = useCallback((routeId: string, routeName: string) => {
        const validSemesters = customSemesters.filter(sem => sem.length > 0);

        repository.saveRoute({
            id: routeId,
            nombre: routeName,
            semesters: validSemesters,
            createdAt: Date.now()
        });

        // Limpiamos el borrador porque ya se guardó como definitiva
        repository.clearDraftRoute();
        setHasDraftRoute(false);

    }, [customSemesters, repository]);

    return {
        estado: {
            isCustomRouteMode,
            customProgreso,
            customSemesters,
            hasDraftRoute,
            currentSemesterUCs,
            totalCustomUCs
        },
        acciones: {
            startCustomRoute,
            deleteDraftRoute,
            toggleCustomMateria,
            advanceCustomSemester,
            undoCustomSemester,
            cancelCustomRoute,
            saveAndFinishRoute
        }
    };
};
