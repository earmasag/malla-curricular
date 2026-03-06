import React from 'react';

interface NumberInputProps {
    id: string;
    label?: string;
    value: string;
    onChange: (val: string) => void;
    min?: number;
    max?: number;
    placeholder?: string;
}

export const NumberInput: React.FC<NumberInputProps> = ({
    id,
    label,
    value,
    onChange,
    min = 1,
    max,
    placeholder
}) => {
    const numericValue = parseInt(value, 10);
    const isEmpty = value === '';

    const handleIncrement = () => {
        const val = isEmpty ? (parseInt(placeholder || '0', 10) || 0) : numericValue;
        if (max !== undefined && val >= max) return;
        onChange((val + 1).toString());
    };

    const handleDecrement = () => {
        const val = isEmpty ? (parseInt(placeholder || '0', 10) || 0) : numericValue;
        if (val <= min) return;
        onChange((val - 1).toString());
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        if (val === '') {
            onChange('');
            return;
        }
        const numeric = parseInt(val, 10);
        if (!isNaN(numeric)) {
            // Validamos min pero permitimos borrar
            if (numeric >= min && (max === undefined || numeric <= max)) {
                onChange(numeric.toString());
            }
        }
    };

    const inputControl = (
        <div className="relative flex items-center w-18">
            <input
                id={id}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder={placeholder}
                value={value}
                onChange={handleChange}
                // Ocultar spinners nativos en Tailwind:
                className="w-full border border-gray-200 rounded-lg pl-3 pr-8 py-1.5 text-sm font-medium text-gray-700 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition-shadow"
            />
            {/* Controles Personalizados (Costado Derecho) */}
            <div className="absolute right-1 inset-y-1 flex flex-col justify-center gap-px">
                <button
                    type="button"
                    onClick={handleIncrement}
                    className="flex text-gray-400 hover:text-blue-600 hover:bg-blue-50 focus:outline-none p-0.5 rounded transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                        <path fillRule="evenodd" d="M14.77 12.79a.75.75 0 01-1.06-.02L10 8.832 6.29 12.77a.75.75 0 11-1.08-1.04l4.25-4.5a.75.75 0 011.08 0l4.25 4.5a.75.75 0 01-.02 1.06z" clipRule="evenodd" />
                    </svg>
                </button>
                <button
                    type="button"
                    onClick={handleDecrement}
                    className="flex text-gray-400 hover:text-blue-600 hover:bg-blue-50 focus:outline-none p-0.5 rounded transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                        <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                    </svg>
                </button>
            </div>
        </div>
    );

    if (label) {
        return (
            <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-600 cursor-pointer mr-1" htmlFor={id}>
                    {label}
                </label>
                {inputControl}
            </div>
        );
    }

    return inputControl;
};
