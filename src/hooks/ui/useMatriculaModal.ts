import { useState, useMemo, useEffect } from 'react';
import { MatriculaService, type MateriaMatricula } from '../../services/MatriculaService';
import type { StudentProfile } from '../../types/matricula';
import { useCarrera } from '../../contexts/CarreraContext';

const STORAGE_KEY = 'calculadora_matricula_perfil';
const EMPTY_MATRICULA = {};

export function useMatriculaModal(materiasCursando: MateriaMatricula[], isOpen: boolean) {
    const { carreraData } = useCarrera();
    const matriculaData = carreraData?.matricula || EMPTY_MATRICULA;
    
    // Función para obtener estado inicial
    const getInitialPerfil = (): StudentProfile => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                console.error("Error parsing saved profile", e);
            }
        }
        return {
            sede: "g", // Default a Guayana
            carrera: "sinDescuento",
            esAlumnoNuevo: false,
            cooperacion: "ninguna",
            coberturaPct: 0,
            aplicaRetraso: false,
        };
    };

    // Estado del perfil
    const [perfil, setPerfil] = useState<StudentProfile>(getInitialPerfil);

    // Guardar en localStorage cuando cambie
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(perfil));
    }, [perfil]);

    const tasaBCV = matriculaData.tasa_bcv_mock || 75.00;

    // Instancia del servicio
    const matriculaService = useMemo(
        () => new MatriculaService(matriculaData),
        [matriculaData]
    );

    // Cálculo reactivo
    const desglose = useMemo(() => {
        if (!isOpen || materiasCursando.length === 0) return null;
        return matriculaService.calcularDesglose(materiasCursando, perfil);
    }, [isOpen, materiasCursando, perfil, matriculaService]);

    // Handlers
    const updatePerfil = <K extends keyof StudentProfile>(campo: K, valor: StudentProfile[K]) => {
        setPerfil(prev => ({ ...prev, [campo]: valor }));
    };

    const handleCoberturaChange = (val: string) => {
        if (val === '') {
            updatePerfil('coberturaPct', 0);
            return;
        }
        let num = parseInt(val, 10);
        if (isNaN(num)) num = 0;
        if (num > 100) num = 100;
        if (num < 0) num = 0;
        updatePerfil('coberturaPct', num);
    };

    const coberturaDisplayValue = perfil.coberturaPct === 0 ? '' : perfil.coberturaPct.toString();

    const recargosPorTaxonomia = useMemo(() => {
        if (!desglose) return {};
        return desglose.cooperacion.materiasConRecargo.reduce((acc, curr) => {
            if (!acc[curr.taxonomia]) {
                acc[curr.taxonomia] = { ucBase: 0, porcentaje: curr.porcentaje, ucRecargo: 0 };
            }
            acc[curr.taxonomia].ucBase += curr.ucBase;
            acc[curr.taxonomia].ucRecargo += curr.ucRecargo;
            return acc;
        }, {} as Record<string, { ucBase: number, porcentaje: number, ucRecargo: number }>);
    }, [desglose]);

    return {
        perfil,
        desglose,
        tasaBCV,
        updatePerfil,
        handleCoberturaChange,
        coberturaDisplayValue,
        recargosPorTaxonomia
    };
}
