import { useEffect } from 'react';

export const useTourPanHandler = (zoomToElement: any, currentScale: number) => {
    useEffect(() => {
        const handlePan = (e: any) => {
            // Use a slight delay to ensure the DOM is ready and any sidebars have animated
            setTimeout(() => {
                if (typeof zoomToElement === 'function') {
                    zoomToElement(e.detail, currentScale, 500);
                }
            }, 100);
        };
        window.addEventListener('tour:panTo', handlePan);
        return () => window.removeEventListener('tour:panTo', handlePan);
    }, [zoomToElement, currentScale]);
};
