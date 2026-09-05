import type { ProgresoMalla } from '../../types/materia';
import { MallaCurricularGraph } from '../../core/MallaCurricularGraph';
import { useMallaConnections } from '../../hooks/malla/useMallaConnections';
import { useConnectionPaths } from '../../hooks/malla/useConnectionPaths';

interface MallaConnectionsProps {
    grafo: MallaCurricularGraph;
    progreso: ProgresoMalla;
    hoveredMateria: string | null;
    containerRef: React.RefObject<HTMLElement | null>;
    areasColorMap: Record<string, string>;
}

export default function MallaConnections({ grafo, progreso, hoveredMateria, containerRef, areasColorMap }: MallaConnectionsProps) {
    // 1. Obtener la lista abstracta de flechas (QUÉ dibujar)
    const arrowsToRender = useMallaConnections(grafo, progreso, hoveredMateria, areasColorMap);

    // 2. Traducirlas a rutas SVG según posiciones del DOM (DÓNDE dibujar)
    const paths = useConnectionPaths(arrowsToRender, containerRef);

    if (paths.length === 0) return null;

    return (
        <svg
            className="absolute top-0 left-0 pointer-events-none z-0 overflow-visible will-change-transform transform-gpu"
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
                {/* Definir marcadores dinámicamente según colores en uso */}
                {Array.from(new Set(paths.map(p => p.color))).map(color => (
                    <marker
                        key={`marker-${color}`}
                        id={`marker-${color.replace('#', '')}`}
                        markerWidth="12"
                        markerHeight="12"
                        refX="2"
                        refY="6"
                        orient="auto-start-reverse"
                        markerUnits="userSpaceOnUse"
                    >
                        <polygon points="0,2 10,6 0,10" fill={color} />
                    </marker>
                ))}
            </defs>

            {paths.map((path) => (
                <g key={path.id}>
                    {/* Línea principal curva con marcador nativo */}
                    <path
                        d={path.d}
                        stroke={path.color}
                        strokeWidth={3}
                        fill="none"
                        opacity={path.opacity}
                        strokeDasharray={path.strokeDasharray}
                        markerEnd={`url(#${path.markerId})`}
                        style={{
                            animation: path.animated ? 'dashAnimation 1s linear infinite' : 'none'
                        }}
                    />
                </g>
            ))}
        </svg>
    );
}
