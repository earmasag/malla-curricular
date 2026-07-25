import React from 'react';
import { X } from 'lucide-react';

interface ModalHeaderProps {
    title: React.ReactNode;
    icon?: React.ReactNode;
    onClose: () => void;
    rightContent?: React.ReactNode;
}

export const ModalHeader: React.FC<ModalHeaderProps> = ({ title, icon, onClose, rightContent }) => {
    return (
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 bg-gray-50/50 border-b border-gray-100 shrink-0">
            <div className="flex items-center gap-3">
                {icon && <div className="text-theme-500 [&>svg]:w-5 [&>svg]:h-5 sm:[&>svg]:w-6 sm:[&>svg]:h-6 flex items-center justify-center shrink-0">{icon}</div>}
                <h2 className="text-lg sm:text-xl font-bold text-gray-800 flex items-center gap-2 m-0 p-0 leading-none">
                    {title}
                </h2>
            </div>
            <div className="flex items-center gap-2 sm:gap-4 shrink-0">
                {rightContent}
                <button
                    onClick={onClose}
                    className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-200 rounded-full transition-colors shrink-0 cursor-pointer"
                    title="Cerrar"
                >
                    <X className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
            </div>
        </div>
    );
};
