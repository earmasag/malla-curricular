import React from 'react';
import type { Step, EventData } from 'react-joyride';
import { SharedTour } from './SharedTour';

const TOUR_STEPS: Step[] = [
    {
        target: '.materia-card',
        title: 'Interactúa con tu malla',
        content: (
            <span>
                Haz clic en una materia para marcarla como <strong>Aprobada</strong>. Si haces clic de nuevo pasará a <strong>Cursando</strong>, y con un tercer clic volverá a la normalidad. ¡También puedes usar clic derecho para marcar que la estás cursando ahora mismo!
            </span>
        ),
        placement: 'auto',
        skipBeacon: true,
    },
    {
        target: '#tour-main-plan-switcher',
        title: 'Múltiples Planes de Estudio',
        content: (
            <span>
                Puedes cambiar entre el <strong>Plan 2024</strong> y el <strong>Plan 2027</strong>. Además, si estás en el Plan 2024, verás un botón para <strong>calcular y migrar automáticamente</strong> tu progreso al nuevo plan.
            </span>
        ),
        placement: 'bottom',
    },
    {
        target: '#tour-main-stats',
        title: 'Tu progreso académico',
        content: (
            <span>
                Aquí podrás ver de un vistazo cuántas materias y Unidades de Crédito has aprobado, y en qué semestre te encuentras.
            </span>
        ),
        placement: 'auto',
    },
    {
        target: '#tour-main-ruta-optima',
        title: 'Ruta Óptima',
        content: (
            <span>
                Este botón te sugiere automáticamente las mejores materias que deberías inscribir en tu próximo semestre para no atrasarte.
            </span>
        ),
        placement: 'auto',
    },
    {
        target: '#tour-main-crear-ruta',
        title: '¡Crea tu propio camino!',
        content: (
            <span>
                Entra al Modo Constructor para planificar de forma interactiva tu futuro académico semestre por semestre.
            </span>
        ),
        placement: 'auto',
    },
    {
        target: '#tour-main-matricula',
        title: 'Calculadora de Matrícula',
        content: (
            <span>
                Calcula de forma rápida el costo estimado de tu próximo semestre basándote en las UCs que planeas cursar.
            </span>
        ),
        placement: 'auto',
    },
    {
        target: '#tour-main-mis-rutas',
        title: 'Tus rutas guardadas',
        content: (
            <span>
                Aquí podrás gestionar y cargar todas las rutas personalizadas que hayas guardado previamente.
            </span>
        ),
        placement: 'auto',
    },
    {
        target: '#tour-main-sugerencias',
        title: 'Tu opinión importa',
        content: (
            <span>
                Desde aquí puedes solicitar tu carrera o reportar errores. Tu opinión da forma a la siguiente versión.
            </span>
        ),
        placement: 'auto',
    },
    {
        target: '#tour-main-temas',
        title: 'Personaliza tu experiencia',
        content: (
            <span>
                Elige entre los distintos colores de temas disponibles para que la malla luzca exactamente a tu gusto.
            </span>
        ),
        placement: 'auto',
    },
    {
        target: '#tour-main-borrar-todo',
        title: 'Reiniciar progreso',
        content: (
            <span>
                Si alguna vez deseas empezar de cero, usa este botón para borrar tu progreso actual.
            </span>
        ),
        placement: 'auto',
    }
];

interface MainAppTourProps {
    run: boolean;
    handleJoyrideCallback: (data: EventData) => void;
}

export const MainAppTour: React.FC<MainAppTourProps> = ({ run, handleJoyrideCallback }) => {
    return (
        <SharedTour
            run={run}
            steps={TOUR_STEPS}
            handleJoyrideCallback={handleJoyrideCallback}
        />
    );
};
