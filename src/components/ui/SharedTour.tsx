import React from 'react';
import { Joyride } from 'react-joyride';

import type { Step, EventData } from 'react-joyride';
import { useTheme } from '../../hooks/useTheme';
import { AVAILABLE_THEMES } from '../../constants/theme';

interface SharedTourProps {
    run: boolean;
    steps: Step[];
    handleJoyrideCallback: (data: EventData) => void;
}

export const SharedTour: React.FC<SharedTourProps> = ({ run, steps, handleJoyrideCallback }) => {
    const { theme } = useTheme();
    // Obtener el color hexadecimal activo para pasárselo a Joyride
    const activeThemeHex = AVAILABLE_THEMES.find(t => t.id === theme)?.hex || '#3b82f6'; 

    return (
        <Joyride
            onEvent={handleJoyrideCallback}
            continuous
            run={run}
            steps={steps}
            options={{
                showProgress: true,
                buttons: ['back', 'primary', 'skip'],
                zIndex: 10000,
                primaryColor: activeThemeHex,
                textColor: '#334155', // slate-700
                backgroundColor: '#ffffff',
                overlayColor: 'rgba(0, 0, 0, 0.4)'
            }}
            styles={{
                overlay: {
                    pointerEvents: 'none'
                },
                spotlight: {
                    pointerEvents: 'none'
                },
                tooltipContainer: {
                    pointerEvents: 'auto',
                    textAlign: 'left'
                },
                tooltip: {
                    pointerEvents: 'auto',
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
                    color: activeThemeHex,
                    marginBottom: '8px',
                },
                buttonPrimary: {
                    backgroundColor: activeThemeHex,
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
                }
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
