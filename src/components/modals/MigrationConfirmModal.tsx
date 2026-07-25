import React from 'react';
import { X, ArrowRightLeft, CheckCircle2 } from 'lucide-react';

export interface MigrationConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export const MigrationConfirmModal: React.FC<MigrationConfirmModalProps> = ({ 
    isOpen, 
    onClose, 
    onConfirm
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-110 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm transition-opacity">
            <div
                className="bg-white rounded-3xl p-6 md:p-8 w-full max-w-md shadow-2xl relative animate-in fade-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-(--color-theme-) text-(--color-theme-) rounded-xl">
                            <ArrowRightLeft className="w-6 h-6" />
                        </div>
                        <h2 className="text-xl md:text-2xl font-black text-gray-800">
                            Migración de Progreso
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex flex-col gap-4 text-gray-600 mb-8">
                    <p>
                        Parece que tienes progreso guardado en el plan de estudio anterior.
                    </p>
                    <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl text-amber-800 text-sm">
                        ¿Deseas convalidar tus materias aprobadas al nuevo plan de forma automática basándose en las normas transitorias vigentes?
                    </div>
                    <ul className="text-sm space-y-2 mt-2">
                        <li className="flex gap-2"><CheckCircle2 className="w-5 h-5 text-green-500" /> Conservarás las Unidades de Crédito de materias derogadas.</li>
                        <li className="flex gap-2"><CheckCircle2 className="w-5 h-5 text-green-500" /> Se aplicarán las equivalencias automáticamente.</li>
                    </ul>
                </div>

                {/* Actions */}
                <div className="flex gap-3 justify-end mt-4">
                    <button
                        onClick={onClose}
                        className="px-5 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                    >
                        No, empezar de cero
                    </button>
                    <button
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        className="px-5 py-2.5 text-sm font-semibold text-white bg-(--color-theme-) hover:bg-(--color-theme-) shadow-md shadow-(--color-theme-)/20 rounded-xl transition-all"
                    >
                        Sí, migrar progreso
                    </button>
                </div>
            </div>
        </div>
    );
};
