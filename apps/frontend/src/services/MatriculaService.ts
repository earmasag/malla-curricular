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
    mensualidad: number;
    costoMaterias: number;
    recargosTaxonomia: number;
    descuentoSede: number;
    descuentoCarrera: number;
    recargoIntensivo: number;
    derechoInscripcion: number;
    derechoConfirmacion: number;
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
        const cantSemestres = 5;
        let costoMateriasMensual = 0;
        let recargosTaxonomiaMensual = 0;
        let descuentoSedeMensual = 0;
        let descuentoCarrera = 0;
        let recargoIntensivo = 0;
        let derechoInscripcion = 0;
        let derechoConfirmacion = 0;
        let totalFinal = 0;
        let pagosMensuales: number[] = [];
        let mensualidad = 0;

        costoMateriasMensual = this.calcularMensualidad(materias);
        recargosTaxonomiaMensual = this.calcularTaxMensual(materias);

        if (perfil.esSedeGuayana) {
            descuentoSedeMensual = this.calcularDescuentoSede(costoMateriasMensual + recargosTaxonomiaMensual);
        }

        derechoInscripcion = this.calcularInscripcion(perfil.esAlumnoNuevo).inscripcion;
        derechoConfirmacion = this.calcularInscripcion(perfil.esAlumnoNuevo).confirmacion;

        mensualidad = costoMateriasMensual + recargosTaxonomiaMensual - descuentoSedeMensual;
        pagosMensuales = this.calcularPagosMensuales(mensualidad, perfil);
        totalFinal = mensualidad * cantSemestres + derechoInscripcion + derechoConfirmacion;

        const costoMaterias = costoMateriasMensual * cantSemestres;
        const recargosTaxonomia = recargosTaxonomiaMensual * cantSemestres;
        const descuentoSede = descuentoSedeMensual * cantSemestres;


        return {
            mensualidad,
            costoMaterias,
            recargosTaxonomia,
            descuentoSede,
            descuentoCarrera,
            recargoIntensivo,
            derechoInscripcion,
            derechoConfirmacion,
            totalFinal,
            pagosMensuales
        };
    }

    private calcularMensualidad(materias: MateriaMatricula[]): number {
        const costoUC = matriculaData.costo_uc_base;
        const mensualidad = costoUC * materias.reduce((sum, m) => sum + m.unidadesCredito, 0);
        return mensualidad;
    }

    private calcularTaxMensual(materias: MateriaMatricula[]): number {
        const costoUC = matriculaData.costo_uc_base;
        const materiasTax = materias;
        let recargoTax = 0;

        materiasTax.forEach((materia) => {
            recargoTax += this.calcularCostoTaxonomiaMateria(materia, costoUC);
        })

        return recargoTax;

    }

    private calcularPagosMensuales(mensualidad: number, perfil: StudentProfile): number[] {

        const derecho_inscripcion = this.calcularInscripcion(perfil.esAlumnoNuevo).inscripcion;
        const derecho_confirmacion = this.calcularInscripcion(perfil.esAlumnoNuevo).confirmacion;

        if (perfil.aplicaRetraso === true) {
            let monto = mensualidad;
            let montoInscripción = mensualidad + derecho_inscripcion + this.calcularAtraso(mensualidad + derecho_inscripcion);
            let montoConfirmacion = mensualidad + derecho_confirmacion + this.calcularAtraso(mensualidad + derecho_confirmacion);
            monto += this.calcularAtraso(monto)
            return [
                montoInscripción,
                monto,
                monto,
                montoConfirmacion,
                monto
            ]
        }

        return [mensualidad + derecho_inscripcion, mensualidad, mensualidad, mensualidad + derecho_confirmacion, mensualidad];
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

        return costoBase * porcentajeTaxonomia * materia.unidadesCredito;
    }

    private calcularDescuentoSede(costoMaterias: number): number {
        return costoMaterias * matriculaData.descuentos.sede_guayana;
    }

    private calcularAtraso(mensualidad: number): number {
        return mensualidad * matriculaData.recargos_adicionales.retraso_pago;
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
