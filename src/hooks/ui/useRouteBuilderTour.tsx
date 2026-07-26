import { useState, useEffect, useCallback } from 'react';
import type { Step, EventData } from 'react-joyride';
import { STATUS } from 'react-joyride';



const TOUR_STEPS: Step[] = [
    {
        target: '#tour-modo-constructor',
        title: '¡Modo Constructor!',
        content: (
            <span>
                Aquí podrás planificar tu propia ruta académica <strong>semestre por semestre</strong>.
            </span>
        ),
        skipBeacon: true,
        placement: 'center',
    },
    {
        target: '#tour-malla-grid',
        title: 'Selecciona tus materias',
        content: (
            <span>
                Haz clic en las materias que deseas cursar en tu <strong>primer semestre de planificación</strong>. Solo podrás seleccionar aquellas que tengan sus <strong>prelaciones aprobadas</strong>.
            </span>
        ),
        placement: 'right',
    },
    {
        target: '#tour-stats',
        title: 'Monitorea tu progreso',
        content: (
            <span>
                Aquí verás cuántas <strong>Unidades de Crédito (UCs)</strong> y materias has seleccionado para el semestre que estás armando.
            </span>
        ),
        placement: 'right',
    },
    {
        target: '#tour-avanzar',
        title: 'Avanza al siguiente semestre',
        content: (
            <span>
                Una vez hayas seleccionado <strong>todas las materias</strong> para este semestre, haz clic aquí para avanzar y empezar a planificar el siguiente. <em>(Si te equivocas, aparecerá un botón para retroceder)</em>.
            </span>
        ),
        placement: 'right',
    },
    {
        target: '#tour-guardar',
        title: '¡Guarda tu ruta!',
        content: (
            <span>
                Cuando hayas terminado de planificar todos tus semestres, haz clic en <strong>"Guardar y Terminar"</strong> para nombrar y guardar tu nueva ruta personalizada.
            </span>
        ),
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
