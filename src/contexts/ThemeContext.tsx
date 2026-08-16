import { useEffect, useState, type ReactNode } from 'react';
import { ThemeContext } from './theme';
import type { Theme } from '../constants/theme';

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const [theme, setThemeState] = useState<Theme>(() => {
        const saved = localStorage.getItem('malla-theme');
        return saved || 'blue';
    });

    const setTheme = (newTheme: Theme) => {
        setThemeState(newTheme);
        localStorage.setItem('malla-theme', newTheme);
    };

    useEffect(() => {
        const root = document.documentElement;
        // Inyectamos el atributo data-theme en <html> para que CSS varíe
        root.setAttribute('data-theme', theme);
    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};
