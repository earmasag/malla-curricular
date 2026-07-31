import React, { useEffect } from 'react';
import { Info, AlertCircle, AlertTriangle, CheckCircle, X } from 'lucide-react';
import type { ToastMessage } from '../../contexts/ToastContext';
import { useToast } from '../../hooks/ui/useToast';

interface ToastItemProps {
    toast: ToastMessage;
    onClose: (id: string) => void;
}

const ICONS = {
    info: <Info className="w-5 h-5 text-theme-500" />,
    success: <CheckCircle className="w-5 h-5 text-green-500" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-500" />,
    error: <AlertCircle className="w-5 h-5 text-red-500" />
};

const BORDERS = {
    info: 'border-l-theme-500',
    success: 'border-l-green-500',
    warning: 'border-l-amber-500',
    error: 'border-l-red-500'
};

export const ToastItem: React.FC<ToastItemProps> = ({ toast, onClose }) => {
    useEffect(() => {
        // Auto remove after 5 seconds
        const timer = setTimeout(() => {
            onClose(toast.id);
        }, 5000);

        return () => clearTimeout(timer);
    }, [toast.id, onClose]);

    return (
        <div className={`
            flex items-start gap-2 md:gap-3 p-3 md:p-4 bg-white/95 backdrop-blur-md shadow-lg border-y border-r border-l-4 rounded-lg 
            w-auto max-w-[calc(100vw-2rem)] md:max-w-xs pointer-events-auto transition-all animate-in slide-in-from-bottom-5 fade-in duration-300 transform-gpu
            ${BORDERS[toast.type]} border-y-gray-200 border-r-gray-200
        `}>
            <div className="shrink-0 mt-0.5">
                {ICONS[toast.type]}
            </div>

            <div className="flex-1 min-w-0">
                <p className="text-xs md:text-sm font-semibold text-gray-800 wrap-break-word leading-tight">
                    {toast.title}
                </p>
                {toast.description && (
                    <p className="mt-1 text-[10px] md:text-xs font-medium text-gray-500 wrap-break-word leading-snug">
                        {toast.description}
                    </p>
                )}
            </div>

            <button
                onClick={() => onClose(toast.id)}
                className="shrink-0 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100 p-1 transition-colors"
                title="Cerrar notificación"
            >
                <X className="w-4 h-4" />
            </button>
        </div>
    );
};

export const ToastContainer: React.FC = () => {
    const { toasts, removeToast } = useToast();

    return (
        <div className="fixed bottom-4 left-4 right-4 xs:left-auto xs:right-4 max-w-[calc(100vw-2rem)] md:max-w-xs z-9999 flex flex-col items-end gap-2 pointer-events-none max-h-screen overflow-hidden">
            {toasts.map(toast => (
                <ToastItem
                    key={toast.id}
                    toast={toast}
                    onClose={removeToast}
                />
            ))}
        </div>
    );
};
