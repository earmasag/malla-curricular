import { useMemo } from 'react';
import { MallaCurricularGraph } from '../core/MallaCurricularGraph';
import type { ProgresoMalla } from '../types/materia';
import type { MateriaNode } from '../types/materia';

export interface ArrowConfig {
    start: string;
    end: string;
    color: string;
    dashness: boolean;
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

                // Determinamos el color y estilo visual de la flecha basándonos en el estado
                let color = "#cbd5e1"; // slate-300 por defecto para materias futuras/bloqueadas
                let dashness = true; // punteadas para rutas lejanas
                let opacity = 0.5; // Medio transparentes para no molestar

                if (estadoOrigen === "aprobada" && estadoDestino === "disponible") {
                    // Ruta que acabamos de abrir (origen listo, destino listo)
                    color = "#3b82f6"; // Azul brillante
                    dashness = false;
                    opacity = 1;
                } else if (estadoOrigen === "aprobada" && estadoDestino === "aprobada") {
                    // Ruta del pasado (ya la cruzamos)
                    color = "#22c55e"; // Verde éxito
                    dashness = false;
                    opacity = 0.3; // Casi transparentes para no hacer ruido
                }

                // Solo dibujar si la materia actual o su destino es la que estamos haciendo hover
                // Para no saturar, mostramos TODAS las prelaciones y subsecuentes de la materia bajo el mouse.
                if (hoveredMateria !== null && (hoveredMateria === codigoDestino || hoveredMateria === codigoOrigen)) {
                    arrows.push({
                        start: codigoOrigen,
                        end: codigoDestino,
                        color,
                        dashness,
                        passProps: { opacity: opacity + 0.3 } // Unimos la opacidad para que resalte más en hover
                    });
                }
            });
        });

        return arrows;
    }, [grafo, progreso, hoveredMateria]); // Recalcular solo cuando cambian estas variables

    return connections;
};
