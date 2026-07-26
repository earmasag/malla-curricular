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
                primaryColor: 'var(--theme-500)',
                textColor: '#334155', // slate-700
                backgroundColor: '#ffffff',
                overlayColor: 'rgba(0, 0, 0, 0.4)'
            }}
            styles={{
                tooltip: {
                    borderRadius: '24px', // Match rounded-3xl/2xl of modals
                    fontFamily: 'inherit',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', // shadow-2xl
                    padding: '8px', // Outer padding for a roomier feel before the content
                },
                tooltipContent: {
                    padding: '16px 8px 24px 8px', // Increased margins
                    fontSize: '15px',
                    lineHeight: '1.6',
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
