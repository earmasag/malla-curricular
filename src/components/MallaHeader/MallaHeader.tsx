import React from 'react';

export interface MallaHeaderProps {
    cantidadAprobadas: number;
    ucAcumuladas: number;
    onResetProgreso: () => void;
    onShowRutaOptima: () => void;
}

export const MallaHeader: React.FC<MallaHeaderProps> = ({
    cantidadAprobadas,
    ucAcumuladas,
    onResetProgreso,
    onShowRutaOptima
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
                            className="bg-blue-50 text-blue-600 hover:bg-blue-500 hover:text-white px-3 py-1.5 rounded-full shadow-sm border border-blue-200 flex items-center gap-1.5"
                            title="Calcular la ruta más rápida para graduarte"
                        >
                            <span>🚀</span>
                            <span className="whitespace-nowrap">Ruta Óptima</span>
                        </button>

                        <button
                            onClick={handleResetProgreso}
                            className="bg-red-50 text-red-600 hover:bg-red-500 hover:text-white px-3 py-1.5 rounded-full shadow-sm border border-red-200 flex items-center gap-1.5"
                            title="Borrar todo el historial"
                        >
                            <span className="whitespace-nowrap">🗑️ Borrar</span>
                        </button>
                    </>
                )}
            </div>
        </header>
    );
};
