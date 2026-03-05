import React from 'react';
import { MessageSquareWarning, X } from 'lucide-react';

interface FeedbackModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-linear-to-r from-blue-50 to-white">
                    <div className="flex items-center gap-3">
                        <MessageSquareWarning className="w-6 h-6 text-yellow-500" />
                        <h2 className="text-xl font-bold text-gray-800">
                            Sugerencias y Reportes
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors shrink-0"
                        title="Cerrar modal"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 bg-gray-50 flex flex-col gap-4 text-center">
                    <p className="text-gray-600 mb-2 text-sm">
                        ¡Hola! Si encontraste algún error o tienes una idea genial para mejorar la Malla Curricular, me encantaría escucharla.
                    </p>

                    <a
                        href="https://github.com/earmasag/malla-curricular/issues/new"
                        target="_blank"
                        rel="noreferrer"
                        className="w-full bg-gray-900 text-white hover:bg-gray-800 font-medium py-3 px-4 rounded-xl flex items-center justify-center gap-3 transition-colors shadow-sm"
                    >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
                        <span>Crear Issue en GitHub</span>
                    </a>

                    <div className="relative flex items-center py-2">
                        <div className="grow border-t border-gray-300"></div>
                        <span className="shrink-0 mx-4 text-gray-400 text-xs font-semibold uppercase">O también</span>
                        <div className="grow border-t border-gray-300"></div>
                    </div>

                    <a
                        href="https://forms.gle/wyb4PjqYG9xQgviT8"
                        target="_blank"
                        rel="noreferrer"
                        className="w-full bg-blue-100 text-blue-700 hover:bg-blue-200 font-medium py-3 px-4 rounded-xl flex items-center justify-center gap-3 transition-colors shadow-sm"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                        <span>Llenar Formulario de Sugerencias</span>
                    </a>
                </div>
            </div>
        </div>
    );
};
