import React from 'react';
import {
    Map as MapPath, Library, MessageSquareHeart, Trash2,
    Wrench, BookOpen, ArrowRight, X, Lightbulb, Flag, Calculator,
    Menu, LayoutDashboard, Info
} from 'lucide-react';
import { SidebarButton } from './SidebarButton';
import { useNavigationSidebar } from '../../../hooks/ui/useNavigationSidebar';

export interface NavigationSidebarProps {
    totalMaterias: number;
}

export const NavigationSidebar: React.FC<NavigationSidebarProps> = ({
    totalMaterias,
}) => {
    const { ui, mallaStats, customRouteState, actions } = useNavigationSidebar();

    // Responsive layout constants
    const mobileClasses = ui.isExpanded
        ? 'inset-x-4 top-4 bottom-4 w-auto rounded-3xl h-[calc(100dvh-2rem)]' // Full screen with margins
        : 'left-4 top-4 w-15 h-15 rounded-full justify-center items-center shadow-lg'; // Floating button top-left

    const desktopClasses = ui.isExpanded
        ? 'left-4 top-4 bottom-4 w-72 rounded-3xl'
        : 'left-4 top-4 bottom-4 w-20 rounded-3xl';

    return (
        <aside
            className={`fixed z-50 flex flex-col bg-white/95 backdrop-blur-xl border border-gray-200/80 shadow-2xl transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] 
                ${ui.isMobile ? mobileClasses : desktopClasses}`}
        >
            {/* Toggle Button */}
            <div className={`${ui.isExpanded ? 'p-4 border-b border-gray-100' : ui.isMobile ? 'p-2' : 'p-4'} flex items-center ${ui.isExpanded || ui.isMobile ? 'justify-between' : 'justify-center'} w-full shrink-0`}>
                {ui.isExpanded && (
                    <div className="flex items-center gap-2 overflow-hidden">
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                            <LayoutDashboard className="w-5 h-5" />
                        </div>
                        <h1 className="text-lg font-bold text-gray-800 whitespace-nowrap">Mi Malla</h1>
                    </div>
                )}
                <button
                    onClick={() => ui.setIsExpanded(!ui.isExpanded)}
                    className={`rounded-xl hover:bg-gray-100 text-gray-700 transition-colors flex items-center justify-center ${!ui.isExpanded && ui.isMobile ? 'w-11 h-11' : 'p-2.5'}`}
                >
                    {ui.isExpanded ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Content Area (Hidden on mobile if collapsed) */}
            {(!ui.isMobile || ui.isExpanded) && (
                <div className="flex-1 overflow-y-auto overflow-x-hidden flex flex-col gap-2 p-3 hide-scrollbar">

                    {/* Regular Mode Stats */}
                    {!customRouteState.isCustomRouteMode ? (
                        <>
                            <div className={`flex flex-col gap-2 mb-4 ${ui.isExpanded ? 'px-2' : 'items-center'}`}>
                                {/* Aprobadas Stat */}
                                <div className={`flex items-center gap-3 p-3 bg-gray-50 rounded-2xl border border-gray-100 transition-all ${!ui.isExpanded ? 'w-14 justify-center aspect-square flex-col gap-1 p-2' : ''}`}>
                                    <BookOpen className={`text-blue-500 shrink-0 ${ui.isExpanded ? 'w-5 h-5' : 'w-4 h-4'}`} />
                                    {ui.isExpanded ? (
                                        <div className="flex-1 flex justify-between items-center">
                                            <span className="text-sm font-semibold text-gray-600">Aprobadas</span>
                                            <span className="text-blue-600 font-black">{mallaStats.cantidadAprobadas}/{totalMaterias}</span>
                                        </div>
                                    ) : (
                                        <span className="text-xs font-black text-blue-600 leading-none">{mallaStats.cantidadAprobadas}</span>
                                    )}
                                </div>

                                {/* UC Stat */}
                                <div className={`flex items-center gap-3 p-3 bg-gray-50 rounded-2xl border border-gray-100 transition-all ${!ui.isExpanded ? 'w-14 justify-center aspect-square flex-col gap-1 p-2' : ''}`}>
                                    <Lightbulb className={`text-amber-500 shrink-0 ${ui.isExpanded ? 'w-5 h-5' : 'w-4 h-4'}`} />
                                    {ui.isExpanded ? (
                                        <div className="flex-1 flex justify-between items-center">
                                            <span className="text-sm font-semibold text-gray-600">UC Aprobadas</span>
                                            <span className="text-amber-600 font-black">{mallaStats.ucAcumuladas}</span>
                                        </div>
                                    ) : (
                                        <span className="text-xs font-black text-amber-600 leading-none">{mallaStats.ucAcumuladas}</span>
                                    )}
                                </div>

                                {/* UC Cursando */}
                                {mallaStats.ucCursando > 0 && (
                                    <div className={`flex items-center gap-3 p-3 bg-blue-50 rounded-2xl border border-blue-100 transition-all ${!ui.isExpanded ? 'w-14 justify-center aspect-square flex-col gap-1 p-2' : ''}`}>
                                        <div className="relative shrink-0 flex items-center justify-center w-5 h-5">
                                            <span className="absolute w-2.5 h-2.5 rounded-full bg-blue-500 animate-ping opacity-75"></span>
                                            <span className="relative w-2 h-2 rounded-full bg-blue-600"></span>
                                        </div>
                                        {ui.isExpanded ? (
                                            <div className="flex-1 flex justify-between items-center">
                                                <span className="text-sm font-semibold text-blue-800">UC Cursando</span>
                                                <span className="text-blue-700 font-black">{mallaStats.ucCursando}</span>
                                            </div>
                                        ) : (
                                            <span className="text-[10px] sm:text-xs font-black text-blue-700 leading-none">{mallaStats.ucCursando}</span>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="h-px bg-gray-100 my-2 mx-2"></div>

                            {/* Actions */}
                            <SidebarButton
                                isExpanded={ui.isExpanded}
                                icon={<MapPath />}
                                label="Ruta Óptima"
                                onClick={(e) => { e.stopPropagation(); actions.handlers.handleShowRutaOptima(); }}
                                color="blue"
                            />

                            {actions.accionesCustom.startCustomRoute && (
                                <SidebarButton
                                    isExpanded={ui.isExpanded}
                                    icon={<Wrench />}
                                    label={customRouteState.hasDraftRoute ? "Volver al borrador" : "Crear Ruta"}
                                    onClick={(e) => { e.stopPropagation(); actions.accionesCustom.startCustomRoute(); }}
                                    color="purple"
                                />
                            )}

                            {ui.modales.isMatriculaModalOpen !== undefined && (
                                <SidebarButton
                                    isExpanded={ui.isExpanded}
                                    icon={<Calculator />}
                                    label="Matrícula"
                                    onClick={(e) => { e.stopPropagation(); ui.modales.setIsMatriculaModalOpen(true); }}
                                    color="green"
                                />
                            )}

                            {actions.handlers.handleOpenMisRutas && (
                                <SidebarButton
                                    isExpanded={ui.isExpanded}
                                    icon={<Library />}
                                    label="Mis Rutas"
                                    onClick={(e) => { e.stopPropagation(); actions.handlers.handleOpenMisRutas(); }}
                                    color="indigo"
                                />
                            )}

                            {ui.modales.setIsFeedbackModalOpen && (
                                <SidebarButton
                                    isExpanded={ui.isExpanded}
                                    icon={<MessageSquareHeart />}
                                    label="Sugerencias"
                                    onClick={(e) => { e.stopPropagation(); ui.modales.setIsFeedbackModalOpen(true); }}
                                    color="gray"
                                />
                            )}
                            <SidebarButton
                                isExpanded={ui.isExpanded}
                                icon={<Info />}
                                label="Leyenda"
                                onClick={(e) => { e.stopPropagation(); ui.setIsLeyendaOpen(true); }}
                                color="blue"
                                variant="ghost"
                            />
                        </>
                    ) : (
                        // Custom Mode Stats & Actions
                        <>
                            <div className={`flex flex-col gap-2 mb-4 ${ui.isExpanded ? 'px-2' : 'items-center'}`}>
                                <div className={`flex justify-center items-center gap-3 p-3 bg-purple-50 rounded-2xl border border-purple-100 transition-all ${!ui.isExpanded ? 'w-14 aspect-square flex-col gap-1 p-2' : ''}`}>
                                    <Wrench className={`text-purple-600 shrink-0 ${ui.isExpanded ? 'w-5 h-5' : 'w-4 h-4'} animate-pulse`} />
                                    {ui.isExpanded && <span className="font-bold text-sm text-purple-800">Modo Constructor</span>}
                                </div>

                                <div className={`flex items-center gap-3 p-4 bg-gray-50 border border-gray-100 border-t-2 border-t-dashed border-t-indigo-200 rounded-2xl transition-all ${!ui.isExpanded ? 'w-14 justify-center aspect-square flex-col gap-1 p-2' : ''}`}>
                                    {ui.isExpanded ? (
                                        <div className="flex-1 flex flex-col items-center">
                                            <span className="text-3xl font-black text-blue-900 leading-none">{customRouteState.currentSemesterUCs}/{customRouteState.totalCustomUCs}</span>
                                            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">UCs</span>
                                        </div>
                                    ) : (
                                        <span className="text-xs font-black text-blue-900 leading-none">{customRouteState.currentSemesterUCs}</span>
                                    )}
                                </div>

                                <div className={`flex items-center gap-3 p-3 bg-white rounded-2xl border border-gray-100 transition-all ${!ui.isExpanded ? 'w-14 justify-center aspect-square flex-col gap-1 p-2' : ''}`}>
                                    <BookOpen className={`text-blue-500 shrink-0 ${ui.isExpanded ? 'w-5 h-5' : 'w-4 h-4'}`} />
                                    {ui.isExpanded ? (
                                        <div className="flex-1 flex justify-between items-center">
                                            <span className="text-sm font-semibold text-gray-600">Materias selec.</span>
                                            <span className="text-blue-600 font-black">{customRouteState.customCurrentSemesterCount}</span>
                                        </div>
                                    ) : (
                                        <span className="text-xs font-black text-blue-600 leading-none">{customRouteState.customCurrentSemesterCount}</span>
                                    )}
                                </div>
                            </div>

                            <div className="h-px bg-gray-100 my-2 mx-2"></div>

                            <SidebarButton
                                isExpanded={ui.isExpanded}
                                icon={<ArrowRight />}
                                label="Avanzar Semestre"
                                onClick={(e) => { e.stopPropagation(); actions.accionesCustom.advanceCustomSemester(); }}
                                disabled={customRouteState.customCurrentSemesterCount === 0}
                                color="blue"
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
                                color="indigo"
                                variant="light"
                            />

                            {ui.modales.isMatriculaModalOpen !== undefined && (
                                <SidebarButton
                                    isExpanded={ui.isExpanded}
                                    icon={<Calculator />}
                                    label="Matrícula"
                                    onClick={(e) => { e.stopPropagation(); ui.modales.setIsMatriculaModalOpen(true); }}
                                    color="green"
                                />
                            )}

                            <SidebarButton
                                isExpanded={ui.isExpanded}
                                icon={<Trash2 />}
                                label="Descartar"
                                onClick={(e) => { e.stopPropagation(); actions.accionesCustom.deleteDraftRoute(); }}
                                color="red"
                                variant="ghost"
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

