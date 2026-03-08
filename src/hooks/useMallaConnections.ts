import { useMemo } from 'react';
import { MallaCurricularGraph } from '../core/MallaCurricularGraph';
import type { ProgresoMalla } from '../types/materia';
import type { MateriaNode } from '../types/materia';

export interface ArrowConfig {
    start: string;
    end: string;
    color: string;
    dashness: boolean | { strokeLen?: number, nonStrokeLen?: number, animation?: boolean | number };
    passProps: { opacity: number };
}

export const useMallaConnections = (
    grafo: MallaCurricularGraph,
    progreso: ProgresoMalla,
    hoveredMateria: string | null
) => {

    // Memoizamos el cálculo de las flechas para que solo cambie si cambia el grafo o el progreso
    const connections = useMemo(() => {
        const arrows: ArrowConfig[] = [];
        const nodos = grafo.getAllNodes();

        nodos.forEach((materia: MateriaNode) => {
            const codigoDestino = materia.codigoMateria;
            const estadoDestino = progreso[codigoDestino];

            // Obtenemos los códigos de los pre-requisitos de ESTA materia
            const preRequisitos = grafo.getMateriasRequeridas(codigoDestino);

            preRequisitos.forEach((codigoOrigen: string) => {
                const estadoOrigen = progreso[codigoOrigen];

                // Determinamos si la flecha apunta hacia la materia hovered (entonces es un prerrequisito DEL target)
                // O si la materia hovered apunta hacia otra (entonces la hovered la DESBLOQUEA)
                const isPrerequisiteQuery = hoveredMateria === codigoDestino;
                const isUnlockQuery = hoveredMateria === codigoOrigen;

                // Solo dibujar si la materia actual o su destino es la que estamos haciendo hover
                if (hoveredMateria !== null && (isPrerequisiteQuery || isUnlockQuery)) {
                    // Propiedades base
                    let color = "#94a3b8"; // slate-400 por defecto
                    let opacity = 0.6;

                    // Colores por estados (opcional para dar más contexto al progreso)
                    if (estadoOrigen === "aprobada" && estadoDestino === "disponible") {
                        color = "#3b82f6"; // Azul brillante (Ruta recien abierta)
                        opacity = 1;
                    } else if (estadoOrigen === "aprobada" && estadoDestino === "aprobada") {
                        color = "#22c55e"; // Verde éxito (Ruta superada)
                        opacity = 0.4;
                    } else if (estadoOrigen !== "aprobada" && estadoDestino !== "aprobada") {
                        color = "#ef4444"; // Rojo (Bloqueada)
                    }

                    // Prerrequisitos / Desbloqueos son siempre continuos
                    arrows.push({
                        start: codigoOrigen,
                        end: codigoDestino,
                        color,
                        dashness: false,
                        passProps: { opacity }
                    });
                }
            });

            // 2. Procesamos los Correquisitos
            const correquisitos = grafo.getCorrequisitos(codigoDestino);

            correquisitos.forEach((codigoCorrequisito: string) => {
                const estadoCorrequisito = progreso[codigoCorrequisito];
                const isCorrequisitoQuery = hoveredMateria === codigoDestino;
                const isTargetOfCorrequisito = hoveredMateria === codigoCorrequisito;

                if (hoveredMateria !== null && (isCorrequisitoQuery || isTargetOfCorrequisito)) {
                    // Flechas de Correquisitos: Punteadas y Violetas
                    let color = "#8b5cf6"; // Violeta/Púrpura por defecto para correquisitos
                    let opacity = 0.7;

                    if (estadoCorrequisito === "aprobada") {
                        color = "#c084fc"; // Violeta más claro si ya está aprobado
                        opacity = 0.4;
                    }

                    arrows.push({
                        start: codigoCorrequisito, // Desde la que es requerida cursar simultáneamente
                        end: codigoDestino,        // Hacia la materia principal
                        color,
                        dashness: { strokeLen: 4, nonStrokeLen: 4, animation: true }, // CORREQUISITOS PUNTEADOS
                        passProps: { opacity }
                    });
                }
            });
        });

        return arrows;
    }, [grafo, progreso, hoveredMateria]); // Recalcular solo cuando cambian estas variables

    return connections;
};
