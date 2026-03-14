import React from 'react';
import type { SavedRoute } from '../../types/materia';
import { Library, FolderOpen, Calendar, Clock, Eye, X, Trash2 } from 'lucide-react';
import { useNotification } from '../../hooks/ui/useNotification';

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
    const { confirm } = useNotification();

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-linear-to-r from-indigo-50 to-white">
                    <div className="flex items-center gap-3">
                        <Library className="w-6 h-6 text-indigo-500" />
                        <h2 className="text-xl font-bold text-gray-800">
                            Mis Rutas Guardadas
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors shrink-0 cursor-pointer"
                        title="Cerrar modal"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto flex-1 bg-gray-50">
                    {savedRoutes.length === 0 ? (
                        <div className="text-center py-12 px-4">
                            <FolderOpen className="w-12 h-12 mx-auto text-gray-300 mb-4" />
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
                                            onClick={async (e) => {
                                                e.stopPropagation();
                                                const isConfirmed = await confirm(`¿Seguro que deseas eliminar la ruta "${route.nombre}"?`, {
                                                    isDestructive: true,
                                                    confirmText: "Eliminar"
                                                });
                                                if (isConfirmed) {
                                                    onDeleteRoute(route.id);
                                                }
                                            }}
                                            className="absolute top-4 right-4 text-red-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-full transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                                            title="Eliminar ruta"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                    <div className="text-sm text-gray-500 space-y-1 mb-4">
                                        <p className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4 text-gray-400" /> {route.semesters.length} semestres
                                        </p>
                                        <p className="flex items-center gap-2">
                                            <Clock className="w-4 h-4 text-gray-400" /> Modificado: {new Date(route.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>

                                    <button
                                        onClick={() => onViewRoute(route.semesters)}
                                        className="w-full bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer"
                                    >
                                        <Eye className="w-4 h-4" /> Ver Ruta
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
