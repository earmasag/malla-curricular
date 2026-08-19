import React, { useState, useRef, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { createPortal } from 'react-dom';

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
    tooltipText?: string;
    disableTooltip?: boolean;
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
    smallCollapsedText = false,
    tooltipText,
    disableTooltip = false
}) => {
    const [isHovered, setIsHovered] = useState(false);
    const [rect, setRect] = useState<DOMRect | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const handleMouseEnter = () => {
        if (window.matchMedia('(hover: hover)').matches && !disableTooltip) {
            if (!isExpanded && containerRef.current) {
                const currentRect = containerRef.current.getBoundingClientRect();
                hoverTimer.current = setTimeout(() => {
                    setRect(currentRect);
                    setIsHovered(true);
                }, 300); // 300ms delay para evitar parpadeos accidentales
            }
        }
    };

    const handleMouseLeave = () => {
        if (hoverTimer.current) {
            clearTimeout(hoverTimer.current);
            hoverTimer.current = null;
        }
        setIsHovered(false);
    };

    useEffect(() => {
        const handleScroll = () => {
            if (isHovered && containerRef.current) {
                setRect(containerRef.current.getBoundingClientRect());
            }
        };

        if (isHovered) {
            window.addEventListener('scroll', handleScroll, true);
            window.addEventListener('resize', handleScroll, true);
        }
        return () => {
            window.removeEventListener('scroll', handleScroll, true);
            window.removeEventListener('resize', handleScroll, true);
        };
    }, [isHovered]);

    return (
        <>
            <div 
                ref={containerRef}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
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

            {/* Premium Tooltip Portal */}
            {!isExpanded && !disableTooltip && isHovered && rect && createPortal(
                <div
                    className="fixed z-99999 pointer-events-none animate-fade-in-up"
                    style={{
                        top: rect.top + (rect.height / 2),
                        left: rect.right + 12,
                        transform: 'translateY(-50%)'
                    }}
                >
                    <div className="relative">
                        {/* Tooltip body */}
                        <div className="bg-white/60 backdrop-blur-2xl border border-white/60 shadow-2xl transform-gpu text-slate-800 px-3 py-1.5 rounded-xl text-sm font-bold whitespace-nowrap">
                            {tooltipText || title}
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </>
    );
};
