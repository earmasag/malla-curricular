import { toPng, toJpeg } from 'html-to-image';
import { jsPDF } from 'jspdf';
import type { MallaCurricularGraph } from '../core/MallaCurricularGraph';
import type { MateriaNode } from '../types/materia';
import type { ArrowConfig } from '../hooks/malla/useMallaConnections';

export interface CalculatedPath {
    id: string;
    d: string;
    color: string;
    opacity: number;
    strokeDasharray?: string;
    arrowheadPoints: string;
}

/**
 * Obtiene la lista completa de todas las flechas (prelaciones y correquisitos)
 * usando los colores por área de formación de la materia origen.
 */
export const getAllConnectionsWithAreaColors = (
    grafo: MallaCurricularGraph,
    areasColorMap: Record<string, string>
): ArrowConfig[] => {
    const arrows: ArrowConfig[] = [];
    const nodos = grafo.getAllNodes();

    nodos.forEach((materia: MateriaNode) => {
        const codigoDestino = materia.codigoMateria;

        // 1. Prelaciones
        const preRequisitos = grafo.getMateriasRequeridas(codigoDestino);
        preRequisitos.forEach((codigoOrigen: string) => {
            const nodoOrigen = grafo.getNode(codigoOrigen);
            const color = (nodoOrigen?.areaFormacion && areasColorMap[nodoOrigen.areaFormacion])
                ? areasColorMap[nodoOrigen.areaFormacion]
                : "#64748b";

            arrows.push({
                start: codigoOrigen,
                end: codigoDestino,
                color,
                dashness: false,
                passProps: { opacity: 0.8 }
            });
        }); 

        // 2. Correquisitos
        const correquisitos = grafo.getCorrequisitos(codigoDestino);
        correquisitos.forEach((codigoCorrequisito: string) => {
            const nodoCorreq = grafo.getNode(codigoCorrequisito);
            const color = (nodoCorreq?.areaFormacion && areasColorMap[nodoCorreq.areaFormacion])
                ? areasColorMap[nodoCorreq.areaFormacion]
                : "#64748b";

            arrows.push({
                start: codigoCorrequisito,
                end: codigoDestino,
                color,
                dashness: { strokeLen: 4, nonStrokeLen: 4, animation: false },
                passProps: { opacity: 0.8 }
            });
        });
    });

    return arrows;
};

export interface ExportMallaOptions {
    container: HTMLElement;
    grafo: MallaCurricularGraph;
    areasColorMap: Record<string, string>;
    tituloCarrera?: string;
    planNombre?: string;
    filename: string;
    format: 'png' | 'pdf';
    exportMode: 'current' | 'clean';
}

/**
 * Ejecuta la captura completa de la malla en segundo plano (offscreen),
 * inyectando todas las flechas con colores por área de formación y exportando
 * como archivo PNG de alta resolución o PDF.
 */
