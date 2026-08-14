import { useState, useEffect } from 'react';

export const useIsMobile = (breakpoint = 768) => {
    const checkIsMobile = () => {
        return window.innerWidth < breakpoint || window.matchMedia('(orientation: landscape) and (max-height: 500px)').matches;
    };

    const [isMobile, setIsMobile] = useState(checkIsMobile());

    useEffect(() => {
        const handleResize = () => setIsMobile(checkIsMobile());
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [breakpoint]);

    return isMobile;
};
