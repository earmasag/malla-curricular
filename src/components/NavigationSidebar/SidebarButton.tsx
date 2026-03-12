import React from 'react';

export interface SidebarButtonProps {
    isExpanded: boolean;
    icon: React.ReactNode;
    label: string;
    onClick: (e: React.MouseEvent) => void;
    color?: 'blue' | 'purple' | 'green' | 'indigo' | 'red' | 'gray';
    variant?: 'solid' | 'light' | 'ghost';
    disabled?: boolean;
}

const colorStyles = {
    blue: {
        solid: "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 border-blue-600",
        light: "bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-100",
        ghost: "bg-transparent text-blue-600 hover:bg-blue-50 border-transparent text-red-600 hover:text-red-700",
    },
    purple: {
        solid: "bg-purple-600 text-white hover:bg-purple-700 active:bg-purple-800 border-purple-600",
        light: "bg-purple-50 text-purple-700 hover:bg-purple-100 border-purple-100",
        ghost: "bg-transparent text-purple-600 hover:bg-purple-50 border-transparent hover:text-purple-700",
    },
    green: {
        solid: "bg-green-600 text-white hover:bg-green-700 active:bg-green-800 border-green-600",
        light: "bg-green-50 text-green-700 hover:bg-green-100 border-green-100",
        ghost: "bg-transparent text-green-600 hover:bg-green-50 border-transparent hover:text-green-700",
    },
    indigo: {
        solid: "bg-indigo-600 text-white hover:bg-indigo-700 active:bg-indigo-800 border-indigo-600",
        light: "bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border-indigo-100",
        ghost: "bg-transparent text-indigo-600 hover:bg-indigo-50 border-transparent hover:text-indigo-700",
    },
    red: {
        solid: "bg-red-600 text-white hover:bg-red-700 active:bg-red-800 border-red-600",
        light: "bg-red-50 text-red-700 hover:bg-red-100 border-red-100",
        ghost: "bg-transparent text-red-500 hover:bg-red-50 border-transparent hover:text-red-600",
    },
    gray: {
        solid: "bg-gray-800 text-white hover:bg-gray-900 active:bg-black border-gray-800",
        light: "bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-200",
        ghost: "bg-transparent text-gray-500 hover:bg-gray-100 border-transparent hover:text-gray-700",
    }
};

export const SidebarButton: React.FC<SidebarButtonProps> = ({ isExpanded, icon, label, onClick, color = 'gray', variant = 'light', disabled = false }) => {
    // "light" uses border and background
    const baseClasses = "flex items-center rounded-2xl transition-all duration-300 relative group overflow-hidden shrink-0 border";
    const sizeClasses = isExpanded ? "p-3 px-4 w-full gap-3" : "justify-center p-3 w-14 h-14";
    const disabledClasses = disabled ? "opacity-50 cursor-not-allowed grayscale" : "cursor-pointer";
    const colorClass = disabled ? colorStyles.gray.light : colorStyles[color][variant];

    return (
        <button
            onClick={(e) => {
                if (!disabled) onClick(e);
            }}
            disabled={disabled}
            className={`${baseClasses} ${sizeClasses} ${disabledClasses} ${colorClass}`}
            title={!isExpanded ? label : undefined}
        >
            <div className={`shrink-0 flex items-center justify-center [&>svg]:w-4.5 [&>svg]:h-4.5`}>
                {icon}
            </div>
            {isExpanded && (
                <span className="text-[13px] font-semibold whitespace-nowrap text-left truncate">
                    {label}
                </span>
            )}
        </button>
    );
};
