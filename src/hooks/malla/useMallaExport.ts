import { useState, useRef, useEffect } from 'react';
import { useMallaData, useMallaUI } from '../../contexts/MallaContexts';
import { useCarrera } from '../../contexts/CarreraContext';
import { usePlanEstudio } from '../../contexts/PlanContext';
import { exportMallaDocument } from '../../utils/mallaExport';

export const useMallaExport = () => {
    const { grafo } = useMallaData();
    const { ui } = useMallaUI();
    const { areasColorMap, activeCarreraId } = useCarrera();
    const { activePlanId } = usePlanEstudio();

    const [isExporting, setIsExporting] = useState(false);
    const [exportFormat, setExportFormat] = useState<'png' | 'pdf' | null>(null);
    const [showExportMenu, setShowExportMenu] = useState(false);
    const [exportMenuPos, setExportMenuPos] = useState({ top: 0, left: 0, bottom: 0, align: 'center' });
    const exportButtonRef = useRef<HTMLDivElement>(null);

    // Calcular posición del popover menú flotante
    useEffect(() => {
        if (showExportMenu && exportButtonRef.current) {
            const rect = exportButtonRef.current.getBoundingClientRect();
            const spaceBelow = window.innerHeight - rect.bottom;
            const spaceAbove = rect.top;
            
            let align = 'center';
            let top = rect.top + rect.height / 2;
            let bottom = 0;

            // El menú mide aprox 300px. Si no cabe centrado, lo anclamos arriba o abajo.
            if (spaceBelow < 150 && spaceAbove > spaceBelow) {
                align = 'bottom';
                bottom = window.innerHeight - rect.bottom + (rect.height / 2) - 20; // Anclado un poco arriba del fondo del botón
                top = 0;
            } else if (spaceAbove < 150 && spaceBelow > spaceAbove) {
                align = 'top';
                top = rect.top;
            }

            setExportMenuPos({
                top,
                bottom,
                left: rect.right + 16,
                align
            });
        }
    }, [showExportMenu]);

    // Cerrar menú al hacer click fuera, resize o scroll
    useEffect(() => {
        const handleHide = () => setShowExportMenu(false);
        if (showExportMenu) {
            window.addEventListener('resize', handleHide);
            document.addEventListener('scroll', handleHide, true);
            document.addEventListener('click', handleHide);
        }
        return () => {
            window.removeEventListener('resize', handleHide);
            document.removeEventListener('scroll', handleHide, true);
            document.removeEventListener('click', handleHide);
        };
    }, [showExportMenu]);

    const toggleExportMenu = (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowExportMenu((prev) => !prev);
    };

    const handleExport = async (format: 'png' | 'pdf', mode: 'current' | 'clean') => {
        if (isExporting) return;

        setShowExportMenu(false);

        const container = ui.contentRef?.current || document.getElementById('malla-content-grid');
        if (!container || !grafo) {
            console.error("No se encontró el contenedor de la malla o el grafo para exportar.");
            return;
        }

        setIsExporting(true);
        setExportFormat(format);

        try {
            const carreraName = activeCarreraId
                ? activeCarreraId.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())
                : "Carrera";
            const planName = activePlanId ? `Plan ${activePlanId}` : "";
            const filename = `malla-${activeCarreraId || 'carrera'}-${activePlanId || 'plan'}`;

            await exportMallaDocument({
                container,
                grafo,
                areasColorMap,
                tituloCarrera: carreraName,
                planNombre: planName,
                filename,
                format,
                exportMode: mode
            });
        } catch (error) {
            console.error("Error al exportar la malla curricular:", error);
        } finally {
            setIsExporting(false);
            setExportFormat(null);
        }
    };

    return {
        isExporting,
        exportFormat,
        showExportMenu,
        setShowExportMenu,
        exportMenuPos,
        exportButtonRef,
        toggleExportMenu,
        handleExport
    };
};
