import React from 'react';
import Joyride from 'react-joyride';
import type { Step, EventData } from 'react-joyride';
import { useTheme, AVAILABLE_THEMES } from '../../contexts/ThemeContext';

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

interface MainAppTourProps {
    run: boolean;
    handleJoyrideCallback: (data: EventData) => void;
}

export const MainAppTour: React.FC<MainAppTourProps> = ({ run, handleJoyrideCallback }) => {
    const { theme } = useTheme();

    // Obtener el color hexadecimal activo para pasárselo a Joyride
    const activeThemeHex = AVAILABLE_THEMES.find(t => t.id === theme)?.hex || '#3b82f6'; // Azul por defecto

    return (
        <Joyride
            steps={TOUR_STEPS}
            run={run}
            continuous
            showProgress
            showSkipButton
            disableScrolling={true}
            callback={handleJoyrideCallback}
            styles={{
                options: {
                    zIndex: 10000,
                    primaryColor: activeThemeHex,
                    textColor: '#1e293b',
                    backgroundColor: '#ffffff',
                    arrowColor: '#ffffff',
                    overlayColor: 'rgba(0, 0, 0, 0.5)',
                },
                tooltipContainer: {
                    textAlign: 'left'
                },
                buttonNext: {
                    backgroundColor: activeThemeHex,
                    borderRadius: '8px',
                    padding: '8px 16px',
                    fontFamily: 'inherit',
                    fontWeight: 600,
                },
                buttonBack: {
                    color: '#64748b',
                    fontFamily: 'inherit',
                    fontWeight: 500,
                },
                buttonSkip: {
                    color: '#94a3b8',
                    fontFamily: 'inherit',
                }
            }}
            locale={{
                back: 'Atrás',
                close: 'Cerrar',
                last: 'Terminar',
                next: 'Siguiente',
                skip: 'Saltar tutorial',
            }}
        />
    );
};
