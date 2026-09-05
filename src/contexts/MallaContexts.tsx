import React, { createContext, useContext, type ReactNode } from 'react';
import type { MallaCurricularGraph } from '../core/MallaCurricularGraph';
import { useMallaCurricular } from '../hooks/core/useMallaCurricular';
import { useCustomRoute } from '../hooks/malla/useCustomRoute';
import { useMallaController } from '../hooks/core/useMallaController';

// 1. Definimos los tipos de retorno de nuestros custom hooks refactorizados
type MallaCurricularReturn = ReturnType<typeof useMallaCurricular>;
type CustomRouteReturn = ReturnType<typeof useCustomRoute>;
type MallaControllerReturn = ReturnType<typeof useMallaController>;

// 2. Interfaces para nuestros Contextos Separados (Re-render Trap Avoidance)
interface MallaDataContextType {
    grafo: MallaCurricularGraph;
    estadoMalla: MallaCurricularReturn['estado'];
    accionesMalla: MallaCurricularReturn['acciones'];
    estadoCustom: CustomRouteReturn['estado'];
    accionesCustom: CustomRouteReturn['acciones'];
}

interface MallaHoverContextType {
    hover: MallaControllerReturn['hover'];
}

interface MallaUIContextType {
    ui: MallaControllerReturn['ui'];
    modales: MallaControllerReturn['modales'];
    configuraciones: MallaControllerReturn['configuraciones'];
    datos: MallaControllerReturn['datos'];
    handlers: MallaControllerReturn['handlers'];
}

// 3. Creación de los Contextos
const MallaDataContext = createContext<MallaDataContextType | undefined>(undefined);
const MallaHoverContext = createContext<MallaHoverContextType | undefined>(undefined);
const MallaUIContext = createContext<MallaUIContextType | undefined>(undefined);

// 4. Custom Hooks inyectores seguros
export const useMallaData = () => {
    const context = useContext(MallaDataContext);
    if (!context) throw new Error("useMallaData debe usarse dentro de un MallaProvider");
    return context;
};

export const useMallaHover = () => {
    const context = useContext(MallaHoverContext);
    if (!context) throw new Error("useMallaHover debe usarse dentro de un MallaProvider");
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
    activePlanId: string;
    children: ReactNode;
}

export const MallaProvider: React.FC<MallaProviderProps> = ({ grafo, activePlanId, children }) => {
    // A) Ejecución de Dominio / Datos
    const { estado: estadoMalla, acciones: accionesMalla } = useMallaCurricular(grafo, activePlanId);
    const { estado: estadoCustom, acciones: accionesCustom } = useCustomRoute(grafo, estadoMalla.progreso, activePlanId, estadoMalla.ucPensumAnterior);

    // B) Ejecución de UI y Controladores
    const { hover, ui, modales, configuraciones, datos, handlers } = useMallaController(
        accionesMalla.generarRutaOptima,
        accionesCustom.saveAndFinishRoute,
        accionesCustom.cancelCustomRoute,
        estadoCustom.customSemesters,
        activePlanId
    );

    // C) Empaquetado
    const dataContextValue: MallaDataContextType = React.useMemo(() => ({
        grafo,
        estadoMalla,
        accionesMalla,
        estadoCustom,
        accionesCustom,
    }), [grafo, estadoMalla, accionesMalla, estadoCustom, accionesCustom]);

    const hoverContextValue: MallaHoverContextType = React.useMemo(() => ({
        hover
    }), [hover]);

    const uiContextValue: MallaUIContextType = React.useMemo(() => ({
        ui,
        modales,
        configuraciones,
        datos,
        handlers,
    }), [ui, modales, configuraciones, datos, handlers]);

    return (
        <MallaDataContext.Provider value={dataContextValue}>
            <MallaUIContext.Provider value={uiContextValue}>
                <MallaHoverContext.Provider value={hoverContextValue}>
                    {children}
                </MallaHoverContext.Provider>
            </MallaUIContext.Provider>
        </MallaDataContext.Provider>
    );
};
