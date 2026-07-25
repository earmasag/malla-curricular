import React from 'react';

export interface SidebarButtonProps {
    isExpanded: boolean;
    icon: React.ReactNode;
    label: string;
    onClick: (e: React.MouseEvent) => void;
    color?: 'blue' | 'purple' | 'green' | 'indigo' | 'red' | 'gray' | 'amber' | 'theme' | 'pink';
    variant?: 'solid' | 'light' | 'ghost';
    disabled?: boolean;
}

const colorStyles = {
    blue: {
        solid: "bg-blue-700 text-white hover:bg-blue-800 shadow-md border-blue-700",
        light: "bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-100",
        icon: "text-blue-500",
    },
    purple: {
        solid: "bg-purple-600 text-white hover:bg-purple-700 active:bg-purple-800 border-purple-600",
        light: "bg-purple-50 text-purple-700 hover:bg-purple-100 border-purple-100",
        icon: "text-purple-500",
    },
    green: {
        solid: "bg-green-600 text-white hover:bg-green-700 active:bg-green-800 border-green-600",
        light: "bg-green-50 text-green-700 hover:bg-green-100 border-green-100",
        icon: "text-green-500",
    },
    indigo: {
        solid: "bg-indigo-600 text-white hover:bg-indigo-700 active:bg-indigo-800 border-indigo-600",
        light: "bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border-indigo-100",
        icon: "text-indigo-500",
    },
    red: {
        solid: "bg-red-600 text-white hover:bg-red-700 active:bg-red-800 border-red-600",
        light: "bg-red-50 text-red-700 hover:bg-red-100 border-red-100",
        icon: "text-red-500",
    },
    gray: {
        solid: "bg-slate-800 text-white hover:bg-slate-900 active:bg-black border-slate-800",
        light: "bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200",
        icon: "text-slate-500",
    },
    amber: {
        solid: "bg-amber-500 text-white hover:bg-amber-600 active:bg-amber-700 border-amber-500",
        light: "bg-amber-50 text-amber-700 hover:bg-amber-100 border-amber-100",
        icon: "text-amber-500",
    },
    theme: {
        solid: "bg-theme- text-white hover:bg-theme- active:bg-theme- border-theme-",
        light: "bg-theme- text-theme- hover:bg-theme- border-theme-",
        icon: "text-theme-",
    },
    pink: {
        solid: "bg-pink-600 text-white hover:bg-pink-700 active:bg-pink-800 border-pink-600",
        light: "bg-pink-50 text-pink-700 hover:bg-pink-100 border-pink-100",
        icon: "text-pink-500",
    }
};

export const SidebarButton: React.FC<SidebarButtonProps> = ({ isExpanded, icon, label, onClick, color = 'gray', variant = 'ghost', disabled = false }) => {
    const baseClasses = "flex items-center rounded-xl transition-colors duration-200 relative group overflow-hidden shrink-0 border";
    const sizeClasses = isExpanded ? "p-3 px-4 w-full gap-3" : "justify-center p-3 w-14 h-14";
    const disabledClasses = disabled ? "opacity-50 cursor-not-allowed grayscale" : "cursor-pointer";
    
    let colorClass = "";
    let iconColorClass = "";

    if (variant === 'ghost') {
        if (color === 'red') {
            colorClass = "bg-transparent text-slate-600 font-medium hover:bg-red-50 hover:text-red-600 border-transparent";
            iconColorClass = disabled ? "text-slate-400" : "text-slate-500 group-hover:text-red-600";
        } else {
            colorClass = "bg-transparent text-slate-600 font-medium hover:bg-slate-100 hover:text-slate-900 border-transparent";
            iconColorClass = disabled ? "text-slate-400" : "text-slate-500 group-hover:text-slate-700";
        }
    } else {
        colorClass = disabled ? colorStyles.gray.light : colorStyles[color][variant as 'solid' | 'light'];
        iconColorClass = "";
    }

    return (
        <button
            onClick={(e) => {
                if (!disabled) onClick(e);
            }}
            disabled={disabled}
            className={`${baseClasses} ${sizeClasses} ${disabledClasses} ${colorClass}`}
            title={!isExpanded ? label : undefined}
        >
            <div className={`shrink-0 flex items-center justify-center [&>svg]:w-5 [&>svg]:h-5 ${iconColorClass}`}>
                {icon}
            </div>
            {isExpanded && (
                <span className="text-[14px] whitespace-nowrap text-left truncate">
                    {label}
                </span>
            )}
        </button>
    );
};
