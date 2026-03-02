import { useState, useCallback, useMemo, useEffect } from "react";
import type { ProgresoMalla } from "../types/materia";
import { MallaCurricularGraph } from "../core/MallaCurricularGraph";




const calcularUCAcumuladas = (progreso: ProgresoMalla, grafo: MallaCurricularGraph): number => {
    let total = 0;
    Object.entries(progreso).forEach(([codigo, estado]) => {
        if (estado === "aprobada") {
            const materia = grafo.getNode(codigo);
            if (materia) total += materia.unidadesCredito;
        }
    });
    return total;
};

// Función pura que reevalúa toda la malla hasta estabilizar todos los bloqueos y desbloqueos
const evaluarMalla = (progresoBase: ProgresoMalla, grafo: MallaCurricularGraph): ProgresoMalla => {
    const nuevoProgreso = { ...progresoBase };
    let cambiado = true;

    // Repetimos hasta que ningún estado cambie (efecto dominó global)
    while (cambiado) {
        cambiado = false;
        const ucActual = calcularUCAcumuladas(nuevoProgreso, grafo);

        for (const materia of grafo.getAllNodes()) {
            const cod = materia.codigoMateria;
            const estadoAnterior = nuevoProgreso[cod] || "bloqueada";

            const reqs = grafo.getMateriasRequeridas(cod);
            const cumpleReqs = reqs.every(req => nuevoProgreso[req] === "aprobada");
            const cumpleUC = ucActual >= materia.ucRequeridas;

            // Una materia está lista para cursarse si cumple pre-requisitos explícitos Y créditos (UC)
            const puedeCursarse = cumpleReqs && cumpleUC;

            if (estadoAnterior === "aprobada") {
                // Si la teníamos aprobada pero perdió los requisitos (ej. perdimos UC o desaprobamos una prelativa)
                if (!puedeCursarse) {
                    nuevoProgreso[cod] = "bloqueada";
                    cambiado = true;
                }
            } else if (estadoAnterior === "disponible") {
                // Si estaba disponible pero ya no cumple los requisitos
                if (!puedeCursarse) {
                    nuevoProgreso[cod] = "bloqueada";
                    cambiado = true;
                }
            } else if (estadoAnterior === "bloqueada") {
                // Si estaba bloqueada pero ahora sí cumple todo
                if (puedeCursarse) {
                    nuevoProgreso[cod] = "disponible";
                    cambiado = true;
                }
            }
        }
    }
    return nuevoProgreso;
};

export const useMallaCurricular = (grafo: MallaCurricularGraph) => {

    const [progreso, setProgreso] = useState<ProgresoMalla>(
        () => {
            // Intentamos recuperar el progreso guardado
            const progresoGuardado = localStorage.getItem("malla-progreso");
            if (progresoGuardado) {
                try {
                    const parsedProgreso = JSON.parse(progresoGuardado);
                    // Verificamos superficialmente que es un objeto con datos
                    if (parsedProgreso && typeof parsedProgreso === 'object' && Object.keys(parsedProgreso).length > 0) {
                        return evaluarMalla(parsedProgreso, grafo);
                    }
                } catch (e) {
                    console.error("Error leyendo historial de progreso", e);
                }
            }

            // Fallback: Progreso desde cero
            const estadoInicial: ProgresoMalla = {};
            // Iniciamos todas bloqueadas
            grafo.getAllNodes().forEach((materia) => {
                estadoInicial[materia.codigoMateria] = "bloqueada";
            });
            // La función evaluará y liberará automáticamente las que no tengan requisitos (ej. Semestre 1)
            return evaluarMalla(estadoInicial, grafo);
        }
    );

    // Efecto secundario: Cada vez que el progreso cambie, respaldar en memoria caché local del navegador
    useEffect(() => {
        localStorage.setItem("malla-progreso", JSON.stringify(progreso));
    }, [progreso]);

    const cantidadAprobadas = useMemo(() => {
        return Object.values(progreso).filter(estado => estado === "aprobada").length;
    }, [progreso]);

    const ucAcumuladas = useMemo(() => {
        return calcularUCAcumuladas(progreso, grafo);
    }, [progreso, grafo])

    const toggleAprobacion = useCallback((codigoMateria: string) => {
        setProgreso(progresoActual => {
            const nuevoProgreso = { ...progresoActual };
            const estadoActualDeLaMateria = nuevoProgreso[codigoMateria];

            if (estadoActualDeLaMateria === "bloqueada") {
                return progresoActual; // No se puede interactuar con bloqueadas
            }

            if (estadoActualDeLaMateria === "disponible") {
                nuevoProgreso[codigoMateria] = "aprobada";
            } else if (estadoActualDeLaMateria === "aprobada") {
                nuevoProgreso[codigoMateria] = "disponible";
            }

            // Una vez que el usuario hizo su acción de click, recalculamos todo el grafo
            return evaluarMalla(nuevoProgreso, grafo);
        });
    }, [grafo]);

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
            return evaluarMalla(nuevoProgreso, grafo);
        });
    }, [grafo]);

    // Función que destruye todo el progreso almacenado y reinicia el grafo a Cero
    const resetProgreso = useCallback(() => {
        localStorage.removeItem("malla-progreso");

        const estadoInicial: ProgresoMalla = {};
        grafo.getAllNodes().forEach((materia) => {
            estadoInicial[materia.codigoMateria] = "bloqueada";
        });

        setProgreso(evaluarMalla(estadoInicial, grafo));
    }, [grafo]);

    return {
        progreso,
        cantidadAprobadas,
        ucAcumuladas,
        toggleAprobacion,
        toggleSemestre,
        resetProgreso
    }
}