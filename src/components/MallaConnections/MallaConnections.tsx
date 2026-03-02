import Xarrow from 'react-xarrows';
import type { ProgresoMalla } from '../../types/materia';
import { MallaCurricularGraph } from '../../core/MallaCurricularGraph';
import { useMallaConnections } from '../../hooks/useMallaConnections';

interface MallaConnectionsProps {
    grafo: MallaCurricularGraph;
    progreso: ProgresoMalla;
    hoveredMateria: string | null;
}

export default function MallaConnections({ grafo, progreso, hoveredMateria }: MallaConnectionsProps) {
    // Delegamos la lógica compleja de cálculo de arcos al nuevo hook
    const arrowsToRender = useMallaConnections(grafo, progreso, hoveredMateria);

    return (
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
            {arrowsToRender.map((arrowProps) => (
                <Xarrow
                    key={`${arrowProps.start}-${arrowProps.end}`}
                    start={arrowProps.start}
                    end={arrowProps.end}
                    path="grid"
                    startAnchor="right"
                    endAnchor="left"
                    color={arrowProps.color}
                    strokeWidth={2}
                    dashness={arrowProps.dashness}
                    showHead={true}
                    headSize={4}
                    passProps={arrowProps.passProps}
                />
            ))}
        </div>
    );
}
