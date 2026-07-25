import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
    Map as MapPath, Library, MessageSquareHeart, Trash2,
    Wrench, BookOpen, ArrowRight, X, Lightbulb, Flag, Calculator,
    Menu, LayoutDashboard, Info,  GraduationCap, Settings, Palette
} from 'lucide-react';
import { SidebarButton } from './SidebarButton';
import { useNavigationSidebar } from '../../../hooks/ui/useNavigationSidebar';
import { useTheme } from '../../../contexts/ThemeContext';

export interface NavigationSidebarProps {
    totalMaterias: number;
}

export const NavigationSidebar: React.FC<NavigationSidebarProps> = ({
    totalMaterias,
}) => {
    const { ui, mallaStats, customRouteState, actions } = useNavigationSidebar();
    const { theme, setTheme } = useTheme();
    const [showThemeOptions, setShowThemeOptions] = useState(false);
    const themeButtonRef = useRef<HTMLDivElement>(null);
    const [themeMenuPos, setThemeMenuPos] = useState({ top: 0, left: 0 });

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

    // Responsive layout constants
    const mobileClasses = ui.isExpanded
        ? 'left-3 top-3 w-[calc(100vw-1.5rem)] h-[calc(100dvh-1.5rem)] rounded-3xl origin-top-left' // Ancla superior izquierda, expande w/h
        : 'left-3 top-3 w-12 h-12 rounded-2xl justify-center items-center shadow-md origin-top-left'; // Botón flotante cuadrado redondeado

    const desktopClasses = ui.isExpanded
        ? 'left-4 top-4 bottom-4 w-72 rounded-3xl'
        : 'left-4 top-4 bottom-4 w-20 rounded-3xl';

    return (
        <aside
            className={`fixed z-50 flex flex-col bg-theme-50/40 backdrop-blur-2xl border border-white/60 shadow-2xl shadow-theme-500/5 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] transform-gpu
                ${ui.isMobile ? mobileClasses : desktopClasses}`}
        >
            {/* Toggle Button */}
            <div className={`${ui.isExpanded ? 'p-4 border-b border-gray-100' : ui.isMobile ? 'p-0 w-full h-full' : 'p-4'} flex items-center ${ui.isExpanded || ui.isMobile ? 'justify-between' : 'justify-center'} w-full shrink-0`}>
                {ui.isExpanded && (
                    <div className="flex items-center gap-2 overflow-hidden">
                        <div className="p-2 bg-theme-100 text-theme-600 rounded-xl">
                            <LayoutDashboard className="w-5 h-5" />
                        </div>
                        <h1 className="text-lg font-bold text-gray-800 whitespace-nowrap">Mi Malla</h1>
                    </div>
                )}
                <button
                    onClick={() => ui.setIsExpanded(!ui.isExpanded)}
                    className={`rounded-xl cursor-pointer hover:bg-gray-100 text-gray-700 transition-colors flex items-center justify-center ${!ui.isExpanded && ui.isMobile ? 'w-12 h-12' : 'p-2.5'}`}
                >
                    {ui.isExpanded ? <X className="w-6 h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
                </button>
            </div>

            {/* Content Area (Hidden on mobile if collapsed) */}
            {(!ui.isMobile || ui.isExpanded) && (
                <div className="flex-1 overflow-y-auto overflow-x-hidden flex flex-col gap-3 p-3 hide-scrollbar">

                    {/* Regular Mode Stats */}
                    {!customRouteState.isCustomRouteMode ? (
                        <>
                            <div className={`flex flex-col gap-3 mb-4 ${ui.isExpanded ? 'px-2' : 'items-center'}`}>
                                {/* Aprobadas Stat */}
                                <div className={`flex items-center gap-3 p-3 bg-white/40 backdrop-blur-md border border-white/50 shadow-sm rounded-xl transition-all ${!ui.isExpanded ? 'w-14 justify-center aspect-square flex-col gap-1 p-2' : ''}`}>
                                    <BookOpen className={`text-theme-500 shrink-0 ${ui.isExpanded ? 'w-5 h-5' : 'w-4 h-4'}`} />
                                    {ui.isExpanded ? (
                                        <div className="flex-1 flex justify-between items-center">
                                            <span className="text-sm font-semibold text-slate-700">Aprobadas</span>
                                            <span className="text-slate-800 font-black">{mallaStats.cantidadAprobadas}/{totalMaterias}</span>
                                        </div>
                                    ) : (
                                        <span className="text-xs font-black text-slate-800 leading-none">{mallaStats.cantidadAprobadas}</span>
                                    )}
                                </div>

                                {/* UC Stat */}
                                <div className={`flex items-center gap-3 p-3 bg-white/40 backdrop-blur-md border border-white/50 shadow-sm rounded-xl transition-all ${!ui.isExpanded ? 'w-14 justify-center aspect-square flex-col gap-1 p-2' : ''}`}>
                                    <Lightbulb className={`text-amber-500 shrink-0 ${ui.isExpanded ? 'w-5 h-5' : 'w-4 h-4'}`} />
                                    {ui.isExpanded ? (
                                        <div className="flex-1 flex justify-between items-center">
                                            <span className="text-sm font-semibold text-slate-700">UC Aprobadas</span>
                                            <span className="text-slate-800 font-black">{mallaStats.ucAcumuladas}</span>
                                        </div>
                                    ) : (
                                        <span className="text-xs font-black text-slate-800 leading-none">{mallaStats.ucAcumuladas}</span>
                                    )}
                                </div>

                                {/* Semestre Actual Stat */}
                                <div className={`flex items-center gap-3 p-3 bg-white/40 backdrop-blur-md border border-white/50 shadow-sm rounded-xl transition-all ${!ui.isExpanded ? 'w-14 justify-center aspect-square flex-col gap-1 p-2' : ''}`}>
                                    <GraduationCap className={`text-purple-500 shrink-0 ${ui.isExpanded ? 'w-5 h-5' : 'w-4 h-4'}`} />
                                    {ui.isExpanded ? (
                                        <div className="flex-1 flex justify-between items-center">
                                            <span className="text-sm font-semibold text-slate-700">Semestre Actual</span>
                                            <span className="text-slate-800 font-black">{mallaStats.semestreActual}</span>
                                        </div>
                                    ) : (
                                        <span className="text-xs font-black text-slate-800 leading-none">{mallaStats.semestreActual}</span>
                                    )}
                                </div>

                                {/* UC Cursando */}
                                {mallaStats.ucCursando > 0 && (
                                    <div className={`flex items-center gap-3 p-3 bg-white/40 backdrop-blur-md border border-white/50 shadow-sm rounded-xl transition-all ${!ui.isExpanded ? 'w-14 justify-center aspect-square flex-col gap-1 p-2' : ''}`}>
                                        <div className="relative shrink-0 flex items-center justify-center w-5 h-5">
                                            <span className="absolute w-2.5 h-2.5 rounded-full bg-theme-500 animate-ping opacity-75"></span>
                                            <span className="relative w-2 h-2 rounded-full bg-theme-500"></span>
                                        </div>
                                        {ui.isExpanded ? (
                                            <div className="flex-1 flex justify-between items-center">
                                                <span className="text-sm font-semibold text-slate-700">UC Cursando</span>
                                                <span className="text-slate-800 font-black">{mallaStats.ucCursando}</span>
                                            </div>
                                        ) : (
                                            <span className="text-[10px] sm:text-xs font-black text-slate-800 leading-none">{mallaStats.ucCursando}</span>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="h-px bg-slate-200 my-2 mx-2"></div>

                            {/* Actions */}
                            <SidebarButton
                                isExpanded={ui.isExpanded}
                                icon={<MapPath />}
                                label="Ruta Óptima"
                                onClick={(e) => { e.stopPropagation(); actions.handlers.handleShowRutaOptima(); }}
                                color="theme"
                                variant="solid"
                            />

                            {actions.accionesCustom.startCustomRoute && (
                                <SidebarButton
                                    isExpanded={ui.isExpanded}
                                    icon={<Wrench />}
                                    label={customRouteState.hasDraftRoute ? "Volver al borrador" : "Crear Ruta"}
                                    onClick={(e) => { e.stopPropagation(); actions.accionesCustom.startCustomRoute(); }}
                                />
                            )}

                            {ui.modales.isMatriculaModalOpen !== undefined && (
                                <SidebarButton
                                    isExpanded={ui.isExpanded}
                                    icon={<Calculator />}
                                    label="Matrícula"
                                    onClick={(e) => { e.stopPropagation(); ui.modales.setIsMatriculaModalOpen(true); }}
                                />
                            )}

                            {actions.handlers.handleOpenMisRutas && (
                                <SidebarButton
                                    isExpanded={ui.isExpanded}
                                    icon={<Library />}
                                    label="Mis Rutas"
                                    onClick={(e) => { e.stopPropagation(); actions.handlers.handleOpenMisRutas(); }}
                                />
                            )}


                            {ui.modales.setIsFeedbackModalOpen && (
                                <SidebarButton
                                    isExpanded={ui.isExpanded}
                                    icon={<MessageSquareHeart />}
                                    label="Sugerencias"
                                    onClick={(e) => { e.stopPropagation(); ui.modales.setIsFeedbackModalOpen(true); }}
                                />
                            )}
                            <SidebarButton
                                isExpanded={ui.isExpanded}
                                icon={<Info />}
                                label="Leyenda"
                                onClick={(e) => { e.stopPropagation(); ui.setIsLeyendaOpen(true); }}
                                color="theme"
                            />
                            
                            <div className="h-px bg-slate-200 my-2 mx-2"></div>

                            {/* Theme Toggle */}
                            <div ref={themeButtonRef} className="flex flex-col gap-1 relative">
                                <SidebarButton
                                    isExpanded={ui.isExpanded}
                                    icon={<Palette />}
                                    label="Temas"
                                    onClick={(e) => { 
                                        e.stopPropagation(); 
                                        setShowThemeOptions(!showThemeOptions);
                                    }}
                                />
                                {showThemeOptions && createPortal(
                                    <div 
                                        style={{ top: themeMenuPos.top, left: themeMenuPos.left, transform: 'translateY(-50%)' }}
                                        className="fixed z-9999 flex gap-3 p-3 bg-theme-50/70 backdrop-blur-2xl border border-white/60 shadow-2xl shadow-theme-500/20 rounded-2xl"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); setTheme('blue'); setShowThemeOptions(false); }}
                                            className={`w-7 h-7 rounded-full bg-[#3b82f6] shadow-md border-2 ${theme === 'blue' ? 'border-gray-800 scale-110' : 'border-white/80 hover:scale-110'} transition-all`}
                                            title="Azul"
                                        />
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); setTheme('pink'); setShowThemeOptions(false); }}
                                            className={`w-7 h-7 rounded-full bg-[#ec4899] shadow-md border-2 ${theme === 'pink' ? 'border-gray-800 scale-110' : 'border-white/80 hover:scale-110'} transition-all`}
                                            title="Rosado"
                                        />
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); setTheme('purple'); setShowThemeOptions(false); }}
                                            className={`w-7 h-7 rounded-full bg-[#7B2CBF] shadow-md border-2 ${theme === 'purple' ? 'border-gray-800 scale-110' : 'border-white/80 hover:scale-110'} transition-all`}
                                            title="Morado"
                                        />
                                    </div>,
                                    document.body
                                )}
                            </div>

                            {/* Settings */}
                            <SidebarButton
                                isExpanded={ui.isExpanded}
                                icon={<Settings />}
                                label="Ajustes"
                                onClick={(e) => { e.stopPropagation(); ui.modales.setIsSettingsOpen(true); }}
                            />
                        </>
                    ) : (
                        // Custom Mode Stats & Actions
                        <>
                            <div className={`flex flex-col gap-3 mb-4 ${ui.isExpanded ? 'px-2' : 'items-center'}`}>
                                <div className={`flex justify-center items-center gap-3 p-3 bg-white/40 backdrop-blur-md border border-white/50 shadow-sm rounded-xl transition-all ${!ui.isExpanded ? 'w-14 aspect-square flex-col gap-1 p-2' : ''}`}>
                                    <Wrench className={`text-purple-600 shrink-0 ${ui.isExpanded ? 'w-5 h-5' : 'w-4 h-4'} animate-pulse`} />
                                    {ui.isExpanded && <span className="font-bold text-sm text-slate-800">Modo Constructor</span>}
                                </div>

                                <div className={`flex items-center gap-3 p-4 bg-white/40 backdrop-blur-md border border-white/50 shadow-sm rounded-xl transition-all ${!ui.isExpanded ? 'w-14 justify-center aspect-square flex-col gap-1 p-2' : ''}`}>
                                    {ui.isExpanded ? (
                                        <div className="flex-1 flex flex-col items-center">
                                            <span className="text-3xl font-black text-slate-800 leading-none">{customRouteState.currentSemesterUCs}/{customRouteState.totalCustomUCs}</span>
                                            <span className="text-xs font-bold text-slate-700 uppercase tracking-widest mt-1">UCs</span>
                                        </div>
                                    ) : (
                                        <span className="text-xs font-black text-slate-800 leading-none">{customRouteState.currentSemesterUCs}</span>
                                    )}
                                </div>

                                <div className={`flex items-center gap-3 p-3 bg-white/40 backdrop-blur-md border border-white/50 shadow-sm rounded-xl transition-all ${!ui.isExpanded ? 'w-14 justify-center aspect-square flex-col gap-1 p-2' : ''}`}>
                                    <BookOpen className={`text-theme-500 shrink-0 ${ui.isExpanded ? 'w-5 h-5' : 'w-4 h-4'}`} />
                                    {ui.isExpanded ? (
                                        <div className="flex-1 flex justify-between items-center">
                                            <span className="text-sm font-semibold text-slate-700">Materias selec.</span>
                                            <span className="text-slate-800 font-black">{customRouteState.customCurrentSemesterCount}</span>
                                        </div>
                                    ) : (
                                        <span className="text-xs font-black text-slate-800 leading-none">{customRouteState.customCurrentSemesterCount}</span>
                                    )}
                                </div>
                            </div>

                            <div className="h-px bg-slate-200 my-2 mx-2"></div>

                            <SidebarButton
                                isExpanded={ui.isExpanded}
                                icon={<ArrowRight />}
                                label="Avanzar Semestre"
                                onClick={(e) => { e.stopPropagation(); actions.accionesCustom.advanceCustomSemester(); }}
                                disabled={customRouteState.customCurrentSemesterCount === 0}
                                color="theme"
                                variant="solid"
                            />

                            {customRouteState.customSemestersCount > 1 && (
                                <SidebarButton
                                    isExpanded={ui.isExpanded}
                                    icon={<ArrowRight className="rotate-180" />}
                                    label="Retroceder Semestre"
                                    onClick={(e) => { e.stopPropagation(); actions.accionesCustom.undoCustomSemester(); }}
                                    color="gray"
                                    variant="solid"
                                />
                            )}

                            <SidebarButton
                                isExpanded={ui.isExpanded}
                                icon={<Flag />}
                                label="Guardar y Terminar"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    const name = window.prompt("¿Qué nombre le pondrás a esta ruta?");
                                    if (name) actions.handlers.handleFinishCustomRoute?.(name);
                                }}
                                disabled={customRouteState.customSemestersCount === 0 || (customRouteState.customSemestersCount === 1 && customRouteState.customCurrentSemesterCount === 0)}
                                variant="light"
                            />

                            {ui.modales.isMatriculaModalOpen !== undefined && (
                                <SidebarButton
                                    isExpanded={ui.isExpanded}
                                    icon={<Calculator />}
                                    label="Matrícula"
                                    onClick={(e) => { e.stopPropagation(); ui.modales.setIsMatriculaModalOpen(true); }}
                                />
                            )}

                            <SidebarButton
                                isExpanded={ui.isExpanded}
                                icon={<Trash2 />}
                                label="Descartar"
                                onClick={(e) => { e.stopPropagation(); actions.accionesCustom.deleteDraftRoute(); }}
                                color="red"
                            />

                            <SidebarButton
                                isExpanded={ui.isExpanded}
                                icon={<X />}
                                label="Cerrar Constructor"
                                onClick={(e) => { e.stopPropagation(); actions.accionesCustom.cancelCustomRoute(); }}
                                color="gray"
                            />
                        </>
                    )}


                </div>
            )}

            {/* Bottom Actions Fixed Area */}
            {(!ui.isMobile || ui.isExpanded) && !customRouteState.isCustomRouteMode && (
                <div className={`p-4 border-t border-gray-100 bg-gray-50/50 ${ui.isMobile ? 'rounded-b-none pb-8' : 'rounded-b-3xl'} ${!ui.isExpanded ? 'flex justify-center' : ''}`}>
                    <SidebarButton
                        isExpanded={ui.isExpanded}
                        icon={<Trash2 />}
                        label="Borrar Todo"
                        onClick={actions.handleResetProgreso}
                        color="red"
                        variant="ghost"
                    />
                </div>
            )}
        </aside>
    );
};

