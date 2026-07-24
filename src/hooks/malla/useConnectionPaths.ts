import { useLayoutEffect, useState } from 'react';
import type { ArrowConfig } from './useMallaConnections';

export interface SvgPathData {
    id: string;
    d: string;
    color: string;
    opacity: number;
    strokeDasharray?: string;
    animated: boolean;
    arrowheadPoints: string;
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

    useLayoutEffect(() => {
        if (!containerRef.current || arrows.length === 0) {
            setPaths([]);
            return;
        }

        const container = containerRef.current;

        const newPaths: SvgPathData[] = arrows.map((arrow) => {
            const startEl = document.getElementById(arrow.start);
            const endEl = document.getElementById(arrow.end);

            if (!startEl || !endEl) return null;

            const startPos = getRelativeOffset(startEl, container);
            const endPos = getRelativeOffset(endEl, container);

            // Start at the right-center of the start element
            const startX = startPos.x + startPos.width;
            const startY = startPos.y + (startPos.height / 2);

            // End at the left-center of the end element
            // We subtract a few pixels so the arrowhead doesn't overlap the border too much
            const endX = endPos.x - 2; 
            const endY = endPos.y + (endPos.height / 2);
            
            // Midpoint for the grid path routing
            const midX = (startX + endX) / 2;

            // Generate path string: Move to start, Line horizontal to mid, Line vertical to endY, Line horizontal to end
            const d = `M ${startX} ${startY} L ${midX} ${startY} L ${midX} ${endY} L ${endX} ${endY}`;

            // Arrowhead points (pointing right)
            const arrowSize = 6;
            const arrowheadPoints = `
                ${endX},${endY} 
                ${endX - arrowSize},${endY - arrowSize/1.2} 
                ${endX - arrowSize},${endY + arrowSize/1.2}
            `;

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
                arrowheadPoints
            };
        }).filter(Boolean) as SvgPathData[];

        setPaths(newPaths);

    }, [arrows, containerRef]);

    return paths;
};
