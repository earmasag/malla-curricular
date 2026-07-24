import React from 'react';
import { X, BookCheck } from 'lucide-react';

export interface PensumAnteriorModalProps {
    isOpen: boolean;
    onClose: () => void;
    pensumAnterior: Record<string, boolean>;
    updatePensumAnterior: (key: string, value: boolean) => void;
}

export const PensumAnteriorModal: React.FC<PensumAnteriorModalProps> = ({ isOpen, onClose, pensumAnterior, updatePensumAnterior }) => {
    if (!isOpen) return null;

    const materias = [
        { key: 'ingles1', nombre: 'Inglés I (Sin convalidar)', uc: 4 },
        { key: 'ingles2', nombre: 'Inglés II (Sin convalidar)', uc: 4 },
        { key: 'inglesCompensacion5', nombre: 'Compensación Inglés I y II (Convalidados)', uc: 5 },
        { key: 'labFisica', nombre: 'Laboratorio de Física', uc: 2 },
        { key: 'progWeb', nombre: 'Programación Orientada a la Web', uc: 3 },
        { key: 'electiva2', nombre: 'Electiva (Informática) II', uc: 4 },
    ];

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm transition-opacity">
            <div
                className="bg-white rounded-3xl p-6 md:p-8 w-full max-w-md shadow-2xl relative animate-in fade-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-xl md:text-2xl font-black text-gray-800 flex items-center gap-2">
                            <BookCheck className="w-6 h-6 text-blue-600" /> Pensum Anterior
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">Marca las materias que aprobaste del pensum viejo. Sus UC se sumarán automáticamente a tus UC Acumuladas.</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex flex-col gap-4">
                    {materias.map((materia) => (
                        <div key={materia.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:border-blue-100 transition-colors">
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
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                        </div>
                    ))}
                </div>

                <div className="mt-6 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors shadow-md shadow-blue-200 cursor-pointer"
                    >
                        Listo
                    </button>
                </div>
            </div>
        </div>
    );
};
