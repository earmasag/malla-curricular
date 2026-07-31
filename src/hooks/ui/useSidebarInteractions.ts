import { useState, useRef, useEffect } from 'react';

interface SidebarInteractionsProps {
    routeBuilderTourRun: boolean;
    mainTourRun: boolean;
    mainTourStepIndex: number;
    isExpanded: boolean;
    setIsExpanded: (val: boolean) => void;
    isMobile: boolean;
    setIsFeedbackModalOpen?: (val: boolean) => void;
}

export const useSidebarInteractions = ({
    routeBuilderTourRun,
    mainTourRun,
    mainTourStepIndex,
    isExpanded,
    setIsExpanded,
    isMobile,
    setIsFeedbackModalOpen
}: SidebarInteractionsProps) => {
    const [showThemeOptions, setShowThemeOptions] = useState(false);
    const themeButtonRef = useRef<HTMLDivElement>(null);
    const [themeMenuPos, setThemeMenuPos] = useState({ top: 0, left: 0 });

    // Feedback/Sugerencias state
    const [hasSeenSugerencias, setHasSeenSugerencias] = useState(true);
    const [shouldWiggle, setShouldWiggle] = useState(false);

    // Collapsar el sidebar automáticamente cuando el tutorial inicie
    // para evitar que el panel superponga el área iluminada de la malla.
    useEffect(() => {
        if (routeBuilderTourRun) {
            setIsExpanded(false);
        }
    }, [routeBuilderTourRun, setIsExpanded]);

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

    // Sugerencias init
    useEffect(() => {
        const seen = localStorage.getItem('malla_has_seen_sugerencias');
        if (!seen) {
            setHasSeenSugerencias(false);
        }
    }, []);

    // Sugerencias wiggle
    useEffect(() => {
        if (isExpanded) {
            setShouldWiggle(false);
            const timer = setTimeout(() => {
                setShouldWiggle(true);
            }, 600);
            return () => clearTimeout(timer);
        }
    }, [isExpanded]);

    const handleSugerenciasClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsFeedbackModalOpen?.(true);
        if (!hasSeenSugerencias) {
            setHasSeenSugerencias(true);
            setShouldWiggle(false);
            localStorage.setItem('malla_has_seen_sugerencias', 'true');
        }
    };

    // Auto-expand on mobile during main tour
    useEffect(() => {
        if (mainTourRun && isMobile) {
            if (mainTourStepIndex > 1 && !isExpanded) {
                setIsExpanded(true);
            } else if (mainTourStepIndex <= 1 && isExpanded) {
                setIsExpanded(false);
            }
        }
    }, [mainTourRun, mainTourStepIndex, isMobile, isExpanded, setIsExpanded]);

    return {
        themeMenu: {
            showThemeOptions,
            setShowThemeOptions,
            themeButtonRef,
            themeMenuPos
        },
        sugerencias: {
            hasSeenSugerencias,
            shouldWiggle,
            handleSugerenciasClick
        }
    };
};
