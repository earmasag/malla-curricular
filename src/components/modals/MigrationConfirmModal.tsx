import React from 'react';
import { ArrowRightLeft, CheckCircle2 } from 'lucide-react';
import { ModalHeader } from './shared/ModalHeader';

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
                className="bg-white rounded-3xl w-full max-w-md shadow-2xl relative animate-in fade-in zoom-in-95 duration-200 overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                <ModalHeader 
                    title="Migración de Progreso"
                    icon={<ArrowRightLeft />}
                    onClose={onClose}
                />

                {/* Content */}
                <div className="flex flex-col gap-4 text-gray-600 p-6 md:p-8 pb-4">
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
                <div className="flex gap-3 justify-end px-6 md:px-8 pb-6 md:pb-8 pt-4 bg-gray-50/50 border-t border-gray-100">
                    <button
                        onClick={onClose}
                        className="px-5 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
                    >
                        No, empezar de cero
                    </button>
                    <button
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        className="px-5 py-2.5 text-sm font-semibold text-white bg-theme-500 hover:bg-theme-600 shadow-md shadow-theme-500/20 rounded-xl transition-all cursor-pointer"
                    >
                        Sí, migrar progreso
                    </button>
                </div>
            </div>
        </div>
    );
};
