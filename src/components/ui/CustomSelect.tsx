import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

export interface CustomSelectProps {
    value: string;
    onChange: (val: string) => void;
    options: { value: string; label: string }[];
}

export const CustomSelect: React.FC<CustomSelectProps> = ({ value, onChange, options }) => {
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [wrapperRef]);

    const selectedLabel = options.find(o => o.value === value)?.label || '';

    return (
        <div ref={wrapperRef} className="relative w-full text-sm">
            <button
                type="button"
                className="flex items-center justify-between w-full p-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-50 focus:border-green-400 hover:border-green-300 shadow-sm transition-all text-left"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="truncate pr-4">{selectedLabel}</span>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180 text-green-500' : ''}`} />
            </button>

            <div
                className={`absolute z-50 w-full mt-1.5 bg-white border border-gray-100 rounded-xl shadow-lg shadow-black/5 overflow-hidden transition-all duration-200 origin-top
                ${isOpen ? 'opacity-100 scale-y-100 translate-y-0 visible pointer-events-auto' : 'opacity-0 scale-y-95 -translate-y-2 invisible pointer-events-none'}`}
            >
                <ul className="py-1 max-h-60 overflow-auto overscroll-contain">
                    {options.map((option) => (
                        <li key={option.value}>
                            <button
                                type="button"
                                className={`w-full text-left px-4 py-2.5 hover:bg-green-50 hover:text-green-700 transition-colors
                                ${option.value === value ? 'bg-green-100/50 text-green-800 font-semibold' : 'text-gray-700'}`}
                                onClick={() => {
                                    onChange(option.value);
                                    setIsOpen(false);
                                }}
                            >
                                {option.label}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};
