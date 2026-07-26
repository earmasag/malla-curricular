import { useState, useEffect, useCallback } from 'react';
import type { EventData } from 'react-joyride';
import { STATUS } from 'react-joyride';

export const useRouteBuilderTour = (isCustomRouteMode: boolean) => {
    const [run, setRun] = useState(false);
    const [hasMounted, setHasMounted] = useState(false);

    useEffect(() => {
        setHasMounted(true);
    }, []);

    useEffect(() => {
        if (!hasMounted) return;
        
        if (isCustomRouteMode) {
            const hasSeenTour = localStorage.getItem('hasSeenRouteTour');
            if (!hasSeenTour) {
                // Pequeño retraso para asegurar que los elementos del DOM estén renderizados
                const timer = setTimeout(() => setRun(true), 500);
                return () => clearTimeout(timer);
            }
        } else {
            setRun(false); // Detener si salimos del modo
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
            localStorage.setItem('hasSeenRouteTour', 'true');
        }
    }, []);

    return {
        run,
        startTourManually,
        handleJoyrideCallback
    };
};
