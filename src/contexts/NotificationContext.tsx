import React, { createContext, useState, useCallback } from 'react';

export type NotificationType = 'alert' | 'confirm';

export interface NotificationState {
    isOpen: boolean;
    title: string;
    message: string;
    type: NotificationType;
    confirmText?: string;
    cancelText?: string;
    isDestructive?: boolean;
}

interface NotificationContextProps {
    notification: NotificationState;
    showNotification: (options: Omit<NotificationState, 'isOpen'>) => Promise<boolean>;
    handleConfirm: () => void;
    handleCancel: () => void;
}

export const NotificationContext = createContext<NotificationContextProps | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [notification, setNotification] = useState<NotificationState>({
        isOpen: false,
        title: '',
        message: '',
        type: 'alert',
    });

    // Guardaremos la función resolve de la promesa actual
    const [promiseResolver, setPromiseResolver] = useState<{ resolve: (value: boolean) => void } | null>(null);

    const showNotification = useCallback((options: Omit<NotificationState, 'isOpen'>) => {
        return new Promise<boolean>((resolve) => {
            setNotification({
                ...options,
                isOpen: true,
            });
            setPromiseResolver({ resolve });
        });
    }, []);

    const handleConfirm = useCallback(() => {
        setNotification((prev) => ({ ...prev, isOpen: false }));
        if (promiseResolver) {
            promiseResolver.resolve(true);
            setPromiseResolver(null);
        }
    }, [promiseResolver]);

    const handleCancel = useCallback(() => {
        setNotification((prev) => ({ ...prev, isOpen: false }));
        if (promiseResolver) {
            promiseResolver.resolve(false);
            setPromiseResolver(null);
        }
    }, [promiseResolver]);

    return (
        <NotificationContext.Provider value={{ notification, showNotification, handleConfirm, handleCancel }}>
            {children}
        </NotificationContext.Provider>
    );
};
