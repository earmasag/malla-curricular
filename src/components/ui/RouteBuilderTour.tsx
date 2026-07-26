import React from 'react';
import type { Step, EventData } from 'react-joyride';
import { SharedTour } from './SharedTour';

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
        <SharedTour
            run={run}
            steps={TOUR_STEPS}
            handleJoyrideCallback={handleJoyrideCallback}
        />
    );
};
