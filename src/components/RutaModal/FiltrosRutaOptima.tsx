import React, { useState } from 'react';
import { NumberInput } from './NumberInput';

// Constantes fácilmente modificables en el futuro para los límites recomendados/máximos
export const DEFAULT_MAX_UC = 40;
export const DEFAULT_MAX_MATERIAS = 10;
export const DEFAULT_MAX_HORAS = 40;

interface FiltrosRutaOptimaProps {
    maxUcInput: string;
    setMaxUcInput: (val: string) => void;
    maxMateriasInput: string;
    setMaxMateriasInput: (val: string) => void;
    maxHorasInput: string;
    setMaxHorasInput: (val: string) => void;
}

export const FiltrosRutaOptima: React.FC<FiltrosRutaOptimaProps> = ({
    maxUcInput, setMaxUcInput,
    maxMateriasInput, setMaxMateriasInput,
    maxHorasInput, setMaxHorasInput
}) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`p-2 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${isOpen
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-400 hover:text-gray-700 hover:bg-gray-200'
                    }`}
                title="Configurar límites de generación"
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                    <path fillRule="evenodd" d="M3.792 2.938A49.069 49.069 0 0 1 12 2.25c2.797 0 5.54.236 8.209.688a1.857 1.857 0 0 1 1.541 1.836v1.044a3 3 0 0 1-.879 2.121l-6.182 6.182a1.5 1.5 0 0 0-.439 1.061v2.927a3 3 0 0 1-1.658 2.684l-1.757.878A.75.75 0 0 1 9.75 21v-5.818a1.5 1.5 0 0 0-.44-1.06L3.13 7.938a3 3 0 0 1-.879-2.121V4.774c0-.897.64-1.683 1.542-1.836Z" clipRule="evenodd" />
                </svg>
            </button>

            {/* Dropdown flotante */}
            {isOpen && (
                <div className="absolute top-12 right-0 md:right-auto z-20 w-72 bg-white border border-gray-200 rounded-xl shadow-xl p-4 animate-fade-in flex flex-col gap-4">
                    <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                        <h3 className="font-semibold text-gray-800">Límites por Semestre</h3>
                    </div>

                    <div className="flex flex-col gap-4">
                        <NumberInput
                            id="max-uc"
                            label="Máx. Créditos (UC):"
                            placeholder={DEFAULT_MAX_UC.toString()}
                            value={maxUcInput}
                            onChange={setMaxUcInput}
                            min={1}
                        />

                        <NumberInput
                            id="max-mat"
                            label="Máx. Materias:"
                            placeholder={DEFAULT_MAX_MATERIAS.toString()}
                            value={maxMateriasInput}
                            onChange={setMaxMateriasInput}
                            min={1}
                        />

                        <NumberInput
                            id="max-horas"
                            label="Máx. Horas:"
                            placeholder={DEFAULT_MAX_HORAS.toString()}
                            value={maxHorasInput}
                            onChange={setMaxHorasInput}
                            min={1}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};
