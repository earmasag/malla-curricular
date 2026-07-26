import React from 'react';
import { Joyride } from 'react-joyride';
import type { Step, EventData } from 'react-joyride';

interface RouteBuilderTourProps {
    run: boolean;
    steps: Step[];
    handleJoyrideCallback: (data: EventData) => void;
}

export const RouteBuilderTour: React.FC<RouteBuilderTourProps> = ({ run, steps, handleJoyrideCallback }) => {
    return (
        <Joyride
            onEvent={handleJoyrideCallback}
            continuous
            run={run}
            scrollToFirstStep
            steps={steps}
            options={{
                showProgress: true,
                buttons: ['back', 'primary', 'skip'],
                zIndex: 10000,
                primaryColor: '#3b82f6',
                textColor: '#1f2937',
                backgroundColor: '#ffffff',
                overlayColor: 'rgba(0, 0, 0, 0.5)'
            }}
            styles={{
                buttonPrimary: {
                    backgroundColor: '#3b82f6',
                    borderRadius: '8px',
                },
                buttonBack: {
                    color: '#6b7280', // gray-500
                    marginRight: '8px',
                },
                buttonSkip: {
                    color: '#6b7280',
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
