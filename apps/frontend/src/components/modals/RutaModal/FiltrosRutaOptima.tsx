import React from 'react';
import { NumberInput } from './NumberInput';
import { Settings2, ChevronDown } from 'lucide-react';

// Constantes fácilmente modificables en el futuro para los límites recomendados/máximos
import { DEFAULT_MAX_UC, DEFAULT_MAX_MATERIAS, DEFAULT_MAX_HORAS } from '../../../hooks/malla/useRutaOptima';

interface FiltrosRutaOptimaProps {
    isOpen: boolean;
    setIsOpen: (val: boolean) => void;
}

export const FiltrosRutaOptimaButton: React.FC<FiltrosRutaOptimaProps> = ({
    isOpen, setIsOpen
}) => {
    return (
        <button
            onClick={() => setIsOpen(!isOpen)}
            className={`flex cursor-pointer items-center gap-2 px-3 py-1.5 text-sm font-semibold rounded-full transition-all border focus:outline-none focus:ring-2 focus:ring-blue-500/50 shadow-sm z-10 ${isOpen
                ? 'bg-blue-50 text-blue-700 border-blue-200 shadow-inner'
                : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                }`}
            title="Filtros y configuración"
        >
            <Settings2 className="w-4 h-4" />
            <span>Filtros</span>
            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </button>
    );
};

interface FiltrosRutaOptimaPanelProps {
    isOpen: boolean;
    maxUcInput: string;
    setMaxUcInput: (val: string) => void;
    maxMateriasInput: string;
    setMaxMateriasInput: (val: string) => void;
    maxHorasInput: string;
    setMaxHorasInput: (val: string) => void;
}

export const FiltrosRutaOptimaPanel: React.FC<FiltrosRutaOptimaPanelProps> = ({
    isOpen,
    maxUcInput, setMaxUcInput,
    maxMateriasInput, setMaxMateriasInput,
    maxHorasInput, setMaxHorasInput
}) => {
    if (!isOpen) return null;

    return (
        <div className="w-full bg-blue-50/50 border-b border-gray-200 px-6 py-4 shadow-inner flex flex-col sm:flex-row gap-6 sm:items-center animate-slide-down">
            <span className="text-sm font-semibold text-gray-600 hidden sm:inline-block">Límites:</span>
            <div className="flex flex-row flex-wrap gap-6 items-center w-full">
                <NumberInput
                    id="max-uc"
                    label="Créditos (UC):"
                    placeholder={DEFAULT_MAX_UC.toString()}
                    value={maxUcInput}
                    onChange={setMaxUcInput}
                    min={1}
                    max={40}
                />

                <NumberInput
                    id="max-mat"
                    label="Materias:"
                    placeholder={DEFAULT_MAX_MATERIAS.toString()}
                    value={maxMateriasInput}
                    onChange={setMaxMateriasInput}
                    min={1}
                />

                <NumberInput
                    id="max-horas"
                    label="Horas:"
                    placeholder={DEFAULT_MAX_HORAS.toString()}
                    value={maxHorasInput}
                    onChange={setMaxHorasInput}
                    min={1}
                />
            </div>
        </div>
    );
};
