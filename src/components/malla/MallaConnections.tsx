import type { ProgresoMalla } from '../../types/materia';
import { MallaCurricularGraph } from '../../core/MallaCurricularGraph';
import { useMallaConnections } from '../../hooks/malla/useMallaConnections';
import { useConnectionPaths } from '../../hooks/malla/useConnectionPaths';

interface MallaConnectionsProps {
    grafo: MallaCurricularGraph;
    progreso: ProgresoMalla;
    hoveredMateria: string | null;
    containerRef: React.RefObject<HTMLElement | null>;
}

export default function MallaConnections({ grafo, progreso, hoveredMateria, containerRef }: MallaConnectionsProps) {
    // 1. Obtener la lista abstracta de flechas (QUÉ dibujar)
    const arrowsToRender = useMallaConnections(grafo, progreso, hoveredMateria);

    // 2. Traducirlas a rutas SVG según posiciones del DOM (DÓNDE dibujar)
    const paths = useConnectionPaths(arrowsToRender, containerRef);

    if (paths.length === 0) return null;

    return (
        <svg
            className="absolute top-0 left-0 pointer-events-none z-0 overflow-visible"
            style={{ width: '100%', height: '100%' }}
        >
            {/* Definimos animaciones SVG si las necesitamos (reemplazo de xarrows animation) */}
            <defs>
                <style>
                    {`
                    @keyframes dashAnimation {
                        to {
                            stroke-dashoffset: -20;
                        }
                    }
                    `}
                </style>
            </defs>

            {paths.map((path) => (
                <g key={path.id}>
                    {/* Línea principal */}
                    <path
                        d={path.d}
                        stroke={path.color}
                        strokeWidth={3}
                        fill="none"
                        opacity={path.opacity}
                        strokeDasharray={path.strokeDasharray}
                        style={{
                            animation: path.animated ? 'dashAnimation 1s linear infinite' : 'none'
                        }}
                    />
                    {/* Cabeza de flecha */}
                    <polygon
                        points={path.arrowheadPoints}
                        fill={path.color}
                        opacity={path.opacity}
                    />
                </g>
            ))}
        </svg>
    );
}
