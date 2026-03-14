import React from 'react';
import { X, MousePointer2, Moon, Sun } from 'lucide-react';

export interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    configuraciones: {
        zoomConRueda: boolean;
        setZoomConRueda: (val: boolean) => void;
        modoOscuro: boolean;
        setModoOscuro: (val: boolean) => void;
    };
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, configuraciones }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm transition-opacity">
            <div
                className="bg-white rounded-3xl p-6 md:p-8 w-full max-w-sm shadow-2xl relative animate-in fade-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-xl md:text-2xl font-black text-gray-800">
                            Configuración
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">Ajusta tu experiencia en la malla</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex flex-col gap-6">

                    {/* Setting 1: Scroll to Zoom */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                                <MousePointer2 className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="font-semibold text-gray-700">Zoom con scroll</p>
                                <p className="text-xs text-gray-500 max-w-[150px]">Acerca o aleja la malla usando la rueda del ratón.</p>
                            </div>
                        </div>

                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" checked={configuraciones.zoomConRueda} onChange={(e) => configuraciones.setZoomConRueda(e.target.checked)} />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                    </div>

                    {/* Setting 2: Dark Mode */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-xl ${configuraciones.modoOscuro ? 'bg-indigo-50 text-indigo-600' : 'bg-amber-50 text-amber-500'}`}>
                                {configuraciones.modoOscuro ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                            </div>
                            <div>
                                <p className="font-semibold text-gray-700">Modo Oscuro</p>
                                <p className="text-xs text-gray-500 max-w-[150px]">Protégete de la luz azul en la noche.</p>
                            </div>
                        </div>

                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" checked={configuraciones.modoOscuro} onChange={(e) => configuraciones.setModoOscuro(e.target.checked)} />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                        </label>
                    </div>

                </div>
            </div>
        </div>
    );
};
