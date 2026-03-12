import React, { createContext, useContext, type ReactNode } from 'react';
import type { MallaCurricularGraph } from '../core/MallaCurricularGraph';
import { useMallaCurricular } from '../hooks/core/useMallaCurricular';
import { useCustomRoute } from '../hooks/malla/useCustomRoute';
import { useMallaController } from '../hooks/core/useMallaController';

// 1. Definimos los tipos de retorno de nuestros custom hooks refactorizados
type MallaCurricularReturn = ReturnType<typeof useMallaCurricular>;
type CustomRouteReturn = ReturnType<typeof useCustomRoute>;
type MallaControllerReturn = ReturnType<typeof useMallaController>;

// 2. Interfaces para nuestros dos Contextos Separados (Re-render Trap Avoidance)
interface MallaDataContextType {
    estadoMalla: MallaCurricularReturn['estado'];
    accionesMalla: MallaCurricularReturn['acciones'];
    estadoCustom: CustomRouteReturn['estado'];
    accionesCustom: CustomRouteReturn['acciones'];
}

interface MallaUIContextType {
    ui: MallaControllerReturn['ui'];
    modales: MallaControllerReturn['modales'];
    datos: MallaControllerReturn['datos'];
    handlers: MallaControllerReturn['handlers'];
}

// 3. Creación de los dos Contextos
const MallaDataContext = createContext<MallaDataContextType | undefined>(undefined);
const MallaUIContext = createContext<MallaUIContextType | undefined>(undefined);

// 4. Custom Hooks inyectores seguros
export const useMallaData = () => {
    const context = useContext(MallaDataContext);
    if (!context) throw new Error("useMallaData debe usarse dentro de un MallaProvider");
    return context;
};

export const useMallaUI = () => {
    const context = useContext(MallaUIContext);
    if (!context) throw new Error("useMallaUI debe usarse dentro de un MallaProvider");
    return context;
};

// 5. El Provider Global (Combina la ejecución de los hooks y mapea a Contextos Duales)
interface MallaProviderProps {
    grafo: MallaCurricularGraph;
    children: ReactNode;
}

export const MallaProvider: React.FC<MallaProviderProps> = ({ grafo, children }) => {
    // A) Ejecución de Dominio / Datos
    const { estado: estadoMalla, acciones: accionesMalla } = useMallaCurricular(grafo);
    const { estado: estadoCustom, acciones: accionesCustom } = useCustomRoute(grafo, estadoMalla.progreso);

    // B) Ejecución de UI y Controladores
    const { ui, modales, datos, handlers } = useMallaController(
        accionesMalla.generarRutaOptima,
        accionesCustom.saveAndFinishRoute,
        accionesCustom.cancelCustomRoute,
        estadoCustom.customSemesters
    );

    // C) Empaquetado
    const dataContextValue: MallaDataContextType = {
        estadoMalla,
        accionesMalla,
        estadoCustom,
        accionesCustom,
    };

    const uiContextValue: MallaUIContextType = {
        ui,
        modales,
        datos,
        handlers,
    };

    return (
        <MallaDataContext.Provider value={dataContextValue}>
            <MallaUIContext.Provider value={uiContextValue}>
                {children}
            </MallaUIContext.Provider>
        </MallaDataContext.Provider>
    );
};
