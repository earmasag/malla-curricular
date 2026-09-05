import { useLayoutEffect, useState, useRef } from 'react';
import type { ArrowConfig } from './useMallaConnections';

export interface SvgPathData {
    id: string;
    d: string;
    color: string;
    opacity: number;
    strokeDasharray?: string;
    animated: boolean;
    markerId: string;
}

const getRelativeOffset = (element: HTMLElement, container: HTMLElement) => {
    let x = 0;
    let y = 0;
    let current: HTMLElement | null = element;
    
    while (current && current !== container && current !== document.body) {
        x += current.offsetLeft;
        y += current.offsetTop;
        current = current.offsetParent as HTMLElement;
    }
    
    return { x, y, width: element.offsetWidth, height: element.offsetHeight };
};

export const useConnectionPaths = (
    arrows: ArrowConfig[],
    containerRef: React.RefObject<HTMLElement | null>
) => {
    const [paths, setPaths] = useState<SvgPathData[]>([]);
    
    // Caché de posiciones DOM para evitar layout thrashing en cada hover
    const positionCache = useRef<Map<string, {x: number, y: number, width: number, height: number}>>(new Map());

    // Invalidar el caché si la ventana cambia de tamaño (el layout podría cambiar)
    useLayoutEffect(() => {
        const handleResize = () => positionCache.current.clear();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useLayoutEffect(() => {
        if (!containerRef.current || arrows.length === 0) {
            setPaths([]);
            return;
        }

        const container = containerRef.current;

        const getCachedPosition = (id: string) => {
            if (positionCache.current.has(id)) {
                return positionCache.current.get(id);
            }
            const el = document.getElementById(id);
            if (!el) return null;
            const pos = getRelativeOffset(el, container);
            positionCache.current.set(id, pos);
            return pos;
        };

        const newPaths: SvgPathData[] = arrows.map((arrow) => {
            const startPos = getCachedPosition(arrow.start);
            const endPos = getCachedPosition(arrow.end);

            if (!startPos || !endPos) return null;

            // Start at the right-center of the start element
            let startX = startPos.x + startPos.width;
            const startY = startPos.y + (startPos.height / 2);

            // End at the left-center of the end element (or right if routing backwards)
            let endX = endPos.x - 10; 
            const endY = endPos.y + (endPos.height / 2);
            
            let d = "";

            // Si la materia origen está en la misma columna (o a la derecha) de la destino
            if (startPos.x >= endPos.x - 20) {
                // Salimos por la derecha y entramos por la derecha haciendo una curva "C"
                startX = startPos.x + startPos.width;
                endX = endPos.x + endPos.width + 10; 
                const midX = Math.max(startX, endX) + 50; 
                
                d = `M ${startX} ${startY} C ${midX} ${startY}, ${midX} ${endY}, ${endX} ${endY}`;
            } else {
                // Flujo normal de izquierda a derecha con curva suave
                const midX = (startX + endX) / 2;
                d = `M ${startX} ${startY} C ${midX} ${startY}, ${midX} ${endY}, ${endX} ${endY}`;
            }

            let strokeDasharray = undefined;
            let animated = false;
            
            if (typeof arrow.dashness === 'object' && arrow.dashness !== null) {
                const stroke = arrow.dashness.strokeLen || 5;
                const nonStroke = arrow.dashness.nonStrokeLen || 5;
                strokeDasharray = `${stroke},${nonStroke}`;
                animated = !!arrow.dashness.animation;
            } else if (arrow.dashness === true) {
                strokeDasharray = "5,5";
            }

            return {
                id: `${arrow.start}-${arrow.end}`,
                d,
                color: arrow.color,
                opacity: arrow.passProps?.opacity ?? 1,
                strokeDasharray,
                animated,
                markerId: `marker-${arrow.color.replace('#', '')}`
            };
        }).filter(Boolean) as SvgPathData[];

        setPaths(newPaths);

    }, [arrows, containerRef]);

    return paths;
};
