import { useEffect } from 'react';

export const useTourPanHandler = (zoomToElement: any, currentScale: number) => {
    useEffect(() => {
        const handlePan = (e: any) => {
            // Use a slight delay to ensure the DOM is ready and any sidebars have animated
            setTimeout(() => {
                if (typeof zoomToElement === 'function') {
                    // Si el detalle es un string (selector), buscamos el elemento real primero.
                    // Esto soluciona el problema de que zoomToElement trata los strings como IDs.
                    const node = typeof e.detail === 'string' ? document.querySelector(e.detail) : e.detail;
                    if (node) {
                        zoomToElement(node, currentScale, 500);
                        
                        // Dado que react-zoom-pan-pinch usa CSS transform en lugar de un scroll nativo,
                        // react-joyride no se entera de que el elemento se está moviendo.
                        // Forzamos una actualización de la posición disparando eventos 'resize' durante la animación.
                        const interval = setInterval(() => {
                            window.dispatchEvent(new Event('resize'));
                        }, 50);

                        // Limpiamos el intervalo justo después de que la animación de 500ms termine.
                        setTimeout(() => {
                            clearInterval(interval);
                            window.dispatchEvent(new Event('resize')); // Un último ajuste por si acaso
                        }, 550);
                    }
                }
            }, 100);
        };
        window.addEventListener('tour:panTo', handlePan);
        return () => window.removeEventListener('tour:panTo', handlePan);
    }, [zoomToElement, currentScale]);
};
