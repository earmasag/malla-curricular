import React from 'react';
import {
    Map as MapPath, Library, MessageSquareHeart, Trash2,
    Wrench, BookOpen, ArrowRight, X, Lightbulb, Flag, Calculator
} from 'lucide-react';
import { useNotification } from '../../hooks/useNotification';
import { useMallaData, useMallaUI } from '../../contexts/MallaContexts';

export interface MallaHeaderProps {
    totalMaterias: number;
}

export const MallaHeader: React.FC<MallaHeaderProps> = ({
    totalMaterias,
}) => {
    // 1. Extraemos lógica del Contexto para mitigar Prop Bloat
    const { estadoMalla, accionesMalla, estadoCustom, accionesCustom } = useMallaData();
    const { modales, handlers } = useMallaUI();
    const { confirm } = useNotification();

    // 2. Desestructuramos para conveniencia de renderizado
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

    const [isExpanded, setIsExpanded] = React.useState(false);

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

    return (
        <header
            onClick={() => setIsExpanded(!isExpanded)}
            className="fixed bottom-4 left-4 z-50 flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4 p-3 md:px-5 md:py-3 bg-white/90 backdrop-blur-md border border-white/60 shadow-xl rounded-2xl md:rounded-full cursor-pointer transition-all duration-300 max-w-[calc(100vw-80px)] overflow-hidden"
            title="Click para expandir o colapsar"
        >
            <h1 className="text-sm md:text-base font-bold text-gray-800 drop-shadow-sm whitespace-nowrap">
                Mi Malla Curricular
            </h1>

            <div className="flex flex-wrap items-center gap-2 text-xs md:text-sm font-medium text-gray-700 w-full shrink-0">
                {!isCustomRouteMode ? (
                    <>
                        <div className="bg-white px-3 py-1.5 rounded-full shadow-sm border border-gray-200 flex items-center gap-1.5">
                            <BookOpen className="w-4 h-4 text-blue-500" />
                            {isExpanded && <span className="whitespace-nowrap">Aprobadas:</span>}
                            <span className="text-blue-600 font-bold">{cantidadAprobadas} / {totalMaterias}</span>
                        </div>

                        <div className="bg-white px-3 py-1.5 rounded-full shadow-sm border border-gray-200 flex items-center gap-1.5">
                            <Lightbulb className="w-4 h-4 text-amber-500" />
                            {isExpanded && <span className="whitespace-nowrap">UC Aprobadas:</span>}
                            <span className="text-blue-600 font-bold">{ucAcumuladas}</span>
                        </div>

                        {ucCursando > 0 && (
                            <div className="bg-blue-50 px-3 py-1.5 rounded-full shadow-sm border border-blue-200 flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                                {isExpanded && <span className="text-blue-800 whitespace-nowrap">UC Cursando:</span>}
                                <span className="text-blue-700 font-bold">{ucCursando}</span>
                            </div>
                        )}

                        {isExpanded && (
                            <>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handlers.handleShowRutaOptima();
                                    }}
                                    className="bg-blue-50 text-blue-600 hover:bg-blue-500 hover:text-white px-3 py-1.5 rounded-full shadow-sm border border-blue-200 flex items-center gap-1.5 transition-colors"
                                    title="Calcular la ruta más rápida para graduarte"
                                >
                                    <MapPath className="w-4 h-4" />
                                    <span className="whitespace-nowrap">Ruta Óptima</span>
                                </button>

                                {accionesCustom.startCustomRoute && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            accionesCustom.startCustomRoute();
                                        }}
                                        className="bg-purple-50 text-purple-600 hover:bg-purple-500 hover:text-white px-3 py-1.5 rounded-full shadow-sm border border-purple-200 flex items-center gap-1.5 transition-colors"
                                        title={hasDraftRoute ? "Continuar editando tu borrador" : "Crear tu propia ruta manualmente"}
                                    >
                                        <Wrench className="w-4 h-4" />
                                        <span className="whitespace-nowrap">{hasDraftRoute ? "Volver al borrador" : "Crear Ruta"}</span>
                                    </button>
                                )}

                                {modales.isMatriculaModalOpen !== undefined && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            modales.setIsMatriculaModalOpen(true);
                                        }}
                                        className="bg-green-50 text-green-700 hover:bg-green-600 hover:text-white px-3 py-1.5 rounded-full shadow-sm border border-green-200 flex items-center gap-1.5 transition-colors"
                                        title="Calcular la matrícula de las materias marcadas como cursando (azul)"
                                    >
                                        <Calculator className="w-4 h-4" />
                                        <span className="whitespace-nowrap hidden sm:inline">Matrícula</span>
                                    </button>
                                )}

                                {handlers.handleOpenMisRutas && (
                                    <button
                                        onClick={handlers.handleOpenMisRutas}
                                        className="bg-white text-indigo-600 hover:bg-indigo-50 px-3 py-1.5 rounded-full shadow-sm border border-indigo-200 flex items-center gap-1.5 transition-colors"
                                        title="Ver mis rutas guardadas"
                                    >
                                        <Library className="w-4 h-4" />
                                        <span className="whitespace-nowrap hidden sm:inline">Mis Rutas</span>
                                    </button>
                                )}

                                {modales.setIsFeedbackModalOpen && (
                                    <button
                                        onClick={() => modales.setIsFeedbackModalOpen(true)}
                                        className="bg-white text-gray-700 hover:bg-gray-100 px-3 py-1.5 rounded-full shadow-sm border border-gray-200 flex items-center gap-1.5 transition-colors"
                                        title="Enviar sugerencias o reportar errores"
                                    >
                                        <MessageSquareHeart className="w-4 h-4" />
                                        <span className="whitespace-nowrap hidden sm:inline">Sugerencias</span>
                                    </button>
                                )}

                                <button
                                    onClick={handleResetProgreso}
                                    className="bg-red-50 text-red-600 hover:bg-red-500 hover:text-white px-3 py-1.5 rounded-full shadow-sm border border-red-200 flex items-center gap-1.5 transition-colors"
                                    title="Borrar todo el historial"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    <span className="whitespace-nowrap">Borrar Todo</span>
                                </button>
                            </>
                        )}
                    </>
                ) : (
                    // --- Custom Route Mode Dashboard ---
                    <>
                        <div className="bg-purple-100 text-purple-800 px-3 py-1.5 rounded-full shadow-sm border border-purple-300 flex items-center gap-1.5 font-bold animate-pulse">
                            <Wrench className="w-4 h-4" />
                            <span className="whitespace-nowrap">Modo Constructor</span>
                        </div>

                        {/* Mostrar UCs si estamos en modo custom, si no, las normales */}
                        <div className={`flex flex-col items-center bg-gray-50 border border-t ${isCustomRouteMode ? 'border-dashed border-indigo-200' : ''} px-6 rounded-lg`}>
                            <span className="text-3xl font-extrabold text-blue-900 leading-none">
                                {isCustomRouteMode ? `${currentSemesterUCs} / ${totalCustomUCs}` : ucAcumuladas}
                            </span>
                            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider mt-1">
                                {isCustomRouteMode ? "UCs" : "Unidades de Crédito"}
                            </span>
                        </div>

                        <div className="bg-white px-3 py-1.5 rounded-full shadow-sm border border-gray-200 flex items-center gap-1.5">
                            <Wrench className="w-4 h-4 text-blue-500" />
                            <span className="whitespace-nowrap hidden md:inline">Materias selec.:</span>
                            <span className="text-blue-600 font-bold">{customCurrentSemesterCount}</span>
                        </div>

                        {isExpanded && (
                            <>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        accionesCustom.advanceCustomSemester();
                                    }}
                                    disabled={customCurrentSemesterCount === 0}
                                    className={`px-3 py-1.5 rounded-full shadow-sm border flex items-center gap-1.5 transition-colors ${customCurrentSemesterCount > 0
                                        ? "bg-blue-50 text-blue-600 hover:bg-blue-500 hover:text-white border-blue-200"
                                        : "bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed"
                                        }`}
                                    title={customCurrentSemesterCount > 0 ? "Avanzar al siguiente semestre" : "Selecciona al menos una materia"}
                                >
                                    <ArrowRight className="w-4 h-4" />
                                    <span className="whitespace-nowrap">Avanzar Semestre</span>
                                </button>

                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        const name = window.prompt("¿Qué nombre le pondrás a esta ruta?");
                                        if (name) {
                                            handlers.handleFinishCustomRoute(name);
                                        }
                                    }}
                                    disabled={customSemestersCount === 0 || (customSemestersCount === 1 && customCurrentSemesterCount === 0)}
                                    className="bg-indigo-50 text-indigo-700 hover:bg-indigo-600 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed px-3 py-1.5 rounded-full shadow-sm border border-indigo-200 flex items-center gap-1.5 transition-colors"
                                    title="Terminar y guardar ruta"
                                >
                                    <Flag className="w-4 h-4" />
                                    <span className="whitespace-nowrap">Guardar y Terminar</span>
                                </button>

                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        accionesCustom.cancelCustomRoute();
                                    }}
                                    className="bg-red-50 text-red-600 hover:bg-red-500 hover:text-white px-3 py-1.5 rounded-full shadow-sm border border-red-200 flex items-center gap-1.5 transition-colors"
                                    title="Cancelar y salir del modo constructor"
                                >
                                    <X className="w-4 h-4" />
                                    <span className="whitespace-nowrap">Cerrar</span>
                                </button>

                                {modales.isMatriculaModalOpen !== undefined && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            modales.setIsMatriculaModalOpen(true);
                                        }}
                                        className="bg-green-50 text-green-700 hover:bg-green-600 hover:text-white px-3 py-1.5 rounded-full shadow-sm border border-green-200 flex items-center gap-1.5 transition-colors"
                                        title="Calcular la matrícula de las materias que llevas en este semestre"
                                    >
                                        <Calculator className="w-4 h-4" />
                                        <span className="whitespace-nowrap hidden sm:inline">Matrícula</span>
                                    </button>
                                )}

                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        accionesCustom.deleteDraftRoute();
                                    }}
                                    className="bg-red-100 text-red-700 hover:bg-red-600 hover:text-white px-3 py-1.5 rounded-full shadow-sm border border-red-300 flex items-center gap-1.5 transition-colors"
                                    title="Descartar borrador"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    <span className="whitespace-nowrap">Descartar</span>
                                </button>
                            </>
                        )}
                    </>
                )}
            </div>
        </header>
    );
};
