import React, { useState } from 'react';
import { useNavigationSidebar } from '../../hooks/ui/useNavigationSidebar';
import { Wrench, ArrowRight, Save, X, ArrowLeft, BookOpen } from 'lucide-react';
import { RouteNameModal } from '../modals/RouteNameModal';

export const ConstructorToolbar: React.FC = () => {
    const { customRouteState, actions } = useNavigationSidebar();
    const [isRouteModalOpen, setIsRouteModalOpen] = useState(false);

    if (!customRouteState.isCustomRouteMode) return null;

    const {
        customSemestersCount,
        customCurrentSemesterCount,
        currentSemesterUCs,
        totalCustomUCs,
    } = customRouteState;

    const handleSave = () => {
        setIsRouteModalOpen(true);
    };

    const confirmSave = (name: string) => {
        actions.handlers.handleFinishCustomRoute?.(name);
    };

    const canAdvance = customCurrentSemesterCount > 0;
    const canUndo = customSemestersCount > 1;
    const canSave = customSemestersCount > 0 && !(customSemestersCount === 1 && customCurrentSemesterCount === 0);

    return (
        <>
            <div className="fixed bottom-0 left-0 right-0 z-40 p-3 sm:p-5 pointer-events-none flex justify-center">
                <div className="bg-white/80 backdrop-blur-xl border border-gray-200/60 shadow-2xl rounded-3xl md:rounded-full p-3 md:px-5 md:py-3 pointer-events-auto flex flex-col md:flex-row items-center gap-3 md:gap-6 w-full max-w-[95%] md:max-w-max animate-slide-up">
                    
                    {/* Contenedor de Estadísticas */}
                    <div id="tour-toolbar-stats" className="flex items-center justify-between md:justify-center gap-2 w-full md:w-auto">
                        
                        {/* Semestre actual */}
                        <div className="flex items-center justify-center gap-1.5 px-3 h-11 bg-white/50 backdrop-blur-md border border-white/60 shadow-sm rounded-xl flex-1 md:flex-none">
                            <Wrench className="w-4 h-4 text-theme-600 animate-pulse shrink-0" />
                            <span className="font-bold text-xs text-slate-800 whitespace-nowrap">Sem {customSemestersCount}</span>
                        </div>

                        {/* Materias */}
                        <div className="flex items-center justify-center gap-1.5 px-3 h-11 bg-white/50 backdrop-blur-md border border-white/60 shadow-sm rounded-xl flex-1 md:flex-none">
                            <BookOpen className="w-4 h-4 text-theme-500 shrink-0" />
                            <span className="font-bold text-xs text-slate-800">{customCurrentSemesterCount}</span>
                        </div>

                        {/* UCs */}
                        <div 
                            className="flex flex-col items-center justify-center px-3 h-11 bg-white/50 backdrop-blur-md border border-white/60 shadow-sm rounded-xl min-w-16 flex-1 md:flex-none"
                            title={`Semestre: ${currentSemesterUCs} UC | Total Ruta: ${totalCustomUCs} UC`}
                        >
                            <span className="text-sm font-black text-slate-800 leading-none">{currentSemesterUCs}</span>
                            <span className="text-[9px] font-bold text-slate-700 uppercase tracking-widest mt-0.5">UCs</span>
                        </div>
                    </div>

                    <div className="w-px h-8 bg-gray-300/50 hidden md:block mx-1"></div>

                    {/* Contenedor de Botones de Acción */}
                    <div className="flex items-center justify-between md:justify-center gap-2 w-full md:w-auto">
                        <button
                            onClick={() => actions.accionesCustom.undoCustomSemester()}
                            disabled={!canUndo}
                            className="flex items-center justify-center h-11 flex-1 md:flex-none md:w-11 bg-theme-500/10 backdrop-blur-md border border-theme-500/20 shadow-sm text-theme-600 rounded-xl hover:bg-theme-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Retroceder Semestre"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>

                        <button
                            id="tour-toolbar-avanzar"
                            onClick={() => actions.accionesCustom.advanceCustomSemester()}
                            disabled={!canAdvance}
                            className="flex items-center justify-center h-11 flex-1 md:flex-none md:w-11 bg-theme-500/80 backdrop-blur-md border border-theme-400 shadow-md shadow-theme-500/20 text-white rounded-xl hover:bg-theme-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Avanzar Semestre"
                        >
                            <ArrowRight className="w-5 h-5" />
                        </button>

                        <button
                            id="tour-toolbar-guardar"
                            onClick={handleSave}
                            disabled={!canSave}
                            className="flex items-center justify-center h-11 flex-1 md:flex-none md:w-11 bg-theme-500/10 backdrop-blur-md border border-theme-500/20 shadow-sm text-theme-600 rounded-xl hover:bg-theme-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Guardar Ruta"
                        >
                            <Save className="w-5 h-5" />
                        </button>

                        <button
                            id="tour-toolbar-cerrar"
                            onClick={() => actions.accionesCustom.cancelCustomRoute()}
                            className="flex items-center justify-center h-11 flex-1 md:flex-none md:w-11 bg-theme-500/10 backdrop-blur-md border border-theme-500/20 shadow-sm text-theme-600 rounded-xl hover:bg-theme-500/20 transition-all ml-0 md:ml-2"
                            title="Cerrar Constructor"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                </div>
            </div>

            <RouteNameModal 

                isOpen={isRouteModalOpen}
                onClose={() => setIsRouteModalOpen(false)}
                onConfirm={confirmSave}
            />
        </>
    );
};
