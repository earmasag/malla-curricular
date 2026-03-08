import { useState, useCallback, useMemo, useEffect } from "react";
import type { ProgresoMalla } from "../types/materia";
import { MallaCurricularGraph } from "../core/MallaCurricularGraph";
import { StandardMallaEvaluator } from "../rules/StandardMallaEvaluator";
import { PathfindingService } from "../services/PathfindingService";
import { GreedyScheduler } from "../strategies/GreedyScheduler";
import { calcularUCAcumuladas } from "../utils/mallaUtils";
import { MateriaRepository } from "../repository/MateriaRepository";
import type { MateriaMatricula } from "../services/MatriculaService";
import { useToast } from "./useToast";

export const useMallaCurricular = (grafo: MallaCurricularGraph) => {
    const { showToast } = useToast();
    // Instanciamos el evaluador estándar de la malla (Service Layer / Strategy)
    const evaluator = useMemo(() => new StandardMallaEvaluator(), []);

    // Instanciamos el Repositorio para independizarnos del localStorage crudo
    const repository = useMemo(() => new MateriaRepository(), []);

    const [progreso, setProgreso] = useState<ProgresoMalla>(
        () => {
            // Intentamos recuperar el progreso guardado a través del Repository
            const progresoGuardado = repository.getStudentProgress();

            // Si el objeto no está vacío, cargamos los datos y los pasamos por el evaluador
            if (Object.keys(progresoGuardado).length > 0) {
                return evaluator.evaluate(progresoGuardado, grafo);
            }

            // Fallback: Progreso desde cero
            const estadoInicial: ProgresoMalla = {};
            // Iniciamos todas bloqueadas
            grafo.getAllNodes().forEach((materia) => {
                estadoInicial[materia.codigoMateria] = "bloqueada";
            });
            // La función evaluará y liberará automáticamente las que no tengan requisitos (ej. Semestre 1)
            return evaluator.evaluate(estadoInicial, grafo);
        }
    );

    // Efecto secundario: Cada vez que el progreso cambie, delegarlo al Repositorio
    useEffect(() => {
        repository.saveStudentProgress(progreso);
    }, [progreso, repository]);

    const cantidadAprobadas = useMemo(() => {
        return Object.values(progreso).filter(estado => estado === "aprobada").length;
    }, [progreso]);

    const ucAcumuladas = useMemo(() => {
        return calcularUCAcumuladas(progreso, grafo);
    }, [progreso, grafo])

    // Obtener las materias que actualmente están "cursando"
    const materiasCursando = useMemo(() => {
        return Object.entries(progreso)
            .filter(([, estado]) => estado === 'cursando')
            .map(([codigo]) => {
                const m = grafo.getNode(codigo);
                if (!m) return null;
                return {
                    ...m,
                    estado: "cursando" as const,
                    esTSU: false,
                    esElectivaEspecialHumanidades: false,
                } as MateriaMatricula;
            })
            .filter(Boolean) as MateriaMatricula[];
    }, [progreso, grafo]);

    const toggleAprobacion = useCallback((codigoMateria: string) => {
        // Validación preventiva y disparo de TOAST
        const estadoActual = progreso[codigoMateria];
        if (estadoActual === "bloqueada") {
            const faltantes = grafo.obtenerPrerrequisitosFaltantes(codigoMateria, progreso);
            const nombres = faltantes.map(f => f.nombre).join(", ");
            const materia = grafo.getNode(codigoMateria);

            showToast(
                `Aún no puedes cursar ${materia?.nombre || codigoMateria}`,
                `Te falta aprobar: ${nombres}`,
                'warning'
            );
            return; // Cortocircuitamos
        }

        setProgreso(progresoActual => {
            const nuevoProgreso = { ...progresoActual };
            const estadoActualDeLaMateria = nuevoProgreso[codigoMateria];

            if (estadoActualDeLaMateria === "disponible" || estadoActualDeLaMateria === "cursando") {
                nuevoProgreso[codigoMateria] = "aprobada";
            } else if (estadoActualDeLaMateria === "aprobada") {
                nuevoProgreso[codigoMateria] = "disponible";
            }

            // Una vez que el usuario hizo su acción de click, recalculamos todo el grafo
            return evaluator.evaluate(nuevoProgreso, grafo);
        });
    }, [grafo, evaluator, progreso, showToast]);

    // Función exclusiva para click derecho: transiciona entre disponible y cursando
    const toggleCursando = useCallback((codigoMateria: string) => {
        // Validación preventiva y disparo de TOAST para click derecho
        const estadoActual = progreso[codigoMateria];
        if (estadoActual === "bloqueada") {
            const faltantes = grafo.obtenerPrerrequisitosFaltantes(codigoMateria, progreso);
            const nombres = faltantes.map(f => f.nombre).join(", ");
            const materia = grafo.getNode(codigoMateria);

            showToast(
                `Aún no puedes llevar ${materia?.nombre || codigoMateria}`,
                `Te falta aprobar: ${nombres}`,
                'warning'
            );
            return; // Cortocircuitamos
        }

        if (estadoActual === "aprobada") {
            return; // Aprobadas se ignoran en click derecho sin notificar (comportamiento silencioso)
        }

        setProgreso(progresoActual => {
            const nuevoProgreso = { ...progresoActual };
            const estadoActualDeLaMateria = nuevoProgreso[codigoMateria];

            if (estadoActualDeLaMateria === "disponible") {
                nuevoProgreso[codigoMateria] = "cursando";
            } else if (estadoActualDeLaMateria === "cursando") {
                nuevoProgreso[codigoMateria] = "disponible";
            }

            // Una vez que el usuario hizo su acción de click, recalculamos todo el grafo
            return evaluator.evaluate(nuevoProgreso, grafo);
        });
    }, [grafo, evaluator, progreso, showToast]);

    // Función para aprobar/desaprobar un semestre completo
    const toggleSemestre = useCallback((numeroSemestre: number) => {
        setProgreso(progresoActual => {
            const materiasDelSemestre = grafo.getMateriasPorSemestre(numeroSemestre);
            const nuevoProgreso = { ...progresoActual };

            // Verificamos si TODAS las materias del semestre ya están aprobadas
            const todasAprobadas = materiasDelSemestre.every(materia =>
                nuevoProgreso[materia.codigoMateria] === 'aprobada'
            );

            // Si todas están aprobadas, las desaprobamos (pasamos a disponible). Si no, las aprobamos.
            const nuevoEstadoObjetivo = todasAprobadas ? 'disponible' : 'aprobada';

            materiasDelSemestre.forEach(materia => {
                // Solo modificamos materias que NO estén bloqueadas 
                // (no podemos mágicamente aprobar algo que estaba estructuralmente bloqueado)
                if (nuevoProgreso[materia.codigoMateria] !== 'bloqueada') {
                    nuevoProgreso[materia.codigoMateria] = nuevoEstadoObjetivo;
                }
            });

            // Forzamos la reevaluación estricta de la malla para revertir aprobaciones inválidas o 
            // bloquear materias que dependían de las que acabamos de desaprobar.
            return evaluator.evaluate(nuevoProgreso, grafo);
        });
    }, [grafo, evaluator]);

    // Función que destruye todo el progreso almacenado y reinicia el grafo a Cero
    const resetProgreso = useCallback(() => {
        repository.clearProgress();

        const estadoInicial: ProgresoMalla = {};
        grafo.getAllNodes().forEach((materia) => {
            estadoInicial[materia.codigoMateria] = "bloqueada";
        });

        setProgreso(evaluator.evaluate(estadoInicial, grafo));
    }, [grafo, evaluator]);

    // Función que calcula y retorna los bloques óptimos de estudio (Topological Sort / Algoritmo de Kahn)
    const generarRutaOptima = useCallback((maxUcPorSemestre?: number, maxMateriasPorSemestre?: number, maxHorasPorSemestre?: number) => {
        const strategy = new GreedyScheduler();
        const pathfinder = new PathfindingService(grafo, evaluator, strategy);

        return pathfinder.calcularRutaOptima(progreso, maxUcPorSemestre, maxMateriasPorSemestre, maxHorasPorSemestre);
    }, [grafo, progreso, evaluator]); // Evaluator no cambia porque está envuelto en un useMemo vacío

    return {
        estado: {
            progreso,
            cantidadAprobadas,
            ucAcumuladas,
            materiasCursando
        },
        acciones: {
            toggleAprobacion,
            toggleCursando,
            toggleSemestre,
            resetProgreso,
            generarRutaOptima
        }
    };
}