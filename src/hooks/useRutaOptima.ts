import { useState, useEffect } from 'react';

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
            const maxUc = maxUcInput ? parseInt(maxUcInput, 10) : undefined;
            const maxMat = maxMateriasInput ? parseInt(maxMateriasInput, 10) : undefined;
            const maxHoras = maxHorasInput ? parseInt(maxHorasInput, 10) : undefined;

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
        maxUcInput,
        setMaxUcInput,
        maxMateriasInput,
        setMaxMateriasInput,
        maxHorasInput,
        setMaxHorasInput,
        ruta
    };
};
