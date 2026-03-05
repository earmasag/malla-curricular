import React, { useState } from 'react';
import { NumberInput } from './NumberInput';
import { Settings2 } from 'lucide-react';

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
                <Settings2 className="w-5 h-5" />
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
