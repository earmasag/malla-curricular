import type { MateriaNode } from '../types/materia';
import matriculaData from '../data/matricula.json';

export interface StudentProfile {
    esSedeGuayana: boolean;
    carrera: keyof typeof matriculaData.descuentos_carrera;
    esAlumnoNuevo: boolean;
    aplicaRetraso: boolean;
    esIntensivo: boolean;
}

export interface MatriculaBreakdown {
    costoMaterias: number;
    montoDescuentos: number;
    montoRecargos: number;
    derechoInscripcion: number;
    totalFinal: number;
    pagosMensuales: number[];
}

// Extendemos MateriaNode para documentar las propiedades que requiere el cálculo
export interface MateriaMatricula extends MateriaNode {
    esTSU?: boolean;
    esElectivaEspecialHumanidades?: boolean;
}

export class MatriculaService {
    
    public calcularDesglose(materias: MateriaMatricula[], perfil: StudentProfile): MatriculaBreakdown {
        let costoMaterias = 0;
        let subtotalBaseTotal = 0;

        for (const materia of materias) {
            const costoBase = this.calcularCostoBaseMateria(materia);

            let costoFinal = this.calcularCostoTaxonomiaMateria(materia, costoBase);
            if (perfil.esIntensivo) {
                costoFinal = this.aplicarRecargoIntensivo(costoFinal);
            }

            subtotalBaseTotal += costoBase;
            costoMaterias += costoFinal;
        }

        const montoDescuentos = this.calcularDescuentos(costoMaterias, perfil, subtotalBaseTotal);
        const desgloseInscripcion = this.calcularInscripcion(perfil.esAlumnoNuevo);
        const derechoInscripcion = desgloseInscripcion.total;

        // Subtotal antes del recargo global por retraso
        const subtotalAntesRecargos = costoMaterias - montoDescuentos + derechoInscripcion;

        let montoRecargos = 0;
        // Retraso de pago
        if (perfil.aplicaRetraso) {
            montoRecargos += subtotalAntesRecargos * matriculaData.recargos_adicionales.retraso_pago;
        }

        const totalFinal = subtotalAntesRecargos + montoRecargos;

        // El costo neto de las materias con recargos/descuentos aplicados
        const costoNetoMaterias = totalFinal - derechoInscripcion;
        const pagosMensuales = this.calcularPagosMensuales(costoNetoMaterias, desgloseInscripcion.inscripcion, desgloseInscripcion.confirmacion);

        return {
            costoMaterias,
            montoDescuentos,
            montoRecargos,
            derechoInscripcion,
            totalFinal,
            pagosMensuales
        };
    }

    public calcularPagosMensuales(costoNetoMaterias: number, pagoInscripcion: number, pagoConfirmacion: number): number[] {
        // Las materias se dividen equitativamente entre los 5 meses del semestre
        const cuotaMateria = costoNetoMaterias / matriculaData.meses_por_semestre;

        // Cuota 1: Inscripción + Primera fracción de materias
        const pago1 = pagoInscripcion + cuotaMateria;

        // Cuota 2 y 3: Solo la fracción correspondiente a las materias
        const pagoRestante = cuotaMateria;

        // Cuota 4: Parte de la confirmación + fracción de materias
        const pago4 = pagoConfirmacion + cuotaMateria;

        // Cuota 5: Fracción correspondiente a las materias
        const pago5 = cuotaMateria;

        return [
            pago1,
            pagoRestante,
            pagoRestante,
            pago4,
            pago5
        ];
    }

    private calcularCostoBaseMateria(materia: MateriaMatricula): number {
        const costoPorUc = materia.esTSU ? matriculaData.costo_uc_tsu : matriculaData.costo_uc_base;

        // Fórmula Base: Costo UC * 5 meses * Cantidad de UCs de la materia
        return costoPorUc * matriculaData.meses_por_semestre * materia.unidadesCredito;
    }

    private calcularCostoTaxonomiaMateria(materia: MateriaMatricula, costoBase: number): number {
        let porcentajeTaxonomia = 0;

        // Si la materia es electiva de humanidades especial, se cobra directamente como TA9 (+15%)
        if (materia.esElectivaEspecialHumanidades) {
            porcentajeTaxonomia = matriculaData.recargos_taxonomia.electivas_especiales_humanidades;
        } else if (materia.taxonomia) {
            const key = materia.taxonomia as keyof typeof matriculaData.recargos_taxonomia;
            if (matriculaData.recargos_taxonomia[key] !== undefined) {
                porcentajeTaxonomia = matriculaData.recargos_taxonomia[key];
            }
        }

        return costoBase * (1 + porcentajeTaxonomia);
    }

    private aplicarRecargoIntensivo(costoMateria: number): number {
        // Cursos Intensivos: +20% sobre el costo
        return costoMateria * (1 + matriculaData.recargos_adicionales.cursos_intensivos);
    }

    private calcularDescuentos(subtotalMaterias: number, perfil: StudentProfile, subtotalBaseMaterias: number): number {
        let montoDescuentoTotal = 0;
        let baseGravable = subtotalMaterias; // Se aplica sobre el subtotal con taxonomías incluidas

        // 1. Descuento Sede Guayana (-10%)
        if (perfil.esSedeGuayana) {
            const descuentoSede = baseGravable * matriculaData.descuentos.sede_guayana;
            montoDescuentoTotal += descuentoSede;
            baseGravable -= descuentoSede; // Importante para la cascada en el siguiente paso
        }

        // 2. Descuento por Carrera leyendo del JSON dict
        const infoDescuento = matriculaData.descuentos_carrera[perfil.carrera];
        if (infoDescuento && infoDescuento.porcentaje > 0) {
            const montoCalculo = infoDescuento.sobreBaseBruta ? subtotalBaseMaterias : baseGravable;
            montoDescuentoTotal += montoCalculo * infoDescuento.porcentaje;
        }

        return montoDescuentoTotal;
    }

    private calcularInscripcion(esAlumnoNuevo: boolean): { inscripcion: number, confirmacion: number, total: number } {
        const ucInscripcion = esAlumnoNuevo ?
            matriculaData.derecho_inscripcion_uc.alumno_nuevo_inscripcion :
            matriculaData.derecho_inscripcion_uc.alumno_regular_inscripcion;

        const ucConfirmacion = esAlumnoNuevo ?
            matriculaData.derecho_inscripcion_uc.alumno_nuevo_confirmacion :
            matriculaData.derecho_inscripcion_uc.alumno_regular_confirmacion;

        const inscripcion = ucInscripcion * matriculaData.costo_uc_base;
        const confirmacion = ucConfirmacion * matriculaData.costo_uc_base;

        return {
            inscripcion,
            confirmacion,
            total: inscripcion + confirmacion
        };
    }
}
