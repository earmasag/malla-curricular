import { useState, useCallback, useEffect, useMemo } from "react";
import type { ProgresoMalla } from "../types/materia";
import { MallaCurricularGraph } from "../core/MallaCurricularGraph";
import { StandardMallaEvaluator } from "../rules/StandardMallaEvaluator";
import { MateriaRepository } from "../repository/MateriaRepository";
import { useNotification } from "./useNotification";

export const useCustomRoute = (grafo: MallaCurricularGraph, progresoBase: ProgresoMalla) => {
    const { confirm } = useNotification();

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

    const loadDraftCustomRoute = useCallback(() => {
        const savedRoute = repository.getDraftRoute();
        if (!savedRoute || savedRoute.length === 0) return false;

        setIsCustomRouteMode(true);
        setCustomSemesters(savedRoute);

        // Reconstruimos el customProgreso basado en el progreso actual + las materias de la ruta
        const nuevoProgreso = { ...progresoBase };

        savedRoute.forEach((semester: string[], index: number) => {
            const isLast = index === savedRoute.length - 1;
            semester.forEach((code: string) => {
                nuevoProgreso[code] = isLast && semester.length === 0 ? "disponible" : (isLast ? "cursando" : "aprobada");
            });
        });

        setCustomProgreso(evaluator.evaluate(nuevoProgreso, grafo));
        return true;

    }, [progresoBase, evaluator, grafo, repository]);

    const startCustomRoute = useCallback(() => {
        // Intentar cargar el borrador primero si existe
        if (hasDraftRoute) {
            loadDraftCustomRoute();
            return;
        }

        setIsCustomRouteMode(true);
        setCustomProgreso({ ...progresoBase });
        setCustomSemesters([[]]);
    }, [progresoBase, hasDraftRoute, loadDraftCustomRoute]);

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
                setCustomProgreso({ ...progresoBase });
            }
        }
    }, [repository, isCustomRouteMode, progresoBase, confirm]);

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
    }, []);

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
            cancelCustomRoute,
            saveAndFinishRoute
        }
    };
};
