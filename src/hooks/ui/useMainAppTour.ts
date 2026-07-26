import { useState, useEffect, useCallback } from 'react';
import type { EventData } from 'react-joyride';
import { STATUS } from 'react-joyride';

export const useMainAppTour = (isCustomRouteMode: boolean) => {
    const [run, setRun] = useState(false);
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
        startTourManually,
        handleJoyrideCallback
    };
};
