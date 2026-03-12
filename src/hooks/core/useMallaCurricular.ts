import { useState, useCallback, useMemo, useEffect } from "react";
import type { ProgresoMalla } from "../../types/materia";
import type { MallaCurricularGraph } from "../../core/MallaCurricularGraph";
import { StandardMallaEvaluator } from "../../rules/StandardMallaEvaluator";
import { PathfindingService } from "../../services/PathfindingService";
import { GreedyScheduler } from "../../strategies/GreedyScheduler";
import { calcularUCAcumuladas, obtenerPrerrequisitosFaltantes, obtenerCorrequisitosFaltantes } from "../../utils/mallaUtils";
import { MateriaRepository } from "../../repository/MateriaRepository";
import type { MateriaMatricula } from "../../services/MatriculaService";
import { useToast } from "../../hooks/ui/useToast";

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
        const estadoActual = progreso[codigoMateria] || 'bloqueada';
        const materia = grafo.getNode(codigoMateria);

        if (estadoActual === 'bloqueada' && materia) {
            // Evaluamos razones específicas para el Toast
            const ucActuales = calcularUCAcumuladas(progreso, grafo);

            // 1. Check UC Limit
            if (materia.ucRequeridas && ucActuales < materia.ucRequeridas) {
                showToast(
                    `No puedes cursar ${materia.nombre}`,
                    `Necesitas ${materia.ucRequeridas} UC, y tienes ${ucActuales} UC aprobadas.`,
                    'warning'
                );
                return;
            }

            // 2. Check Prerrequisitos
            const faltantesPre = obtenerPrerrequisitosFaltantes(codigoMateria, progreso, grafo);
            if (faltantesPre.length > 0) {
                const nombres = faltantesPre.map(f => f.nombre).join(", ");
                showToast(
                    `No puedes cursar ${materia.nombre}`,
                    `Te falta aprobar: ${nombres}`,
                    'warning'
                );
                return;
            }

            // 3. Check Correquisitos
            const faltantesCo = obtenerCorrequisitosFaltantes(codigoMateria, progreso, grafo);
            if (faltantesCo.length > 0) {
                const nombres = faltantesCo.map(f => f.nombre).join(", ");
                showToast(
                    `No puedes cursar ${materia.nombre}`,
                    `Debes cursar o tener aprobado: ${nombres}`,
                    'warning'
                );
                return;
            }
        }

        // NUEVO CHECK para correquisitos estrictos
        if (estadoActual === "disponible" || estadoActual === "cursando") {
            const correqCodigos = grafo.getCorrequisitos(codigoMateria);
            const faltantesParaAvanzar = correqCodigos.filter(correq => {
                const estado = progreso[correq];
                // Para avanzar (a aprobada), el correquisito debe estar al menos cursando o aprobado
                return estado !== 'aprobada' && estado !== 'cursando';
            });
            
            if (faltantesParaAvanzar.length > 0) {
                 const nombres = faltantesParaAvanzar.map(c => grafo.getNode(c)?.nombre || c).join(', ');
                 const materiaNode = grafo.getNode(codigoMateria);
                 showToast(
                     `Operación denegada en ${materiaNode?.nombre || codigoMateria}`,
                     `Su correquisito debe estar en curso o aprobado: ${nombres}`,
                     'warning'
                 );
                 return;
            }
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
            const faltantes = obtenerPrerrequisitosFaltantes(codigoMateria, progreso, grafo);
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

        if (estadoActual === "disponible") {
            const correqCodigos = grafo.getCorrequisitos(codigoMateria);
            const faltantesParaAvanzar = correqCodigos.filter(correq => {
                const estado = progreso[correq];
                // Para marcar cursando, el correquisito debe estar cursando o aprobado
                return estado !== 'aprobada' && estado !== 'cursando';
            });
            
            if (faltantesParaAvanzar.length > 0) {
                 const nombres = faltantesParaAvanzar.map(c => grafo.getNode(c)?.nombre || c).join(', ');
                 const materiaNode = grafo.getNode(codigoMateria);
                 showToast(
                     `Aún no puedes llevar ${materiaNode?.nombre || codigoMateria}`,
                     `Debes estar cursando o haber aprobado su correquisito: ${nombres}`,
                     'warning'
                 );
                 return;
            }
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