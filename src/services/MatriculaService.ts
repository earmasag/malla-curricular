import type { MateriaNode } from '../types/materia';
import type { StudentProfile, MatriculaBreakdown, CooperacionResult, PagoMensual, Sede, TipoCooperacion, MateriaRecargo } from '../types/matricula';

// Extendemos MateriaNode para documentar las propiedades que requiere el cálculo
export type MateriaMatricula = MateriaNode;

export class MatriculaService {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(private config: any) {}

    private acumularUC(materias: MateriaMatricula[]): { ucbase: number, uctotal: number, materiasConRecargo: MateriaRecargo[] } {
        let ucbase = 0;
        let uctotal = 0;
        const materiasConRecargo: MateriaRecargo[] = [];

        materias.forEach(materia => {
            const base = materia.unidadesCredito;
            let conRecargo = base;
            let porcentajeTaxonomia = 0;
            const tax = materia.taxonomia;

            if (!tax.includes('(V)') && !tax.includes('(SP)')) {
                if (tax && this.config.recargos_taxonomia[tax] !== undefined) {
                    porcentajeTaxonomia = this.config.recargos_taxonomia[tax];
                }
                conRecargo = base * (1 + porcentajeTaxonomia);
            }
            
            ucbase += base;
            uctotal += conRecargo;

            const recargo = conRecargo - base;
            if (recargo > 0) {
                materiasConRecargo.push({
                    nombre: materia.nombre,
                    ucRecargo: recargo,
                    taxonomia: materia.taxonomia,
                    ucBase: base,
                    porcentaje: porcentajeTaxonomia
                });
            }
        });

        return { ucbase, uctotal, materiasConRecargo };
    }

    // UC-04: Aplicar Descuento por Carrera y Sede
    private calcularVrealUC(valorUC: number, carrera: string, sede: Sede): { vrealUC: number, descCarrera: number, descSede: number } {
        let vrealUC = valorUC;
        let descCarrera = 0;
        let descSede = 0;

        // Descuento por carrera (aplicar primero)
        if (this.config.descuentos_carrera[carrera]) {
            descCarrera = this.config.descuentos_carrera[carrera].porcentaje;
            vrealUC = vrealUC * (1 - descCarrera);
        }

        // Descuento por sede (aplicar sobre vrealUC del paso anterior)
        if (this.config.descuentos_sede && this.config.descuentos_sede[sede] !== undefined) {
            descSede = this.config.descuentos_sede[sede];
            vrealUC = vrealUC * (1 - descSede);
        }

        return { vrealUC, descCarrera, descSede };
    }

    // UC-05: Calcular UC a Pagar según Cooperación Económica
    private calcularUCPagar(ucbase: number, uctotal: number, coop: TipoCooperacion, coberturaPct: number): Omit<CooperacionResult, 'materiasConRecargo'> {
        const cobertura = 1 - (coberturaPct / 100);
        const ucre = uctotal - ucbase;
        let ucpagar = 0;
        let ucfuera = 0;
        let excesoLimite = 0;
        let limiteBeca = 0;

        const limites = this.config.cooperacion?.limites || { beca: 30, prop: 27, fab: 30 };

        if (coop === "beca" || coop === "prop" || coop === "fab") {
            const limit = coop === "prop" ? limites.prop : (coop === "beca" ? limites.beca : limites.fab);
            limiteBeca = limit;
            
            if (ucbase <= limit) {
                ucpagar = (ucbase * cobertura) + ucre;
                ucfuera = ucre;
            } else {
                ucpagar = (ucbase - limit) + ucre + (limit * cobertura);
                ucfuera = (ucbase - limit) + ucre;
                excesoLimite = ucbase - limit;
            }
        } else if (coop === "baup") {
            ucpagar = uctotal * cobertura;
            ucfuera = 0;
        } else { // "ninguna"
            ucpagar = uctotal;
            ucfuera = 0;
        }

        return { ucpagar, ucfuera, excesoLimite, limiteBeca };
    }

