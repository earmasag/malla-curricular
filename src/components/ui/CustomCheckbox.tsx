import React from 'react';

export interface CustomCheckboxProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    label: string;
}

export const CustomCheckbox: React.FC<CustomCheckboxProps> = ({ checked, onChange, label }) => {
    return (
        <label className="flex items-center gap-3 cursor-pointer group w-full text-left">
            <div className="relative flex items-center justify-center shrink-0">
                <input
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => onChange(e.target.checked)}
                    className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded bg-white checked:bg-green-500 checked:border-green-500 focus:outline-none focus:ring-4 focus:ring-green-50 transition-all cursor-pointer"
                />
                <svg className="absolute w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
            </div>
            <span className="text-sm text-gray-600 font-medium group-hover:text-gray-900 transition-colors">{label}</span>
        </label>
    );
};
