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
            className="fixed bottom-4 left-4 z-50 flex items-center gap-4 px-4 py-2 bg-white/70 backdrop-blur-md border border-white/20 shadow-md rounded-full cursor-pointer transition-all duration-300"
            title="Click to expand/collapse"
        >
            <h1 className="text-base font-bold text-gray-800 drop-shadow-sm ml-2 whitespace-nowrap transition-opacity">
                Mi Malla Curricular
            </h1>

            <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <div className="bg-white/50 px-3 py-1.5 rounded-full shadow-sm border border-gray-200/50 flex items-center gap-1.5 transition-transform hover:scale-105">
                    <span>📚</span>
                    {isExpanded && (
                        <span className="whitespace-nowrap">Aprobadas:</span>
                    )}
                    <span className="text-blue-600 font-bold">{cantidadAprobadas}</span>
                </div>

                <div className="bg-white/50 px-3 py-1.5 rounded-full shadow-sm border border-gray-200/50 flex items-center gap-1.5 transition-transform hover:scale-105">
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
                            className="bg-blue-50/90 text-blue-600 hover:bg-blue-500 hover:text-white px-3 py-1.5 rounded-full shadow-sm border border-blue-200 transition-all hover:scale-105 flex items-center gap-1.5"
                            title="Calcular la ruta más rápida para graduarte"
                        >
                            <span>🚀</span>
                            <span className="whitespace-nowrap">Ruta Óptima</span>
                        </button>

                        <button
                            onClick={handleResetProgreso}
                            className="bg-red-50/90 text-red-600 hover:bg-red-500 hover:text-white px-3 py-1.5 rounded-full shadow-sm border border-red-200 transition-all hover:scale-105 flex items-center gap-1.5"
                            title="Borrar todo el historial"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={2}
                                stroke="currentColor"
                                className="w-4 h-4"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                                />
                            </svg>
                            <span className="whitespace-nowrap">Borrar</span>
                        </button>
                    </>
                )}
            </div>
        </header>
    );
};
