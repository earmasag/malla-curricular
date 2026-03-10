import React, { useState } from 'react';
import {
    Map as MapPath, Library, MessageSquareHeart, Trash2,
    Wrench, BookOpen, ArrowRight, X, Lightbulb, Flag, Calculator,
    Menu, LayoutDashboard
} from 'lucide-react';
import { useNotification } from '../../hooks/useNotification';
import { useMallaData, useMallaUI } from '../../contexts/MallaContexts';
import { useIsMobile } from '../../hooks/useIsMobile';

export interface NavigationSidebarProps {
    totalMaterias: number;
}

export const NavigationSidebar: React.FC<NavigationSidebarProps> = ({
    totalMaterias,
}) => {
    // Context logic (same as MallaHeader)
    const { estadoMalla, accionesMalla, estadoCustom, accionesCustom } = useMallaData();
    const { modales, handlers } = useMallaUI();
    const { confirm } = useNotification();
    const isMobile = useIsMobile();

    const { cantidadAprobadas, ucAcumuladas, materiasCursando } = estadoMalla;
    const {
        isCustomRouteMode,
        currentSemesterUCs,
        totalCustomUCs,
        customSemesters,
        hasDraftRoute
    } = estadoCustom;

    const ucCursando = materiasCursando.reduce((sum: number, m: any) => sum + m.unidadesCredito, 0);
    const customSemestersCount = customSemesters.length;
    const customCurrentSemesterCount = customSemestersCount > 0 ? customSemesters[customSemestersCount - 1].length : 0;

    const [isExpanded, setIsExpanded] = useState(false);

    const handleResetProgreso = async (e: React.MouseEvent) => {
        e.stopPropagation();
        const isConfirmed = await confirm("¿Estás seguro que deseas borrar todo tu progreso? Esta acción no se puede deshacer.", {
            isDestructive: true,
            confirmText: "Borrar Todo"
        });
        if (isConfirmed) {
            accionesMalla.resetProgreso();
        }
    };

    // Responsive layout constants
    const mobileClasses = isExpanded
        ? 'inset-x-4 top-4 bottom-4 w-auto rounded-3xl h-[calc(100dvh-2rem)]' // Full screen with margins
        : 'left-4 top-4 w-15 h-15 rounded-full justify-center items-center shadow-lg'; // Floating button top-left

    const desktopClasses = isExpanded
        ? 'left-4 top-4 bottom-4 w-72 rounded-3xl'
        : 'left-4 top-4 bottom-4 w-20 rounded-3xl';

    return (
        <aside
            className={`fixed z-50 flex flex-col bg-white/95 backdrop-blur-xl border border-gray-200/80 shadow-2xl transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] 
                ${isMobile ? mobileClasses : desktopClasses}`}
        >
            {/* Toggle Button */}
            <div className={`${isExpanded ? 'p-4 border-b border-gray-100' : isMobile ? 'p-2' : 'p-4'} flex items-center ${isExpanded || isMobile ? 'justify-between' : 'justify-center'} w-full shrink-0`}>
                {isExpanded && (
                    <div className="flex items-center gap-2 overflow-hidden">
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                            <LayoutDashboard className="w-5 h-5" />
                        </div>
                        <h1 className="text-lg font-bold text-gray-800 whitespace-nowrap">Mi Malla</h1>
                    </div>
                )}
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className={`rounded-xl hover:bg-gray-100 text-gray-700 transition-colors flex items-center justify-center ${!isExpanded && isMobile ? 'w-11 h-11' : 'p-2.5'}`}
                >
                    {isExpanded ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Content Area (Hidden on mobile if collapsed) */}
            {(!isMobile || isExpanded) && (
                <div className="flex-1 overflow-y-auto overflow-x-hidden flex flex-col gap-2 p-3 hide-scrollbar">

                    {/* Regular Mode Stats */}
                    {!isCustomRouteMode ? (
                        <>
                            <div className={`flex flex-col gap-2 mb-4 ${isExpanded ? 'px-2' : 'items-center'}`}>
                                {/* Aprobadas Stat */}
                                <div className={`flex items-center gap-3 p-3 bg-gray-50 rounded-2xl border border-gray-100 transition-all ${!isExpanded ? 'w-14 justify-center aspect-square flex-col gap-1 p-2' : ''}`}>
                                    <BookOpen className={`text-blue-500 shrink-0 ${isExpanded ? 'w-5 h-5' : 'w-4 h-4'}`} />
                                    {isExpanded ? (
                                        <div className="flex-1 flex justify-between items-center">
                                            <span className="text-sm font-semibold text-gray-600">Aprobadas</span>
                                            <span className="text-blue-600 font-black">{cantidadAprobadas}/{totalMaterias}</span>
                                        </div>
                                    ) : (
                                        <span className="text-xs font-black text-blue-600 leading-none">{cantidadAprobadas}</span>
                                    )}
                                </div>

                                {/* UC Stat */}
                                <div className={`flex items-center gap-3 p-3 bg-gray-50 rounded-2xl border border-gray-100 transition-all ${!isExpanded ? 'w-14 justify-center aspect-square flex-col gap-1 p-2' : ''}`}>
                                    <Lightbulb className={`text-amber-500 shrink-0 ${isExpanded ? 'w-5 h-5' : 'w-4 h-4'}`} />
                                    {isExpanded ? (
                                        <div className="flex-1 flex justify-between items-center">
                                            <span className="text-sm font-semibold text-gray-600">UC Aprobadas</span>
                                            <span className="text-amber-600 font-black">{ucAcumuladas}</span>
                                        </div>
                                    ) : (
                                        <span className="text-xs font-black text-amber-600 leading-none">{ucAcumuladas}</span>
                                    )}
                                </div>

                                {/* UC Cursando */}
                                {ucCursando > 0 && (
                                    <div className={`flex items-center gap-3 p-3 bg-blue-50 rounded-2xl border border-blue-100 transition-all ${!isExpanded ? 'w-14 justify-center aspect-square flex-col gap-1 p-2' : ''}`}>
                                        <div className="relative shrink-0 flex items-center justify-center w-5 h-5">
                                            <span className="absolute w-2.5 h-2.5 rounded-full bg-blue-500 animate-ping opacity-75"></span>
                                            <span className="relative w-2 h-2 rounded-full bg-blue-600"></span>
                                        </div>
                                        {isExpanded ? (
                                            <div className="flex-1 flex justify-between items-center">
                                                <span className="text-sm font-semibold text-blue-800">UC Cursando</span>
                                                <span className="text-blue-700 font-black">{ucCursando}</span>
                                            </div>
                                        ) : (
                                            <span className="text-[10px] sm:text-xs font-black text-blue-700 leading-none">{ucCursando}</span>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="h-px bg-gray-100 my-2 mx-2"></div>

                            {/* Actions */}
                            <SidebarButton
                                isExpanded={isExpanded}
                                icon={<MapPath />}
                                label="Ruta Óptima"
                                onClick={(e) => { e.stopPropagation(); handlers.handleShowRutaOptima(); }}
                                color="blue"
                            />

                            {accionesCustom.startCustomRoute && (
                                <SidebarButton
                                    isExpanded={isExpanded}
                                    icon={<Wrench />}
                                    label={hasDraftRoute ? "Volver al borrador" : "Crear Ruta"}
                                    onClick={(e) => { e.stopPropagation(); accionesCustom.startCustomRoute(); }}
                                    color="purple"
                                />
                            )}

                            {modales.isMatriculaModalOpen !== undefined && (
                                <SidebarButton
                                    isExpanded={isExpanded}
                                    icon={<Calculator />}
                                    label="Matrícula"
                                    onClick={(e) => { e.stopPropagation(); modales.setIsMatriculaModalOpen(true); }}
                                    color="green"
                                />
                            )}

                            {handlers.handleOpenMisRutas && (
                                <SidebarButton
                                    isExpanded={isExpanded}
                                    icon={<Library />}
                                    label="Mis Rutas"
                                    onClick={(e) => { e.stopPropagation(); handlers.handleOpenMisRutas(); }}
                                    color="indigo"
                                />
                            )}

                            {modales.setIsFeedbackModalOpen && (
                                <SidebarButton
                                    isExpanded={isExpanded}
                                    icon={<MessageSquareHeart />}
                                    label="Sugerencias"
                                    onClick={(e) => { e.stopPropagation(); modales.setIsFeedbackModalOpen(true); }}
                                    color="gray"
                                />
                            )}
                        </>
                    ) : (
                        // Custom Mode Stats & Actions
                        <>
                            <div className={`flex flex-col gap-2 mb-4 ${isExpanded ? 'px-2' : 'items-center'}`}>
                                <div className={`flex justify-center items-center gap-3 p-3 bg-purple-50 rounded-2xl border border-purple-100 transition-all ${!isExpanded ? 'w-14 aspect-square flex-col gap-1 p-2' : ''}`}>
                                    <Wrench className={`text-purple-600 shrink-0 ${isExpanded ? 'w-5 h-5' : 'w-4 h-4'} animate-pulse`} />
                                    {isExpanded && <span className="font-bold text-sm text-purple-800">Modo Constructor</span>}
                                </div>

                                <div className={`flex items-center gap-3 p-4 bg-gray-50 border border-gray-100 border-t-2 border-t-dashed border-t-indigo-200 rounded-2xl transition-all ${!isExpanded ? 'w-14 justify-center aspect-square flex-col gap-1 p-2' : ''}`}>
                                    {isExpanded ? (
                                        <div className="flex-1 flex flex-col items-center">
                                            <span className="text-3xl font-black text-blue-900 leading-none">{currentSemesterUCs}/{totalCustomUCs}</span>
                                            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">UCs</span>
                                        </div>
                                    ) : (
                                        <span className="text-xs font-black text-blue-900 leading-none">{currentSemesterUCs}</span>
                                    )}
                                </div>

                                <div className={`flex items-center gap-3 p-3 bg-white rounded-2xl border border-gray-100 transition-all ${!isExpanded ? 'w-14 justify-center aspect-square flex-col gap-1 p-2' : ''}`}>
                                    <BookOpen className={`text-blue-500 shrink-0 ${isExpanded ? 'w-5 h-5' : 'w-4 h-4'}`} />
                                    {isExpanded ? (
                                        <div className="flex-1 flex justify-between items-center">
                                            <span className="text-sm font-semibold text-gray-600">Materias selec.</span>
                                            <span className="text-blue-600 font-black">{customCurrentSemesterCount}</span>
                                        </div>
                                    ) : (
                                        <span className="text-xs font-black text-blue-600 leading-none">{customCurrentSemesterCount}</span>
                                    )}
                                </div>
                            </div>

                            <div className="h-px bg-gray-100 my-2 mx-2"></div>

                            <SidebarButton
                                isExpanded={isExpanded}
                                icon={<ArrowRight />}
                                label="Avanzar Semestre"
                                onClick={(e) => { e.stopPropagation(); accionesCustom.advanceCustomSemester(); }}
                                disabled={customCurrentSemesterCount === 0}
                                color="blue"
                                variant="solid"
                            />

                            <SidebarButton
                                isExpanded={isExpanded}
                                icon={<Flag />}
                                label="Guardar y Terminar"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    const name = window.prompt("¿Qué nombre le pondrás a esta ruta?");
                                    if (name) handlers.handleFinishCustomRoute?.(name);
                                }}
                                disabled={customSemestersCount === 0 || (customSemestersCount === 1 && customCurrentSemesterCount === 0)}
                                color="indigo"
                                variant="light"
                            />

                            {modales.isMatriculaModalOpen !== undefined && (
                                <SidebarButton
                                    isExpanded={isExpanded}
                                    icon={<Calculator />}
                                    label="Matrícula"
                                    onClick={(e) => { e.stopPropagation(); modales.setIsMatriculaModalOpen(true); }}
                                    color="green"
                                />
                            )}

                            <SidebarButton
                                isExpanded={isExpanded}
                                icon={<Trash2 />}
                                label="Descartar"
                                onClick={(e) => { e.stopPropagation(); accionesCustom.deleteDraftRoute(); }}
                                color="red"
                                variant="ghost"
                            />

                            <SidebarButton
                                isExpanded={isExpanded}
                                icon={<X />}
                                label="Cerrar Constructor"
                                onClick={(e) => { e.stopPropagation(); accionesCustom.cancelCustomRoute(); }}
                                color="gray"
                            />
                        </>
                    )}
                </div>
            )}

            {/* Bottom Actions Fixed Area */}
            {(!isMobile || isExpanded) && !isCustomRouteMode && (
                <div className={`p-4 border-t border-gray-100 bg-gray-50/50 ${isMobile ? 'rounded-b-none pb-8' : 'rounded-b-3xl'} ${!isExpanded ? 'flex justify-center' : ''}`}>
                    <SidebarButton
                        isExpanded={isExpanded}
                        icon={<Trash2 />}
                        label="Borrar Todo"
                        onClick={handleResetProgreso}
                        color="red"
                        variant="ghost"
                    />
                </div>
            )}
        </aside>
    );
};

// --- Helper Component ---
interface SidebarButtonProps {
    isExpanded: boolean;
    icon: React.ReactNode;
    label: string;
    onClick: (e: React.MouseEvent) => void;
    color?: 'blue' | 'purple' | 'green' | 'indigo' | 'red' | 'gray';
    variant?: 'solid' | 'light' | 'ghost';
    disabled?: boolean;
}

const colorStyles = {
    blue: {
        solid: "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 border-blue-600",
        light: "bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-100",
        ghost: "bg-transparent text-blue-600 hover:bg-blue-50 border-transparent text-red-600 hover:text-red-700",
    },
    purple: {
        solid: "bg-purple-600 text-white hover:bg-purple-700 active:bg-purple-800 border-purple-600",
        light: "bg-purple-50 text-purple-700 hover:bg-purple-100 border-purple-100",
        ghost: "bg-transparent text-purple-600 hover:bg-purple-50 border-transparent hover:text-purple-700",
    },
    green: {
        solid: "bg-green-600 text-white hover:bg-green-700 active:bg-green-800 border-green-600",
        light: "bg-green-50 text-green-700 hover:bg-green-100 border-green-100",
        ghost: "bg-transparent text-green-600 hover:bg-green-50 border-transparent hover:text-green-700",
    },
    indigo: {
        solid: "bg-indigo-600 text-white hover:bg-indigo-700 active:bg-indigo-800 border-indigo-600",
        light: "bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border-indigo-100",
        ghost: "bg-transparent text-indigo-600 hover:bg-indigo-50 border-transparent hover:text-indigo-700",
    },
    red: {
        solid: "bg-red-600 text-white hover:bg-red-700 active:bg-red-800 border-red-600",
        light: "bg-red-50 text-red-700 hover:bg-red-100 border-red-100",
        ghost: "bg-transparent text-red-500 hover:bg-red-50 border-transparent hover:text-red-600",
    },
    gray: {
        solid: "bg-gray-800 text-white hover:bg-gray-900 active:bg-black border-gray-800",
        light: "bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-200",
        ghost: "bg-transparent text-gray-500 hover:bg-gray-100 border-transparent hover:text-gray-700",
    }
};

const SidebarButton: React.FC<SidebarButtonProps> = ({ isExpanded, icon, label, onClick, color = 'gray', variant = 'light', disabled = false }) => {
    // "light" uses border and background
    const baseClasses = "flex items-center rounded-2xl transition-all duration-300 relative group overflow-hidden shrink-0 border";
    const sizeClasses = isExpanded ? "p-3 px-4 w-full gap-3" : "justify-center p-3 w-14 h-14";
    const disabledClasses = disabled ? "opacity-50 cursor-not-allowed grayscale" : "cursor-pointer";
    const colorClass = disabled ? colorStyles.gray.light : colorStyles[color][variant];

    return (
        <button
            onClick={(e) => {
                if (!disabled) onClick(e);
            }}
            disabled={disabled}
            className={`${baseClasses} ${sizeClasses} ${disabledClasses} ${colorClass}`}
            title={!isExpanded ? label : undefined}
        >
            <div className={`shrink-0 flex items-center justify-center [&>svg]:w-4.5 [&>svg]:h-4.5`}>
                {icon}
            </div>
            {isExpanded && (
                <span className="text-[13px] font-semibold whitespace-nowrap text-left truncate">
                    {label}
                </span>
            )}
        </button>
    );
};
