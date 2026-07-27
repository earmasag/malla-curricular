import { useMemo } from 'react';
import type { MateriaNode, ProgresoMalla } from '../../types/materia';

interface UseSemestreColumnProps {
    numeroSemestre: number;
    materiasDelSemestre: MateriaNode[];
    progreso: ProgresoMalla;
    isCustomRouteMode: boolean;
    acumUC: number;
}

export const useSemestreColumn = ({
    numeroSemestre,
    materiasDelSemestre,
    progreso,
    isCustomRouteMode,
    acumUC
}: UseSemestreColumnProps) => {
    return useMemo(() => {
        // Verificamos si TODAS las materias del semestre están aprobadas visualmente.
        const todasAprobadas = materiasDelSemestre.length > 0 && 
            materiasDelSemestre.every(m => progreso[m.codigoMateria] === 'aprobada');

        // Cálculos de horas para el header
        const totalHT = materiasDelSemestre.reduce((acc, m) => acc + (m.horasTeoricas || 0), 0);
        const totalHP = materiasDelSemestre.reduce((acc, m) => acc + (m.horasPracticas || 0), 0);
        const totalHL = materiasDelSemestre.reduce((acc, m) => acc + (m.horasLaboratorio || 0), 0);
        const totalHAut = materiasDelSemestre.reduce((acc, m) => acc + (m.horasAutonomas || 0), 0);

        const totalUC = materiasDelSemestre.reduce((acc, m) => acc + (m.unidadesCredito || 0), 0);

        return {
            todasAprobadas,
            stats: {
                totalHT,
                totalHP,
                totalHL,
                totalHAut,
                totalUC,
                acumUC
            }
        };
    }, [numeroSemestre, materiasDelSemestre, progreso, isCustomRouteMode]);
};
