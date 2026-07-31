import React from 'react';

export interface SidebarButtonProps {
    isExpanded: boolean;
    icon: React.ReactNode;
    label: string;
    onClick: (e: React.MouseEvent) => void;
    color?: 'theme' | 'red' | 'gray';
    variant?: 'solid' | 'light' | 'ghost';
    disabled?: boolean;
    id?: string;
    showBadge?: boolean;
}

const colorStyles = {
    theme: {
        solid: "bg-theme-600 text-white hover:bg-theme-700 active:bg-theme-800 border-theme-600",
        light: "bg-theme-50 text-theme-700 hover:bg-theme-100 border-theme-100",
        icon: "text-theme-500",
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
    }
};

export const SidebarButton: React.FC<SidebarButtonProps> = ({ isExpanded, icon, label, onClick, color = 'theme', variant = 'ghost', disabled = false, id, showBadge = false }) => {
    const baseClasses = "flex items-center rounded-xl transition-colors duration-200 relative group overflow-hidden shrink-0 border";
    const sizeClasses = isExpanded ? "p-3 px-4 w-full gap-3" : "justify-center p-3 w-14 h-14";
    const disabledClasses = disabled ? "opacity-50 cursor-not-allowed grayscale" : "cursor-pointer";
    
    let colorClass = "";
    let iconColorClass = "";

    const ghostColors = {
        theme: { color: "hover:bg-theme-100 hover:text-theme-800", icon: "group-hover:text-theme-700" },
        red: { color: "hover:bg-red-100 hover:text-red-800", icon: "group-hover:text-red-700" },
        gray: { color: "hover:bg-slate-200 hover:text-slate-900", icon: "group-hover:text-slate-800" },
    };

    if (variant === 'ghost') {
        const gc = ghostColors[color as keyof typeof ghostColors] || ghostColors.theme;
        colorClass = `bg-transparent text-slate-600 font-medium border-transparent transition-colors duration-200 ${gc.color}`;
        iconColorClass = disabled ? "text-slate-400" : `text-slate-500 transition-colors duration-200 ${gc.icon}`;
    } else {
        colorClass = disabled ? colorStyles.gray.light : colorStyles[color][variant as 'solid' | 'light'];
        iconColorClass = "";
    }

    return (
        <button
            id={id}
            onClick={(e) => {
                if (!disabled) onClick(e);
            }}
            disabled={disabled}
            className={`${baseClasses} ${sizeClasses} ${disabledClasses} ${colorClass}`}
            title={!isExpanded ? label : undefined}
        >
            <div className={`shrink-0 flex items-center justify-center [&>svg]:w-5 [&>svg]:h-5 relative ${iconColorClass}`}>
                {icon}
                {showBadge && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse border-2 border-white shadow-sm"></span>
                )}
            </div>
            {isExpanded && (
                <span className="text-[14px] whitespace-nowrap text-left truncate">
                    {label}
                </span>
            )}
        </button>
    );
};
