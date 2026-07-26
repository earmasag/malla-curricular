import React from 'react';
import Joyride from 'react-joyride';
import type { Step, EventData } from 'react-joyride';

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

interface RouteBuilderTourProps {
    run: boolean;
    handleJoyrideCallback: (data: EventData) => void;
}

export const RouteBuilderTour: React.FC<RouteBuilderTourProps> = ({ run, handleJoyrideCallback }) => {
    return (
        <Joyride
            onEvent={handleJoyrideCallback}
            continuous
            run={run}
            scrollToFirstStep
            steps={TOUR_STEPS}
            options={{
                showProgress: true,
                buttons: ['back', 'primary', 'skip'],
                zIndex: 10000,
                primaryColor: 'var(--theme-500)',
                textColor: '#334155', // slate-700
                backgroundColor: '#ffffff',
                overlayColor: 'rgba(0, 0, 0, 0.4)'
            }}
            styles={{
                tooltip: {
                    borderRadius: '24px',
                    fontFamily: 'var(--font-sans)',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                    padding: '28px', // Significant outer padding to push borders away
                },
                tooltipContent: {
                    padding: '12px 0 12px 0',
                    fontSize: '15px',
                    lineHeight: '1.6',
                },
                tooltipTitle: {
                    fontSize: '18px',
                    fontWeight: 'bold',
                    color: 'var(--theme-700)',
                    marginBottom: '8px',
                },
                buttonPrimary: {
                    backgroundColor: 'var(--theme-500)',
                    borderRadius: '10px',
                    fontWeight: 600,
                    padding: '8px 16px',
                },
                buttonBack: {
                    color: '#64748b', // slate-500
                    marginRight: '8px',
                    fontWeight: 500,
                },
                buttonSkip: {
                    color: '#94a3b8', // slate-400
                    fontWeight: 500,
                },
                tooltipContainer: {
                    textAlign: 'left'
                },
            }}
            locale={{
                back: 'Atrás',
                close: 'Cerrar',
                last: 'Finalizar',
                next: 'Siguiente',
                skip: 'Saltar tutorial'
            }}
        />
    );
};
