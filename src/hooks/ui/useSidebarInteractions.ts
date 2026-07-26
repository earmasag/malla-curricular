import { useState, useRef, useEffect } from 'react';

export const useSidebarInteractions = (run: boolean, setIsExpanded: (val: boolean) => void) => {
    const [showThemeOptions, setShowThemeOptions] = useState(false);
    const themeButtonRef = useRef<HTMLDivElement>(null);
    const [themeMenuPos, setThemeMenuPos] = useState({ top: 0, left: 0 });

    // Collapsar el sidebar automáticamente cuando el tutorial inicie
    // para evitar que el panel superponga el área iluminada de la malla.
    useEffect(() => {
        if (run) {
            setIsExpanded(false);
        }
    }, [run, setIsExpanded]);

    useEffect(() => {
        if (showThemeOptions && themeButtonRef.current) {
            const rect = themeButtonRef.current.getBoundingClientRect();
            setThemeMenuPos({ top: rect.top + rect.height / 2, left: rect.right + 16 });
        }
    }, [showThemeOptions]);

    useEffect(() => {
        const handleHide = () => setShowThemeOptions(false);
        if (showThemeOptions) {
            window.addEventListener('resize', handleHide);
            document.addEventListener('scroll', handleHide, true);
            document.addEventListener('click', handleHide);
        }
        return () => {
            window.removeEventListener('resize', handleHide);
            document.removeEventListener('scroll', handleHide, true);
            document.removeEventListener('click', handleHide);
        };
    }, [showThemeOptions]);

    return {
        themeMenu: {
            showThemeOptions,
            setShowThemeOptions,
            themeButtonRef,
            themeMenuPos
        }
    };
};
