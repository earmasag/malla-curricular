import { useState, useEffect, useCallback } from 'react';
import type { Step, EventData } from 'react-joyride';
import { STATUS } from 'react-joyride';

const TOUR_STEPS: Step[] = [
    {
        target: '#tour-modo-constructor',
        content: '¡Bienvenido al Modo Constructor! Aquí podrás planificar tu propia ruta académica semestre por semestre.',
        skipBeacon: true,
        placement: 'center',
    },
    {
        target: '#tour-malla-grid',
        content: 'Haz clic en las materias de la malla que deseas cursar en tu primer semestre de planificación. Solo podrás seleccionar las que tengan sus prelaciones aprobadas.',
        placement: 'right',
    },
    {
        target: '#tour-stats',
        content: 'Aquí verás cuántas Unidades de Crédito (UCs) y materias has seleccionado para el semestre actual que estás armando.',
        placement: 'right',
    },
    {
        target: '#tour-avanzar',
        content: 'Una vez hayas seleccionado todas las materias para este semestre, haz clic aquí para avanzar y empezar a planificar el siguiente semestre. (Si te equivocas, aparecerá un botón para retroceder).',
        placement: 'right',
    },
    {
        target: '#tour-guardar',
        content: 'Cuando hayas terminado de planificar todos tus semestres, haz clic en "Guardar y Terminar" para nombrar y guardar tu nueva ruta personalizada.',
        placement: 'right',
    }
];

export const useRouteBuilderTour = (isCustomRouteMode: boolean) => {
    const [run, setRun] = useState(false);
    const [steps] = useState<Step[]>(TOUR_STEPS);
    const [hasMounted, setHasMounted] = useState(false);

    useEffect(() => {
        setHasMounted(true);
    }, []);

    useEffect(() => {
        if (!hasMounted) return;
        
        if (isCustomRouteMode) {
            const hasSeenTour = localStorage.getItem('hasSeenRouteTour');
            if (!hasSeenTour) {
                // Pequeño retraso para asegurar que los elementos del DOM estén renderizados
                const timer = setTimeout(() => setRun(true), 500);
                return () => clearTimeout(timer);
            }
        } else {
            setRun(false); // Detener si salimos del modo
        }
    }, [isCustomRouteMode, hasMounted]);

    const startTourManually = useCallback(() => {
        setRun(true);
    }, []);

    const handleJoyrideCallback = useCallback((data: EventData) => {
        const { status } = data;
        const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];
        
        if (finishedStatuses.includes(status)) {
            setRun(false);
            localStorage.setItem('hasSeenRouteTour', 'true');
        }
    }, []);

    return {
        run,
        steps,
        startTourManually,
        handleJoyrideCallback
    };
};