    // UC-06: Calcular Monto Base Mensual
    private calcularMontoBase(ucpagar: number, vrealUC: number): number {
        // Redondear a 2 decimales para precisión de moneda
        return Math.round((ucpagar * vrealUC) * 100) / 100;
    }

    // UC-07: Generar Plan de Pagos (Mensual)
    private calcularPagosMensuales(totalbs: number, perfil: StudentProfile, valorUC: number, tasaBCV: number): PagoMensual[] {
        const derechoInscripcion = perfil.esAlumnoNuevo ?
            this.config.derecho_inscripcion_uc.alumno_nuevo_inscripcion :
            this.config.derecho_inscripcion_uc.alumno_regular_inscripcion;

        const derechoConfirmacion = perfil.esAlumnoNuevo ?
            this.config.derecho_inscripcion_uc.alumno_nuevo_confirmacion :
            this.config.derecho_inscripcion_uc.alumno_regular_confirmacion;

        const costoInscripcion = derechoInscripcion * valorUC;
        const costoConfirmacion = derechoConfirmacion * valorUC;

        const pagos: PagoMensual[] = [];
        
        let mensualidadConRetraso = totalbs;
        if (perfil.aplicaRetraso) {
             mensualidadConRetraso += totalbs * (this.config.recargos_adicionales?.retraso_pago || 0.10);
        }

        for (let i = 1; i <= 5; i++) {
            let montoUSD = mensualidadConRetraso;
            let descripcion = `Mes ${i}`;

            if (i === 1) {
                const recargoRetraso = perfil.aplicaRetraso ? (totalbs + costoInscripcion) * (this.config.recargos_adicionales?.retraso_pago || 0.10) : 0;
                montoUSD = totalbs + costoInscripcion + recargoRetraso;
                descripcion = "Incluye Inscripción";
            } else if (i === 4) {
                 const recargoRetraso = perfil.aplicaRetraso ? (totalbs + costoConfirmacion) * (this.config.recargos_adicionales?.retraso_pago || 0.10) : 0;
                montoUSD = totalbs + costoConfirmacion + recargoRetraso;
                descripcion = "Incluye Confirmación";
            }

            pagos.push({
                numero: i,
                descripcion,
                montoUSD,
                montoBs: montoUSD * tasaBCV
            });
        }

        return pagos;
    }

    // Método orquestador
    public calcularDesglose(materias: MateriaMatricula[], perfil: StudentProfile): MatriculaBreakdown {
        const tasaBCV = this.config.tasa_bcv_mock || 75.00;
        const valorUC = this.config.costo_uc_base;

        // 1. Acumular UC
        const { ucbase, uctotal, materiasConRecargo } = this.acumularUC(materias);
        const ucre = uctotal - ucbase;

        // 2. Calcular VrealUC
        const { vrealUC, descCarrera, descSede } = this.calcularVrealUC(valorUC, perfil.carrera, perfil.sede);

        // 3. Cooperación Económica
        const coopResult = this.calcularUCPagar(ucbase, uctotal, perfil.cooperacion, perfil.coberturaPct);
        const cooperacion: CooperacionResult = {
            ...coopResult,
            materiasConRecargo
        };

        // 4. Monto Base
        const mensualidadUSD = this.calcularMontoBase(cooperacion.ucpagar, vrealUC);
        
        // 5. Pagos Mensuales
        const pagosMensuales = this.calcularPagosMensuales(mensualidadUSD, perfil, valorUC, tasaBCV);

        // 6. Total Semestre
        const totalSemestreUSD = pagosMensuales.reduce((sum, pago) => sum + pago.montoUSD, 0);

        return {
            ucbase,
            uctotal,
            ucre,
            valorUC,
            vrealUC,
            descuentoCarreraPct: descCarrera,
            descuentoSedePct: descSede,
            cooperacion,
            mensualidadUSD,
            totalSemestreUSD,
            pagosMensuales,
            tasaBCV,
            mensualidadBs: mensualidadUSD * tasaBCV,
            totalSemestreBs: totalSemestreUSD * tasaBCV
        };
    }
}
