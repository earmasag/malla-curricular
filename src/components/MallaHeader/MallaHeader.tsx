import React from 'react';

export interface MallaHeaderProps {
    cantidadAprobadas: number;
    ucAcumuladas: number;
    onResetProgreso: () => void;
    onShowRutaOptima: () => void;
    isCustomRouteMode?: boolean;
    startCustomRoute?: () => void;
    advanceCustomSemester?: () => void;
    cancelCustomRoute?: () => void;
    finishCustomRoute?: (name: string) => void;
    deleteDraftRoute?: () => void;
    customSemestersCount?: number;
    customCurrentSemesterCount?: number;
    hasDraftRoute?: boolean;
    currentSemesterUCs?: number;
    totalCustomUCs?: number;
    onOpenMisRutas?: () => void;
    onOpenFeedback?: () => void;
}

export const MallaHeader: React.FC<MallaHeaderProps> = ({
    cantidadAprobadas,
    ucAcumuladas,
    onResetProgreso,
    onShowRutaOptima,
    isCustomRouteMode = false,
    startCustomRoute,
    advanceCustomSemester,
    cancelCustomRoute,
    finishCustomRoute,
    deleteDraftRoute,
    customSemestersCount = 0,
    customCurrentSemesterCount = 0,
    hasDraftRoute = false,
    currentSemesterUCs = 0,
    totalCustomUCs = 0,
    onOpenMisRutas,
    onOpenFeedback
}) => {
    const [isExpanded, setIsExpanded] = React.useState(false);

    const handleResetProgreso = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (window.confirm("¿Estás seguro que deseas borrar todo tu progreso? Esta acción no se puede deshacer.")) {
            onResetProgreso();
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
                            <span>📚</span>
                            {isExpanded && <span className="whitespace-nowrap">Aprobadas:</span>}
                            <span className="text-blue-600 font-bold">{cantidadAprobadas}</span>
                        </div>

                        <div className="bg-white px-3 py-1.5 rounded-full shadow-sm border border-gray-200 flex items-center gap-1.5">
                            <span>⭐</span>
                            {isExpanded && <span className="whitespace-nowrap">UC:</span>}
                            <span className="text-blue-600 font-bold">{ucAcumuladas}</span>
                        </div>

                        {isExpanded && (
                            <>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onShowRutaOptima();
                                    }}
                                    className="bg-blue-50 text-blue-600 hover:bg-blue-500 hover:text-white px-3 py-1.5 rounded-full shadow-sm border border-blue-200 flex items-center gap-1.5 transition-colors"
                                    title="Calcular la ruta más rápida para graduarte"
                                >
                                    <span>🚀</span>
                                    <span className="whitespace-nowrap">Ruta Óptima</span>
                                </button>

                                {startCustomRoute && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            startCustomRoute();
                                        }}
                                        className="bg-purple-50 text-purple-600 hover:bg-purple-500 hover:text-white px-3 py-1.5 rounded-full shadow-sm border border-purple-200 flex items-center gap-1.5 transition-colors"
                                        title={hasDraftRoute ? "Continuar editando tu borrador" : "Crear tu propia ruta manualmente"}
                                    >
                                        <span>🛠️</span>
                                        <span className="whitespace-nowrap">{hasDraftRoute ? "Volver al borrador" : "Crear Ruta"}</span>
                                    </button>
                                )}

                                {onOpenMisRutas && (
                                    <button
                                        onClick={onOpenMisRutas}
                                        className="bg-white text-indigo-600 hover:bg-indigo-50 px-3 py-1.5 rounded-full shadow-sm border border-indigo-200 flex items-center gap-1.5 transition-colors"
                                        title="Ver mis rutas guardadas"
                                    >
                                        <span>📚</span>
                                        <span className="whitespace-nowrap hidden sm:inline">Mis Rutas</span>
                                    </button>
                                )}

                                {onOpenFeedback && (
                                    <button
                                        onClick={onOpenFeedback}
                                        className="bg-white text-gray-700 hover:bg-gray-100 px-3 py-1.5 rounded-full shadow-sm border border-gray-200 flex items-center gap-1.5 transition-colors"
                                        title="Enviar sugerencias o reportar errores"
                                    >
                                        <span>💡</span>
                                        <span className="whitespace-nowrap hidden sm:inline">Sugerencias</span>
                                    </button>
                                )}

                                <button
                                    onClick={handleResetProgreso}
                                    className="bg-red-50 text-red-600 hover:bg-red-500 hover:text-white px-3 py-1.5 rounded-full shadow-sm border border-red-200 flex items-center gap-1.5 transition-colors"
                                    title="Borrar todo el historial"
                                >
                                    <span className="whitespace-nowrap">🗑️ Borrar</span>
                                </button>
                            </>
                        )}
                    </>
                ) : (
                    // --- Custom Route Mode Dashboard ---
                    <>
                        <div className="bg-purple-100 text-purple-800 px-3 py-1.5 rounded-full shadow-sm border border-purple-300 flex items-center gap-1.5 font-bold animate-pulse">
                            <span>🛠️</span>
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
                            <span>📚</span>
                            <span className="whitespace-nowrap hidden md:inline">Materias selec.:</span>
                            <span className="text-blue-600 font-bold">{customCurrentSemesterCount}</span>
                        </div>

                        {isExpanded && (
                            <>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (advanceCustomSemester) advanceCustomSemester();
                                    }}
                                    disabled={customCurrentSemesterCount === 0}
                                    className={`px-3 py-1.5 rounded-full shadow-sm border flex items-center gap-1.5 transition-colors ${customCurrentSemesterCount > 0
                                        ? "bg-blue-50 text-blue-600 hover:bg-blue-500 hover:text-white border-blue-200"
                                        : "bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed"
                                        }`}
                                    title={customCurrentSemesterCount > 0 ? "Avanzar al siguiente semestre" : "Selecciona al menos una materia"}
                                >
                                    <span>➡️</span>
                                    <span className="whitespace-nowrap">Avanzar Semestre</span>
                                </button>

                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (finishCustomRoute) {
                                            const name = window.prompt("¿Qué nombre le pondrás a esta ruta?");
                                            if (name) {
                                                finishCustomRoute(name);
                                            }
                                        }
                                    }}
                                    disabled={customSemestersCount === 0 || (customSemestersCount === 1 && customCurrentSemesterCount === 0)}
                                    className="bg-indigo-50 text-indigo-700 hover:bg-indigo-600 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed px-3 py-1.5 rounded-full shadow-sm border border-indigo-200 flex items-center gap-1.5 transition-colors"
                                    title="Terminar y guardar ruta"
                                >
                                    <span>🏁</span>
                                    <span className="whitespace-nowrap">Guardar y Terminar</span>
                                </button>

                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (cancelCustomRoute) cancelCustomRoute();
                                    }}
                                    className="bg-red-50 text-red-600 hover:bg-red-500 hover:text-white px-3 py-1.5 rounded-full shadow-sm border border-red-200 flex items-center gap-1.5 transition-colors"
                                    title="Cancelar y salir del modo constructor"
                                >
                                    <span>❌</span>
                                    <span className="whitespace-nowrap">Cerrar</span>
                                </button>

                                {deleteDraftRoute && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            deleteDraftRoute();
                                        }}
                                        className="bg-red-100 text-red-700 hover:bg-red-600 hover:text-white px-3 py-1.5 rounded-full shadow-sm border border-red-300 flex items-center gap-1.5 transition-colors"
                                        title="Descartar borrador"
                                    >
                                        <span className="whitespace-nowrap">🗑️ Descartar</span>
                                    </button>
                                )}
                            </>
                        )}
                    </>
                )}
            </div>
        </header>
    );
};
