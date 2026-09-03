import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import {
    Map as MapPath, Library, MessageSquareHeart, Trash2,
    Wrench, BookOpen, X, Lightbulb, Calculator,
    Menu, Info, GraduationCap, Settings, Palette, HelpCircle, Pencil
} from 'lucide-react';
import { SidebarButton } from './SidebarButton';
import { SidebarStatLabel } from './SidebarStatLabel';
import { SidebarRouteBuilder } from './SidebarRouteBuilder';
import { useTheme } from '../../../hooks/useTheme';
import { AVAILABLE_THEMES } from '../../../constants/theme';
import type { MateriaNode } from '../../../types/materia';
import { useNavigationSidebar } from '../../../hooks/ui/useNavigationSidebar';
import { useRouteBuilderTour } from '../../../hooks/ui/useRouteBuilderTour';
import { RouteBuilderTour } from '../../ui/RouteBuilderTour';
import { useSidebarInteractions } from '../../../hooks/ui/useSidebarInteractions';
import { useMainAppTour } from '../../../hooks/ui/useMainAppTour';
import { MainAppTour } from '../../ui/MainAppTour';
import { RouteNameModal } from '../../modals/RouteNameModal';

export interface NavigationSidebarProps {
    totalMaterias: number;
}

export const NavigationSidebar: React.FC<NavigationSidebarProps> = ({
    totalMaterias,
}) => {
    const { ui, mallaStats, customRouteState, actions } = useNavigationSidebar();
    const [isCursandoDropdownOpen, setIsCursandoDropdownOpen] = useState(false);
    const [isRouteModalOpen, setIsRouteModalOpen] = useState(false);
    const [cursandoHoverRect, setCursandoHoverRect] = useState<DOMRect | null>(null);
    const { theme, setTheme } = useTheme();
    const { run, startTourManually, handleJoyrideCallback } = useRouteBuilderTour(customRouteState.isCustomRouteMode);
    const mainTour = useMainAppTour(customRouteState.isCustomRouteMode);

    const { themeMenu, sugerencias } = useSidebarInteractions({
        routeBuilderTourRun: run,
        mainTourRun: mainTour.run,
        mainTourStepIndex: mainTour.stepIndex,
        isExpanded: ui.isExpanded,
        setIsExpanded: ui.setIsExpanded,
        isMobile: ui.isMobile,
        setIsFeedbackModalOpen: ui.modales.setIsFeedbackModalOpen
    });

    const { showThemeOptions, setShowThemeOptions, themeButtonRef, themeMenuPos } = themeMenu;
    const { hasSeenSugerencias, shouldWiggle, handleSugerenciasClick } = sugerencias;

    // Responsive layout constants
    const mobileClasses = ui.isExpanded
        ? 'left-3 top-3 w-[calc(100vw-1.5rem)] landscape:w-[calc(50vw-1.5rem)] h-[calc(100dvh-1.5rem)] rounded-3xl origin-top-left' // Ancla superior izquierda, expande w/h
        : 'left-3 top-3 w-9 h-9 rounded-xl shadow-md origin-top-left'; // Botón flotante cuadrado redondeado

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
                        <img src="/favicon.png" alt="Logo" className="w-9 h-9 object-contain drop-shadow-sm" />
                        <h1 className="text-lg font-bold text-gray-800 whitespace-nowrap">MallaSandBox</h1>
                    </div>
                )}
                <button
                    onClick={() => ui.setIsExpanded(!ui.isExpanded)}
                    className={`rounded-xl cursor-pointer hover:bg-gray-100 text-gray-700 transition-colors flex items-center justify-center ${!ui.isExpanded && ui.isMobile ? 'w-9 h-9' : 'p-2.5'}`}
                >
                    {ui.isExpanded ? <X className="w-6 h-6" /> : <Menu className="w-4 h-4" />}
                </button>
            </div>

            {/* Content Area (Fades out on mobile if collapsed) */}
            <div className={`flex-1 overflow-y-auto overflow-x-hidden flex flex-col gap-3 p-3 hide-scrollbar transition-opacity duration-300 ${!ui.isExpanded && ui.isMobile ? 'opacity-0 pointer-events-none' : 'opacity-100 delay-100'}`}>

                {/* Regular Mode Stats */}
                    {!customRouteState.isCustomRouteMode ? (
                        <>
                            <div id="tour-main-stats" className={`flex flex-col gap-3 mb-4 ${ui.isExpanded ? 'px-2' : 'items-center'}`}>
                                {/* Aprobadas Stat */}
                                <SidebarStatLabel 
                                    isExpanded={ui.isExpanded}
                                    icon={BookOpen}
                                    iconColorClass="text-theme-500"
                                    title="Materias Aprobadas"
                                    value={`${mallaStats.cantidadAprobadas}/${totalMaterias}`}
                                    collapsedValue={mallaStats.cantidadAprobadas}
                                />

                                {/* UC Stat */}
                                <SidebarStatLabel 
                                    isExpanded={ui.isExpanded}
                                    icon={Lightbulb}
                                    iconColorClass="text-green-500"
                                    title="UC Acumuladas"
                                    value={mallaStats.ucAcumuladas}
                                />

                                {/* Semestre Actual Stat */}
                                <SidebarStatLabel 
                                    isExpanded={ui.isExpanded}
                                    icon={GraduationCap}
                                    iconColorClass="text-theme-500"
                                    title="Semestre Actual"
                                    value={mallaStats.semestreActual}
                                />

                                {/* UC Cursando */}
                                {mallaStats.ucCursando > 0 && (
                                    <div 
                                        className="relative w-full group"
                                        onMouseEnter={(e) => { if (!ui.isMobile) setCursandoHoverRect(e.currentTarget.getBoundingClientRect()); }}
                                        onMouseLeave={() => { if (!ui.isMobile) setCursandoHoverRect(null); }}
                                    >
                                        <SidebarStatLabel 
                                            isExpanded={ui.isExpanded}
                                            customIcon={
                                                <Pencil className={`text-blue-500 shrink-0 animate-pulse ${ui.isExpanded ? 'w-5 h-5' : 'w-4 h-4'}`} />
                                            }
                                            title="UC Cursando"
                                            value={mallaStats.ucCursando}
                                            smallCollapsedText={true}
                                            disableTooltip={true}
                                            onClick={ui.isMobile ? () => setIsCursandoDropdownOpen(!isCursandoDropdownOpen) : undefined}
                                        />

                                        {/* Mobile Accordion */}
                                        {ui.isMobile && isCursandoDropdownOpen && ui.isExpanded && (
                                            <div className="w-full mt-2 bg-white/60 border border-white/50 shadow-inner rounded-xl p-3 transition-all animate-fade-in-up">
                                                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Materias Cursando</h4>
                                                <ul className="flex flex-col gap-2 max-h-48 overflow-y-auto hide-scrollbar">
                                                    {mallaStats.materiasCursando?.map((m: MateriaNode) => (
                                                        <li key={m.codigoMateria} className="text-sm text-slate-700 font-medium flex justify-between gap-2">
                                                            <span className="truncate">{m.nombre}</span>
                                                            <span className="text-xs text-theme-600 font-bold shrink-0">{m.unidadesCredito} UC</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        {/* Desktop Hover Tooltip (Portaled to document.body to escape overflow) */}
                                        {!ui.isMobile && cursandoHoverRect && createPortal(
                                            <div 
                                                className="fixed z-100 pointer-events-none"
                                                style={{
                                                    top: cursandoHoverRect.top - 20,
                                                    left: cursandoHoverRect.right + 16,
                                                }}
                                            >
                                                <div className="w-64 bg-white/95 backdrop-blur-xl border border-white/60 shadow-xl rounded-2xl p-4 animate-fade-in-up">
                                                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Materias Cursando</h4>
                                                    <ul className="flex flex-col gap-2 max-h-[60vh] overflow-y-auto hide-scrollbar">
                                                        {mallaStats.materiasCursando?.map((m: MateriaNode) => (
                                                            <li key={m.codigoMateria} className="text-sm text-slate-700 font-medium flex justify-between items-start gap-2">
                                                                <span className="leading-tight">{m.nombre}</span>
                                                                <span className="text-xs text-theme-600 font-bold shrink-0 bg-theme-50 px-1.5 py-0.5 rounded-md">{m.unidadesCredito} UC</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>,
                                            document.body
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="h-px bg-slate-200 my-2 mx-2"></div>

                            {/* Actions */}
                            <SidebarButton
                                id="tour-main-ruta-optima"
                                isExpanded={ui.isExpanded}
                                icon={<MapPath />}
                                label="Ruta Óptima"
                                onClick={(e) => { e.stopPropagation(); actions.handlers.handleShowRutaOptima(); }}
                                color="theme"
                                variant="solid"
                            />

                            {actions.accionesCustom.startCustomRoute && (
                                <SidebarButton
                                    id="tour-main-crear-ruta"
                                    isExpanded={ui.isExpanded}
                                    icon={<Wrench />}
                                    label={customRouteState.hasDraftRoute ? "Volver al borrador" : "Crear Ruta"}
                                    onClick={(e) => { e.stopPropagation(); actions.accionesCustom.startCustomRoute(); }}
                                />
                            )}

                            {ui.modales.isMatriculaModalOpen !== undefined && (
                                <SidebarButton
                                    id="tour-main-matricula"
                                    isExpanded={ui.isExpanded}
                                    icon={<Calculator />}
                                    label="Matrícula"
                                    onClick={(e) => { e.stopPropagation(); ui.modales.setIsMatriculaModalOpen(true); }}
                                />
                            )}

                            {actions.handlers.handleOpenMisRutas && (
                                <SidebarButton
                                    id="tour-main-mis-rutas"
                                    isExpanded={ui.isExpanded}
                                    icon={<Library />}
                                    label="Mis Rutas"
                                    onClick={(e) => { e.stopPropagation(); actions.handlers.handleOpenMisRutas(); }}
                                />
                            )}

                            {/* 
                            <SidebarButton
                                isExpanded={ui.isExpanded}
                                icon={<GraduationCap />}
                                label="Cambiar Carrera"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    // Resetting plan ID unmounts MallaPage and mounts WelcomeModal
                                    // which resets the state. We don't need to unset carrera ID 
                                    // because the WelcomeModal has a back button to change career if wanted.
                                    // But actually we could do it through a custom event or context.
                                    // Let's use localStorage and reload for a completely fresh start since 
                                    // contexts are spread out.
                                    localStorage.removeItem('malla-active-plan');
                                    localStorage.removeItem('malla-active-carrera');
                                    window.location.reload();
                                }}
                            />
                            */}

                            <SidebarButton
                                id="tour-main-sugerencias"
                                isExpanded={ui.isExpanded}
                                icon={<MessageSquareHeart className={shouldWiggle ? 'animate-wiggle text-theme-500' : ''} />}
                                label="Sugerencias"
                                onClick={handleSugerenciasClick}
                                showBadge={!hasSeenSugerencias}
                            />
                            <SidebarButton
                                isExpanded={ui.isExpanded}
                                icon={<Info />}
                                label="Leyenda"
                                onClick={(e) => { e.stopPropagation(); ui.setIsLeyendaOpen(true); }}
                                color="theme"
                            />

                            <div className="h-px bg-slate-200 my-2 mx-2"></div>

                            <SidebarButton
                                isExpanded={ui.isExpanded}
                                icon={<HelpCircle />}
                                label="Tutorial"
                                onClick={(e) => { e.stopPropagation(); mainTour.startTourManually(); }}
                                color="theme"
                                variant="ghost"
                            />

                            {/* Theme Toggle */}
                            <div id="tour-main-temas" ref={themeButtonRef} className="flex flex-col gap-1 relative">
                                <SidebarButton
                                    isExpanded={ui.isExpanded}
                                    icon={<Palette />}
                                    label="Temas"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setShowThemeOptions(!showThemeOptions);
                                    }}
                                />
                                {/* Opciones de temas */}
                                {showThemeOptions && (
                                    ui.isMobile ? (
                                        <div className="flex gap-3 px-4 py-2 bg-theme-100/50 rounded-xl mt-1 mx-2 justify-center" onClick={(e) => e.stopPropagation()}>
                                            {AVAILABLE_THEMES.map(t => (
                                                <button
                                                    key={t.id}
                                                    onClick={(e) => { e.stopPropagation(); setTheme(t.id); setShowThemeOptions(false); }}
                                                    style={{ backgroundColor: t.hex }}
                                                    className={`w-7 h-7 shrink-0 rounded-full shadow-md border-2 ${theme === t.id ? 'border-gray-800 scale-110' : 'border-white/80 hover:scale-110'} transition-all`}
                                                    title={t.label}
                                                />
                                            ))}
                                        </div>
                                    ) : createPortal(
                                        <div
                                            style={{ top: themeMenuPos.top, left: themeMenuPos.left, transform: 'translateY(-50%)' }}
                                            className="fixed z-9999 flex gap-3 p-3 bg-theme-50/70 backdrop-blur-2xl border border-white/60 shadow-2xl shadow-theme-500/20 rounded-2xl"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            {AVAILABLE_THEMES.map(t => (
                                                <button
                                                    key={t.id}
                                                    onClick={(e) => { e.stopPropagation(); setTheme(t.id); setShowThemeOptions(false); }}
                                                    style={{ backgroundColor: t.hex }}
                                                    className={`w-7 h-7 rounded-full shadow-md border-2 ${theme === t.id ? 'border-gray-800 scale-110' : 'border-white/80 hover:scale-110'} transition-all`}
                                                    title={t.label}
                                                />
                                            ))}
                                        </div>,
                                        document.body
                                    )
                                )}
                            </div>

                            {/* Settings */}
                            <SidebarButton
                                isExpanded={ui.isExpanded}
                                icon={<Settings />}
                                label="Ajustes"
                                onClick={(e) => { e.stopPropagation(); ui.modales.setIsSettingsOpen(true); }}
                            />

                            <div className="h-px bg-slate-200 my-2 mx-2"></div>

                            <SidebarButton
                                id="tour-main-borrar-todo"
                                isExpanded={ui.isExpanded}
                                icon={<Trash2 />}
                                label="Borrar Todo"
                                onClick={actions.handleResetProgreso}
                                color="red"
                                variant="ghost"
                            />
                        </>
                    ) : (
                        // Custom Mode Stats & Actions
                        <SidebarRouteBuilder 
                            isExpanded={ui.isExpanded}
                            customRouteState={customRouteState}
                            accionesCustom={actions.accionesCustom}
                            setIsRouteModalOpen={setIsRouteModalOpen}
                            startTourManually={startTourManually}
                            isMatriculaModalOpen={ui.modales.isMatriculaModalOpen}
                            setIsMatriculaModalOpen={ui.modales.setIsMatriculaModalOpen}
                        />
                    )}


            </div>



            <>
                <RouteBuilderTour run={run} handleJoyrideCallback={handleJoyrideCallback} />
                <MainAppTour run={mainTour.run} handleJoyrideCallback={mainTour.handleJoyrideCallback} />
                
                <RouteNameModal 
                    isOpen={isRouteModalOpen}
                    onClose={() => setIsRouteModalOpen(false)}
                    onConfirm={(name) => actions.handlers.handleFinishCustomRoute?.(name)}
                />
            </>
        </aside>
    );
};