export const exportMallaDocument = async ({
    container,
    grafo,
    areasColorMap,
    tituloCarrera,
    planNombre,
    filename,
    format,
    exportMode
}: ExportMallaOptions): Promise<void> => {
    // 1. Obtener dimensiones del contenedor original en layout no escalado
    const containerWidth = Math.ceil(container.scrollWidth);
    const containerHeight = Math.ceil(container.scrollHeight);

    // 2. Clonar el árbol DOM de la malla
    const clone = container.cloneNode(true) as HTMLElement;

    // Remover SVG interactivo previo si existía en el clon (solo en modo clean)
    const prevSvg = clone.querySelector('svg');
    if (prevSvg && exportMode === 'clean') {
        prevSvg.remove();
    }

    // Remover anillos o estados de selección activos en el clon
    clone.querySelectorAll('.ring-4').forEach((el) => {
        el.classList.remove('ring-4', 'ring-offset-2', 'ring-theme-500');
    });

    // Renombrar IDs del clon para evitar conflictos con el DOM real
    // (los necesitamos únicos para calcular posiciones desde el clon montado)
    clone.querySelectorAll('[id]').forEach((el) => {
        el.setAttribute('data-export-id', el.id);
        el.removeAttribute('id');
    });

    // 3. Montar en contenedor oculto fuera de pantalla ANTES de calcular rutas
    // (para que los elementos tengan posiciones reales sin zoom)
    const offscreenWrapper = document.createElement("div");
    offscreenWrapper.style.position = "fixed";
    offscreenWrapper.style.left = "-99999px";
    offscreenWrapper.style.top = "0";
    offscreenWrapper.style.width = `${containerWidth}px`;
    offscreenWrapper.style.height = `${containerHeight}px`;
    offscreenWrapper.style.backgroundColor = "#ffffff";
    offscreenWrapper.style.zIndex = "-9999";
    offscreenWrapper.style.overflow = "visible";

    offscreenWrapper.appendChild(clone);
    document.body.appendChild(offscreenWrapper);

    try {
        // Pausa para que el navegador haga layout del clon montado
        await new Promise((resolve) => setTimeout(resolve, 100));

        // Función auxiliar para buscar elemento clonado por su data-export-id
        const getClonedEl = (id: string): HTMLElement | null => {
            return clone.querySelector(`[data-export-id="${id}"]`) as HTMLElement | null;
        };

        // Helper: offset relativo dentro del clon montado
        const getOffset = (element: HTMLElement, containerEl: HTMLElement) => {
            let x = 0;
            let y = 0;
            let current: HTMLElement | null = element;
            while (current && current !== containerEl && current !== document.body) {
                x += current.offsetLeft;
                y += current.offsetTop;
                current = current.offsetParent as HTMLElement;
            }
            return { x, y, width: element.offsetWidth, height: element.offsetHeight };
        };

        // 4. Calcular todas las flechas usando el clon montado (solo si es modo clean)
        if (exportMode === 'clean') {
        const allArrows = getAllConnectionsWithAreaColors(grafo, areasColorMap);
        const allPaths: CalculatedPath[] = [];

        allArrows.forEach((arrow) => {
            const startEl = getClonedEl(arrow.start);
            const endEl = getClonedEl(arrow.end);
            if (!startEl || !endEl) return;

            const startPos = getOffset(startEl, clone);
            const endPos = getOffset(endEl, clone);

            const startX = startPos.x + startPos.width;
            const startY = startPos.y + (startPos.height / 2);
            const endX = endPos.x - 2;
            const endY = endPos.y + (endPos.height / 2);
            const midX = (startX + endX) / 2;

            const d = `M ${startX} ${startY} C ${midX} ${startY}, ${midX} ${endY}, ${endX} ${endY}`;

            const arrowSize = 6;
            const arrowheadPoints = `${endX},${endY} ${endX - arrowSize},${endY - arrowSize / 1.2} ${endX - arrowSize},${endY + arrowSize / 1.2}`;

            let strokeDasharray: string | undefined = undefined;
            if (typeof arrow.dashness === 'object' && arrow.dashness !== null) {
                const stroke = (arrow.dashness as { strokeLen?: number }).strokeLen || 4;
                const nonStroke = (arrow.dashness as { nonStrokeLen?: number }).nonStrokeLen || 4;
                strokeDasharray = `${stroke},${nonStroke}`;
            } else if (arrow.dashness === true) {
                strokeDasharray = "4,4";
            }

            allPaths.push({
                id: `${arrow.start}-${arrow.end}`,
                d,
                color: arrow.color,
                opacity: arrow.passProps?.opacity ?? 0.8,
                strokeDasharray,
                arrowheadPoints
            });
        });

        // 5. Construir SVG con todas las flechas e insertarlo en el clon
        const svgNS = "http://www.w3.org/2000/svg";
        const fullSvg = document.createElementNS(svgNS, "svg");
        fullSvg.setAttribute("width", `${containerWidth}`);
        fullSvg.setAttribute("height", `${containerHeight}`);
        fullSvg.setAttribute("viewBox", `0 0 ${containerWidth} ${containerHeight}`);
        fullSvg.style.position = "absolute";
        fullSvg.style.top = "0";
        fullSvg.style.left = "0";
        fullSvg.style.width = "100%";
        fullSvg.style.height = "100%";
        fullSvg.style.pointerEvents = "none";
        fullSvg.style.zIndex = "0";

        allPaths.forEach((p) => {
            const g = document.createElementNS(svgNS, "g");

            const pathEl = document.createElementNS(svgNS, "path");
            pathEl.setAttribute("d", p.d);
            pathEl.setAttribute("stroke", p.color);
            pathEl.setAttribute("stroke-width", "2.5");
            pathEl.setAttribute("fill", "none");
            pathEl.setAttribute("opacity", String(p.opacity));
            if (p.strokeDasharray) {
                pathEl.setAttribute("stroke-dasharray", p.strokeDasharray);
            }
            g.appendChild(pathEl);

            const polygon = document.createElementNS(svgNS, "polygon");
            polygon.setAttribute("points", p.arrowheadPoints);
            polygon.setAttribute("fill", p.color);
            polygon.setAttribute("opacity", String(p.opacity));
            g.appendChild(polygon);

            fullSvg.appendChild(g);
        });

        clone.insertBefore(fullSvg, clone.firstChild);

        // 5.5 Inyectar UC requeridas en el SVG
        grafo.getAllNodes().forEach((materia) => {
            if (materia.ucRequeridas > 0) {
                const el = getClonedEl(materia.codigoMateria);
                if (!el) return;
                const pos = getOffset(el, clone);
                
                const ucY = pos.y + (pos.height / 2);
                const ucX = pos.x;

                const g = document.createElementNS(svgNS, "g");
                const color = (materia.areaFormacion && areasColorMap[materia.areaFormacion]) 
                    ? areasColorMap[materia.areaFormacion] 
                    : "#000000";

                const line = document.createElementNS(svgNS, "line");
                line.setAttribute("x1", String(ucX - 30));
                line.setAttribute("y1", String(ucY));
                line.setAttribute("x2", String(ucX - 5));
                line.setAttribute("y2", String(ucY));
                line.setAttribute("stroke", color);
                line.setAttribute("stroke-width", "3");
                g.appendChild(line);

                const poly = document.createElementNS(svgNS, "polygon");
                poly.setAttribute("points", `${ucX},${ucY} ${ucX - 6},${ucY - 4} ${ucX - 6},${ucY + 4}`);
                poly.setAttribute("fill", color);
                g.appendChild(poly);

                const text = document.createElementNS(svgNS, "text");
                text.setAttribute("x", String(ucX - 15));
                text.setAttribute("y", String(ucY - 6));
                text.setAttribute("fill", "#000000");
                text.setAttribute("font-size", "11");
                text.setAttribute("font-family", "Oswald, sans-serif");
                text.setAttribute("font-weight", "bold");
                text.setAttribute("text-anchor", "middle");
                text.textContent = `${materia.ucRequeridas} UC`;
                g.appendChild(text);

                fullSvg.appendChild(g);
            }
        });

        // 5.6 Limpiar estilos de las materias para que se vean vírgenes
        clone.querySelectorAll('.materia-card').forEach(card => {
            card.classList.remove('opacity-50');
            card.classList.add('opacity-100');

            const innerDiv = card.querySelector('.absolute.left-5.bg-white') as HTMLElement;
            if (innerDiv) {
                innerDiv.style.backgroundImage = 'none';
                innerDiv.style.backgroundColor = '#ffffff';
            }

            card.querySelectorAll('.text-gray-500').forEach(el => {
                el.classList.remove('text-gray-500');
                el.classList.add('text-black');
            });
            
            const ribbon = card.querySelector('.z-30');
            if (ribbon) ribbon.remove();
            
            card.classList.remove('shadow-[0_0_15px_rgba(59,130,246,0.6)]', 'ring-2', 'ring-blue-400', 'ring-offset-1');
            card.classList.add('shadow-sm');
        });
        } // Fin if exportMode === 'clean'

        // 6. Inyectar encabezado visible en la exportación
        if (tituloCarrera || planNombre) {
            const headerBanner = document.createElement("div");
            headerBanner.style.position = "absolute";
            headerBanner.style.top = "28px";
            headerBanner.style.left = "48px";
            headerBanner.style.display = "flex";
            headerBanner.style.flexDirection = "column";
            headerBanner.style.gap = "4px";
            headerBanner.style.zIndex = "20";

            if (tituloCarrera) {
                const h1 = document.createElement("h1");
                h1.textContent = tituloCarrera;
                h1.style.fontSize = "26px";
                h1.style.fontWeight = "800";
                h1.style.color = "#1e293b";
                h1.style.margin = "0";
                h1.style.fontFamily = "system-ui, -apple-system, sans-serif";
                headerBanner.appendChild(h1);
            }

            if (planNombre) {
                const p = document.createElement("p");
                p.textContent = `${planNombre} • Mapa Curricular con Todas las Prelaciones`;
                p.style.fontSize = "14px";
                p.style.fontWeight = "600";
                p.style.color = "#64748b";
                p.style.margin = "0";
                p.style.fontFamily = "system-ui, -apple-system, sans-serif";
                headerBanner.appendChild(p);
            }

            clone.appendChild(headerBanner);
        }

        // Pausa extra para render del SVG y encabezado
        await new Promise((resolve) => setTimeout(resolve, 150));

        const exportOptions = {
            pixelRatio: 2,
            backgroundColor: "#ffffff",
            width: containerWidth,
            height: containerHeight,
            style: {
                transform: 'none'
            }
        };

        if (format === 'png') {
            const imgData = await toPng(clone, exportOptions);
            // Agregamos el link al body para garantizar el click en todos los navegadores
            const link = document.createElement("a");
            link.download = `${filename}.png`;
            link.href = imgData;
            link.style.display = "none";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else {
            const imgData = await toJpeg(clone, { ...exportOptions, quality: 0.95 });
            const imgWidth = containerWidth * 2;
            const imgHeight = containerHeight * 2;
            const orientation = imgWidth > imgHeight ? "landscape" : "portrait";

            const pdf = new jsPDF({
                orientation,
                unit: "px",
                format: [imgWidth, imgHeight],
                compress: true
            });

            pdf.addImage(imgData, "JPEG", 0, 0, imgWidth, imgHeight);
            pdf.save(`${filename}.pdf`);
        }
    } finally {
        offscreenWrapper.remove();
    }
};

