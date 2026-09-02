import { useState, useMemo, useEffect } from 'react';
import { MatriculaService, type MateriaMatricula } from '../../services/MatriculaService';
import type { StudentProfile } from '../../types/matricula';

const STORAGE_KEY = 'calculadora_matricula_perfil';

const DEFAULT_PERFIL: StudentProfile = {
    sede: 'g',
    carrera: 'sinDescuento',
    esAlumnoNuevo: false,
    cooperacion: 'ninguna',
    coberturaPct: 0,
    aplicaRetraso: false,
};

const matriculaService = new MatriculaService();

export function useMatriculaModal(materiasCursando: MateriaMatricula[], isOpen: boolean) {
    const getInitialPerfil = (): StudentProfile => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try { return JSON.parse(saved); } catch { /* ignorar */ }
        }
        return DEFAULT_PERFIL;
    };

    const [perfil, setPerfil] = useState<StudentProfile>(getInitialPerfil);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(perfil));
    }, [perfil]);

    const desglose = useMemo(() => {
        if (!isOpen || materiasCursando.length === 0) return null;
        return matriculaService.calcularDesglose(materiasCursando, perfil);
    }, [isOpen, materiasCursando, perfil]);

    const updatePerfil = <K extends keyof StudentProfile>(campo: K, valor: StudentProfile[K]) => {
        setPerfil(prev => ({ ...prev, [campo]: valor }));
    };

    const handleCoberturaChange = (val: string) => {
        if (val === '') { updatePerfil('coberturaPct', 0); return; }
        let num = parseInt(val, 10);
        if (isNaN(num)) num = 0;
        num = Math.max(0, Math.min(100, num));
        updatePerfil('coberturaPct', num);
    };

    const coberturaDisplayValue = perfil.coberturaPct === 0 ? '' : perfil.coberturaPct.toString();

    // Agrupa los recargos por taxonomía para mostrarlos en la factura proforma
    const recargosPorTaxonomia = useMemo(() => {
        if (!desglose) return {};
        return desglose.cooperacion.materiasConRecargo.reduce((acc, curr) => {
            if (!acc[curr.taxonomia]) {
                acc[curr.taxonomia] = { ucBase: 0, porcentaje: curr.porcentaje, ucRecargo: 0 };
            }
            acc[curr.taxonomia].ucBase    += curr.ucBase;
            acc[curr.taxonomia].ucRecargo += curr.ucRecargo;
            return acc;
        }, {} as Record<string, { ucBase: number; porcentaje: number; ucRecargo: number }>);
    }, [desglose]);

    return {
        perfil,
        desglose,
        updatePerfil,
        handleCoberturaChange,
        coberturaDisplayValue,
        recargosPorTaxonomia,
    };
}
