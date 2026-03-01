import { useState, useCallback, useMemo } from "react";
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


export const useMallaCurricular = (grafo: MallaCurricularGraph) => {

    const [progreso, setProgreso] = useState<ProgresoMalla>(
        () => {
            const estadoInicial: ProgresoMalla = {};
            grafo.getAllNodes().forEach((materia) => {
                if (materia.semestre === 1) {
                    estadoInicial[materia.codigoMateria] = "disponible";
                } else {
                    estadoInicial[materia.codigoMateria] = "bloqueada";
                }
            });
            return estadoInicial;
        }
    );

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
                return progresoActual;
            }

            if (estadoActualDeLaMateria === "disponible") {
                // CORRECCIÓN: Asignación (=), no comparación (===)
                nuevoProgreso[codigoMateria] = "aprobada";

                const prelaciones = grafo.getMateriasQueDesbloquea(codigoMateria);

                prelaciones.forEach(candidata => {
                    const reqCandidata = grafo.getMateriasRequeridas(candidata);
                    const ucActual = calcularUCAcumuladas(nuevoProgreso, grafo);

                    const cumpleTodoLosReq = reqCandidata.every(req => nuevoProgreso[req] === "aprobada");

                    const infoCandidata = grafo.getNode(candidata);
                    const ucRequeridas = infoCandidata?.ucRequeridas ?? 0;

                    if (cumpleTodoLosReq && ucActual >= ucRequeridas) {
                        nuevoProgreso[candidata] = "disponible";
                    }
                });
            }

            // --- CASO 3: EL USUARIO QUIERE DESAPROBARLA (Me equivoqué al hacer clic) ---
            else if (estadoActualDeLaMateria === "aprobada") {
                // 1. La regresamos a su estado original (disponible para cursarse)
                nuevoProgreso[codigoMateria] = "disponible";

                // 2. Tumbamos el castillo de naipes (Efecto dominó)
                const materiasQueBloquear = [...grafo.getMateriasQueDesbloquea(codigoMateria)];

                while (materiasQueBloquear.length > 0) {
                    const mABloquear = materiasQueBloquear.pop();

                    if (!mABloquear) continue;

                    if (nuevoProgreso[mABloquear] !== "bloqueada") {
                        nuevoProgreso[mABloquear] = "bloqueada";

                        materiasQueBloquear.push(...grafo.getMateriasQueDesbloquea(mABloquear));
                    }
                }
            }

            return nuevoProgreso;
        });

    }, [progreso, grafo]);

    return {
        progreso,
        cantidadAprobadas,
        ucAcumuladas,
        toggleAprobacion
    }


}