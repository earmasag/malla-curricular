import React, { useContext } from 'react';
import { AlertTriangle, Info, CheckCircle, X } from 'lucide-react';
import { NotificationContext } from '../../contexts/NotificationContext';

export const CustomNotification: React.FC = () => {
    const context = useContext(NotificationContext);

    // Si el contexto no existe (por ejemplo no se ha envuelto la app), no renderizamos nada pero no fallamos
    if (!context) return null;

    const { notification, handleConfirm, handleCancel } = context;

    if (!notification.isOpen) return null;

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
                {/* Header Icon + Title */}
                <div className={`flex items-center gap-3 px-6 py-4 border-b border-gray-100 ${notification.type === 'confirm' && notification.isDestructive ? 'bg-red-50/50' : 'bg-gray-50/50'}`}>
                    {notification.type === 'confirm' && notification.isDestructive && (
                        <div className="bg-red-100 p-2 rounded-full text-red-600">
                            <AlertTriangle className="w-5 h-5" />
                        </div>
                    )}
                    {notification.type === 'confirm' && !notification.isDestructive && (
                        <div className="bg-blue-100 p-2 rounded-full text-blue-600">
                            <Info className="w-5 h-5" />
                        </div>
                    )}
                    {notification.type === 'alert' && (
                        <div className="bg-green-100 p-2 rounded-full text-green-600">
                            <CheckCircle className="w-5 h-5" />
                        </div>
                    )}
                    <h3 className="text-lg font-bold text-gray-800">{notification.title}</h3>

                    <button
                        onClick={handleCancel}
                        className="ml-auto text-gray-400 hover:text-gray-600 hover:bg-gray-200 p-1.5 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body Message */}
                <div className="px-6 py-6 text-gray-600">
                    <p className="text-[1.05rem] leading-relaxed">{notification.message}</p>
                </div>

                {/* Footer Buttons */}
                <div className="px-6 py-4 bg-gray-50 flex justify-end gap-3 border-t border-gray-100">
                    {notification.type === 'confirm' && (
                        <button
                            onClick={handleCancel}
                            className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-800 transition-colors focus:ring-2 focus:ring-gray-200 focus:outline-none"
                        >
                            {notification.cancelText || 'Cancelar'}
                        </button>
                    )}

                    <button
                        onClick={handleConfirm}
                        className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors focus:ring-2 focus:outline-none ${notification.isDestructive
                            ? 'bg-red-600 hover:bg-red-700 focus:ring-red-200'
                            : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-200'
                            }`}
                    >
                        {notification.confirmText || 'Aceptar'}
                    </button>
                </div>
            </div>
        </div>
    );
};
