import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

// Se define la lista de temas disponibles en un solo lugar.
// Para agregar un tema, solo hay que añadir su CSS en index.css y registrarlo aquí.
export const AVAILABLE_THEMES = [
    { id: 'blue', label: 'Azul', hex: '#3b82f6' },
    { id: 'pink', label: 'Rosado', hex: '#ec4899' },
    { id: 'purple', label: 'Morado', hex: '#7B2CBF' }
];

export type Theme = string;

interface ThemeContextType {
    theme: Theme;
    setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

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

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
