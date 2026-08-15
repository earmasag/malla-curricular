import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';

interface RouteNameModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (name: string) => void;
    defaultName?: string;
}

export const RouteNameModal: React.FC<RouteNameModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    defaultName = ''
}) => {
    const [name, setName] = useState(defaultName);

    useEffect(() => {
        if (isOpen) {
            setName(defaultName || `Mi Ruta ${new Date().toLocaleDateString()}`);
        }
    }, [isOpen, defaultName]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim()) {
            onConfirm(name.trim());
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-scale-up border border-gray-200">
                <div className="flex justify-between items-center p-4 border-b border-gray-100 bg-gray-50/50">
                    <h3 className="font-bold text-gray-800 flex items-center gap-2">
                        <Save className="w-5 h-5 text-theme-500" />
                        Guardar Ruta
                    </h3>
                    <button 
                        onClick={onClose}
                        className="p-1.5 rounded-full hover:bg-gray-200 text-gray-500 transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-5">
                    <p className="text-sm text-gray-600 mb-3">
                        Asigna un nombre para identificar tu ruta personalizada en la biblioteca.
                    </p>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Ej: Ruta Óptima 2024, Plan B..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-theme-500 focus:border-theme-500 outline-none transition-all mb-5 text-sm"
                        autoFocus
                    />
                    
                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={!name.trim()}
                            className="px-4 py-2 text-sm font-medium text-white bg-theme-500 rounded-xl hover:bg-theme-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            Guardar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
