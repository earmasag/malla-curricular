import { useState, useEffect } from 'react';

export const DEFAULT_MAX_UC = 40;
export const DEFAULT_MAX_MATERIAS = 10;
export const DEFAULT_MAX_HORAS = 40;

export const useRutaOptima = (
    isOpen: boolean,
    generarRutaOptima: (maxUcPorSemestre?: number, maxMateriasPorSemestre?: number, maxHorasPorSemestre?: number) => string[][]
) => {
    const [maxUcInput, setMaxUcInput] = useState<string>('');
    const [maxMateriasInput, setMaxMateriasInput] = useState<string>('');
    const [maxHorasInput, setMaxHorasInput] = useState<string>('');
    const [ruta, setRuta] = useState<string[][]>([]);

    useEffect(() => {
        if (isOpen) {
            const maxUc = maxUcInput !== '' ? parseInt(maxUcInput, 10) : DEFAULT_MAX_UC;
            const maxMat = maxMateriasInput !== '' ? parseInt(maxMateriasInput, 10) : DEFAULT_MAX_MATERIAS;
            const maxHoras = maxHorasInput !== '' ? parseInt(maxHorasInput, 10) : DEFAULT_MAX_HORAS;

            // Calculamos asíncronamente o en el acto
            const nuevaRuta = generarRutaOptima(
                maxUc && maxUc > 0 ? maxUc : undefined,
                maxMat && maxMat > 0 ? maxMat : undefined,
                maxHoras && maxHoras > 0 ? maxHoras : undefined
            );
            setRuta(nuevaRuta);
        }
    }, [isOpen, maxUcInput, maxMateriasInput, maxHorasInput, generarRutaOptima]);

    return {
        estado: {
            maxUcInput,
            maxMateriasInput,
            maxHorasInput,
            ruta
        },
        acciones: {
            setMaxUcInput,
            setMaxMateriasInput,
            setMaxHorasInput
        }
    };
};
