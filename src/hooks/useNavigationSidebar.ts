import React, { useState } from 'react';
import { useNotification } from './useNotification';
import { useMallaData, useMallaUI } from '../contexts/MallaContexts';
import { useIsMobile } from './useIsMobile';

export const useNavigationSidebar = () => {
    const { estadoMalla, accionesMalla, estadoCustom, accionesCustom } = useMallaData();
    const { modales, handlers } = useMallaUI();
    const { confirm } = useNotification();
    const isMobile = useIsMobile();

    const { cantidadAprobadas, ucAcumuladas, materiasCursando } = estadoMalla;
    const {
        isCustomRouteMode,
        currentSemesterUCs,
        totalCustomUCs,
        customSemesters,
        hasDraftRoute
    } = estadoCustom;

    const ucCursando = materiasCursando.reduce((sum: number, m: any) => sum + m.unidadesCredito, 0);
    const customSemestersCount = customSemesters.length;
    const customCurrentSemesterCount = customSemestersCount > 0 ? customSemesters[customSemestersCount - 1].length : 0;

    const [isExpanded, setIsExpanded] = useState(false);

    const handleResetProgreso = async (e: React.MouseEvent) => {
        e.stopPropagation();
        const isConfirmed = await confirm("¿Estás seguro que deseas borrar todo tu progreso? Esta acción no se puede deshacer.", {
            isDestructive: true,
            confirmText: "Borrar Todo"
        });
        if (isConfirmed) {
            accionesMalla.resetProgreso();
        }
    };

    return {
        ui: {
            isMobile,
            isExpanded,
            setIsExpanded,
            modales
        },
        mallaStats: {
            cantidadAprobadas,
            ucAcumuladas,
            ucCursando
        },
        customRouteState: {
            isCustomRouteMode,
            currentSemesterUCs,
            totalCustomUCs,
            customCurrentSemesterCount,
            customSemestersCount,
            hasDraftRoute
        },
        actions: {
            handleResetProgreso,
            accionesCustom,
            handlers
        }
    };
};

