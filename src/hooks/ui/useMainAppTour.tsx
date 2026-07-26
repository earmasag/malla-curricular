import { useState, useEffect, useCallback } from 'react';
import type { Step, EventData } from 'react-joyride';
import { STATUS } from 'react-joyride';

const TOUR_STEPS: Step[] = [
    {
        target: '.materia-card',
        title: 'Interactúa con tu malla',
        content: (
            <span>
                Haz clic en una materia para marcarla como <strong>Aprobada</strong>. Si haces clic de nuevo pasará a <strong>Cursando</strong>, y con un tercer clic volverá a la normalidad. ¡También puedes usar clic derecho para marcar que la estás cursando ahora mismo!
            </span>
        ),
        placement: 'right',
        disableBeacon: true,
    },
    {
        target: '#tour-main-stats',
        title: 'Tu progreso académico',
        content: (
            <span>
                Aquí podrás ver de un vistazo cuántas materias y Unidades de Crédito has aprobado, y en qué semestre te encuentras.
            </span>
        ),
        placement: 'right',
    },
    {
        target: '#tour-main-ruta-optima',
        title: 'Ruta Óptima',
        content: (
            <span>
                Este botón te sugiere automáticamente las mejores materias que deberías inscribir en tu próximo semestre para no atrasarte.
            </span>
        ),
        placement: 'right',
    },
    {
        target: '#tour-main-crear-ruta',
        title: '¡Crea tu propio camino!',
        content: (
            <span>
                Entra al Modo Constructor para planificar de forma interactiva tu futuro académico semestre por semestre.
            </span>
        ),
        placement: 'right',
    },
    {
        target: '#tour-main-matricula',
        title: 'Calculadora de Matrícula',
        content: (
            <span>
                Calcula de forma rápida el costo estimado de tu próximo semestre basándote en las UCs que planeas cursar.
            </span>
        ),
        placement: 'right',
    },
    {
        target: '#tour-main-mis-rutas',
        title: 'Tus rutas guardadas',
        content: (
            <span>
                Aquí podrás gestionar y cargar todas las rutas personalizadas que hayas guardado previamente.
            </span>
        ),
        placement: 'right',
    },
    {
        target: '#tour-main-temas',
        title: 'Personaliza tu experiencia',
        content: (
            <span>
                Elige entre los distintos colores de temas disponibles para que la malla luzca exactamente a tu gusto.
            </span>
        ),
        placement: 'right',
    },
    {
        target: '#tour-main-borrar-todo',
        title: 'Reiniciar progreso',
        content: (
            <span>
                Si alguna vez deseas empezar de cero, usa este botón para borrar tu progreso actual.
            </span>
        ),
        placement: 'right',
    }
];

export const useMainAppTour = (isCustomRouteMode: boolean) => {
    const [run, setRun] = useState(false);
    const [steps] = useState<Step[]>(TOUR_STEPS);
    const [hasMounted, setHasMounted] = useState(false);

    useEffect(() => {
        setHasMounted(true);
    }, []);

    useEffect(() => {
        if (!hasMounted) return;
        
        // Solo ejecutamos este tour si NO estamos en el constructor
        if (!isCustomRouteMode) {
            const hasSeenTour = localStorage.getItem('hasSeenMainTour');
            if (!hasSeenTour) {
                // Pequeño retraso para asegurar que los elementos del DOM estén renderizados
                const timer = setTimeout(() => setRun(true), 800);
                return () => clearTimeout(timer);
            }
        } else {
            setRun(false); // Detener si entramos al constructor
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
            localStorage.setItem('hasSeenMainTour', 'true');
        }
    }, []);

    return {
        run,
        steps,
        startTourManually,
        handleJoyrideCallback
    };
};
