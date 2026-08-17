import React from 'react';
import { Wrench, BookOpen, ArrowRight, Flag, HelpCircle, Calculator, Trash2, X } from 'lucide-react';
import { SidebarButton } from './SidebarButton';
import type { useNavigationSidebar } from '../../../hooks/ui/useNavigationSidebar';
import type { useMallaData } from '../../../contexts/MallaContexts';

type CustomRouteState = ReturnType<typeof useNavigationSidebar>['customRouteState'];
type CustomRouteActions = ReturnType<typeof useMallaData>['accionesCustom'];

export interface SidebarRouteBuilderProps {
    isExpanded: boolean;
    customRouteState: CustomRouteState;
    accionesCustom: CustomRouteActions;
    setIsRouteModalOpen: (isOpen: boolean) => void;
    startTourManually: () => void;
    isMatriculaModalOpen?: boolean;
    setIsMatriculaModalOpen?: (isOpen: boolean) => void;
}

export const SidebarRouteBuilder: React.FC<SidebarRouteBuilderProps> = ({
    isExpanded,
    customRouteState,
    accionesCustom,
    setIsRouteModalOpen,
    startTourManually,
    isMatriculaModalOpen,
    setIsMatriculaModalOpen
}) => {
    return (
        <>
            <div id="tour-stats" className={`flex flex-col gap-3 mb-4 ${isExpanded ? 'px-2' : 'items-center'}`}>
                <div id="tour-modo-constructor" className={`flex justify-center items-center gap-3 p-3 bg-white/40 backdrop-blur-md border border-white/50 shadow-sm rounded-xl transition-all ${!isExpanded ? 'w-14 aspect-square flex-col gap-1 p-2' : ''}`}>
                    <Wrench className={`text-theme-600 shrink-0 ${isExpanded ? 'w-5 h-5' : 'w-4 h-4'} animate-pulse`} />
                    {isExpanded && <span className="font-bold text-sm text-slate-800">Modo Constructor</span>}
                </div>

                <div className={`flex items-center gap-3 p-4 bg-white/40 backdrop-blur-md border border-white/50 shadow-sm rounded-xl transition-all ${!isExpanded ? 'w-14 justify-center aspect-square flex-col gap-1 p-2' : ''}`}>
                    {isExpanded ? (
                        <div className="flex-1 flex flex-col items-center">
                            <span className="text-3xl font-black text-slate-800 leading-none">{customRouteState.currentSemesterUCs}/{customRouteState.totalCustomUCs}</span>
                            <span className="text-xs font-bold text-slate-700 uppercase tracking-widest mt-1">UCs</span>
                        </div>
                    ) : (
                        <span className="text-xs font-black text-slate-800 leading-none">{customRouteState.currentSemesterUCs}</span>
                    )}
                </div>

                <div className={`flex items-center gap-3 p-3 bg-white/40 backdrop-blur-md border border-white/50 shadow-sm rounded-xl transition-all ${!isExpanded ? 'w-14 justify-center aspect-square flex-col gap-1 p-2' : ''}`}>
                    <BookOpen className={`text-theme-500 shrink-0 ${isExpanded ? 'w-5 h-5' : 'w-4 h-4'}`} />
                    {isExpanded ? (
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
                id="tour-avanzar"
                isExpanded={isExpanded}
                icon={<ArrowRight />}
                label="Avanzar Semestre"
                onClick={(e) => { e.stopPropagation(); accionesCustom.advanceCustomSemester(); }}
                disabled={customRouteState.customCurrentSemesterCount === 0}
                color="theme"
                variant="solid"
            />

            {customRouteState.customSemestersCount > 1 && (
                <SidebarButton
                    isExpanded={isExpanded}
                    icon={<ArrowRight className="rotate-180" />}
                    label="Retroceder Semestre"
                    onClick={(e) => { e.stopPropagation(); accionesCustom.undoCustomSemester(); }}
                    color="gray"
                    variant="solid"
                />
            )}

            <SidebarButton
                id="tour-guardar"
                isExpanded={isExpanded}
                icon={<Flag />}
                label="Guardar y Terminar"
                onClick={(e) => {
                    e.stopPropagation();
                    setIsRouteModalOpen(true);
                }}
                disabled={customRouteState.customSemestersCount === 0 || (customRouteState.customSemestersCount === 1 && customRouteState.customCurrentSemesterCount === 0)}
                variant="light"
            />

            <SidebarButton
                isExpanded={isExpanded}
                icon={<HelpCircle />}
                label="Tutorial"
                onClick={(e) => { e.stopPropagation(); startTourManually(); }}
                color="theme"
                variant="ghost"
            />

            {isMatriculaModalOpen !== undefined && setIsMatriculaModalOpen && (
                <SidebarButton
                    isExpanded={isExpanded}
                    icon={<Calculator />}
                    label="Matrícula"
                    onClick={(e) => { e.stopPropagation(); setIsMatriculaModalOpen(true); }}
                />
            )}

            <SidebarButton
                isExpanded={isExpanded}
                icon={<Trash2 />}
                label="Descartar"
                onClick={(e) => { e.stopPropagation(); accionesCustom.deleteDraftRoute(); }}
                color="red"
            />

            <SidebarButton
                isExpanded={isExpanded}
                icon={<X />}
                label="Cerrar Constructor"
                onClick={(e) => { e.stopPropagation(); accionesCustom.cancelCustomRoute(); }}
                color="gray"
            />
        </>
    );
};
