import { useContext } from 'react';
import { NotificationContext } from '../../contexts/NotificationContext';

export const useNotification = () => {
    const context = useContext(NotificationContext);

    if (context === undefined) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }

    const confirm = (message: string, options?: { title?: string, confirmText?: string, cancelText?: string, isDestructive?: boolean }) => {
        return context.showNotification({
            type: 'confirm',
            title: options?.title || 'Confirmación',
            message,
            confirmText: options?.confirmText || 'Aceptar',
            cancelText: options?.cancelText || 'Cancelar',
            isDestructive: options?.isDestructive || false
        });
    };

    const alert = (message: string, options?: { title?: string, confirmText?: string }) => {
        return context.showNotification({
            type: 'alert',
            title: options?.title || 'Atención',
            message,
            confirmText: options?.confirmText || 'Entendido',
        });
    };

    return { confirm, alert };
};
