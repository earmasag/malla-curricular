import React from 'react';
import type { SavedRoute } from '../../types/materia';

interface MisRutasModalProps {
    isOpen: boolean;
    onClose: () => void;
    savedRoutes: SavedRoute[];
    onViewRoute: (route: string[][]) => void;
    onDeleteRoute: (routeId: string) => void;
}

export const MisRutasModal: React.FC<MisRutasModalProps> = ({
    isOpen,
    onClose,
    savedRoutes,
    onViewRoute,
    onDeleteRoute
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-linear-to-r from-indigo-50 to-white">
                    <div className="flex items-center gap-3">
                        <span className="text-2xl" role="img" aria-label="rutas">📚</span>
                        <h2 className="text-xl font-bold text-gray-800">
                            Mis Rutas Guardadas
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors shrink-0"
                        title="Cerrar modal"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto flex-1 bg-gray-50">
                    {savedRoutes.length === 0 ? (
                        <div className="text-center py-12 px-4">
                            <div className="text-4xl mb-4">📭</div>
                            <h3 className="text-lg font-medium text-gray-900 mb-1">Aún no tienes rutas guardadas</h3>
                            <p className="text-gray-500">Usa el "Modo Constructor" para empezar a planificar tu futuro y crear rutas personalizadas.</p>
                        </div>
                    ) : (
                        <div className="grid gap-4 sm:grid-cols-2">
                            {savedRoutes.map((route) => (
                                <div key={route.id} className="bg-white border text-left border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow relative group">
                                    <div className="flex justify-between items-start mb-3">
                                        <h3 className="font-bold text-lg text-gray-800 line-clamp-2 pr-8">{route.nombre}</h3>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if (window.confirm(`¿Seguro que deseas eliminar la ruta "${route.nombre}"?`)) {
                                                    onDeleteRoute(route.id);
                                                }
                                            }}
                                            className="absolute top-4 right-4 text-red-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                                            title="Eliminar ruta"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                    <div className="text-sm text-gray-500 space-y-1 mb-4">
                                        <p className="flex items-center gap-2">
                                            <span className="text-gray-400">📅</span> {route.semesters.length} semestres
                                        </p>
                                        <p className="flex items-center gap-2">
                                            <span className="text-gray-400">⏱️</span> Modificado: {new Date(route.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>

                                    <button
                                        onClick={() => onViewRoute(route.semesters)}
                                        className="w-full bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
                                    >
                                        <span>👁️</span> Ver Ruta
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
