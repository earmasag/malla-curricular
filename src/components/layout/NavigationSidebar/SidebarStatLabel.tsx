import React from 'react';
import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';

export interface SidebarStatLabelProps {
    isExpanded: boolean;
    icon?: LucideIcon;
    customIcon?: ReactNode;
    iconColorClass?: string;
    title: string;
    value: ReactNode;
    collapsedValue?: ReactNode;
    onClick?: () => void;
    className?: string;
    smallCollapsedText?: boolean;
}

export const SidebarStatLabel: React.FC<SidebarStatLabelProps> = ({
    isExpanded,
    icon: Icon,
    customIcon,
    iconColorClass = '',
    title,
    value,
    collapsedValue,
    onClick,
    className = '',
    smallCollapsedText = false
}) => {
    return (
        <div 
            className={`flex items-center gap-3 p-3 bg-white/40 backdrop-blur-md border border-white/50 shadow-sm rounded-xl transition-all ${!isExpanded ? 'w-14 justify-center aspect-square flex-col gap-1 p-2 mx-auto' : ''} ${onClick ? 'cursor-pointer active:scale-95' : 'cursor-default'} ${className}`}
            onClick={onClick}
        >
            {customIcon ? customIcon : (Icon && (
                <Icon className={`${iconColorClass} shrink-0 ${isExpanded ? 'w-5 h-5' : 'w-4 h-4'}`} />
            ))}
            {isExpanded ? (
                <div className="flex-1 flex justify-between items-center">
                    <span className="text-sm font-semibold text-slate-700">{title}</span>
                    <span className="text-slate-800 font-black">{value}</span>
                </div>
            ) : (
                <span className={`font-black text-slate-800 leading-none ${smallCollapsedText ? 'text-[10px] sm:text-xs' : 'text-xs'}`}>
                    {collapsedValue !== undefined ? collapsedValue : value}
                </span>
            )}
        </div>
    );
};
