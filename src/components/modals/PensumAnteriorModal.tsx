import React from 'react';
import { BookCheck } from 'lucide-react';
import ajustesData from '../../data/ajustes_pensum_viejo.json';
import { ModalHeader } from './shared/ModalHeader';

export interface PensumAnteriorModalProps {
    isOpen: boolean;
    onClose: () => void;
    pensumAnterior: Record<string, boolean>;
    updatePensumAnterior: (key: string, value: boolean) => void;
}

export const PensumAnteriorModal: React.FC<PensumAnteriorModalProps> = ({ isOpen, onClose, pensumAnterior, updatePensumAnterior }) => {
    if (!isOpen) return null;

    const materias = ajustesData.map(item => ({
        key: item.key,
        nombre: item.nombre,
        uc: item.uc
    }));

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm transition-opacity">
            <div
                className="bg-white rounded-3xl w-full max-w-md shadow-2xl relative animate-in fade-in zoom-in-95 duration-200 overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                <ModalHeader
                    title={
                        <div className="flex flex-col">
                            <span>Pensum Anterior</span>
                            <span className="text-sm font-normal text-gray-500 mt-1 leading-tight max-w-70 sm:max-w-xs whitespace-normal">Marca las materias que aprobaste del pensum viejo. Sus UC se sumarán automáticamente.</span>
                        </div>
                    }
                    icon={<BookCheck />}
                    onClose={onClose}
                />

                {/* Content */}
                <div className="flex flex-col gap-4 p-6 md:p-8 bg-white">
                    {materias.map((materia) => (
                        <div key={materia.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:border-theme-100 transition-colors">
                            <div className="flex flex-col">
                                <span className="font-semibold text-gray-700">{materia.nombre}</span>
                                <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">{materia.uc} UC</span>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={!!pensumAnterior[materia.key]}
                                    onChange={(e) => updatePensumAnterior(materia.key, e.target.checked)}
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-theme-600"></div>
                            </label>
                        </div>
                    ))}
                </div>

                <div className="px-6 md:px-8 pb-6 md:pb-8 flex justify-end bg-white">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-theme-600 hover:bg-theme-700 text-white font-bold rounded-xl transition-colors shadow-md shadow-theme-200 cursor-pointer"
                    >
                        Listo
                    </button>
                </div>
            </div>
        </div>
    );
};
