import React from 'react';
import Joyride from 'react-joyride';
import type { Step, EventData } from 'react-joyride';
import { useTheme, AVAILABLE_THEMES } from '../../contexts/ThemeContext';

interface MainAppTourProps {
    run: boolean;
    steps: Step[];
    handleJoyrideCallback: (data: EventData) => void;
}

export const MainAppTour: React.FC<MainAppTourProps> = ({ run, steps, handleJoyrideCallback }) => {
    const { theme } = useTheme();

    // Obtener el color hexadecimal activo para pasárselo a Joyride
    const activeThemeHex = AVAILABLE_THEMES.find(t => t.id === theme)?.hex || '#3b82f6'; // Azul por defecto

    return (
        <Joyride
            steps={steps}
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
