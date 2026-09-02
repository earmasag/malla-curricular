import type { MateriaNode } from '../types/materia';
import type {
    StudentProfile,
    MatriculaBreakdown,
    CooperacionResult,
    PagoMensual,
    MateriaRecargo,
    TipoCooperacion,
    MatriculaConfig,
} from '../types/matricula';
import CONFIG from '../data/matricula.json';

// MateriaMatricula es un alias de MateriaNode; se exporta para que los consumidores lo usen como tipo
export type MateriaMatricula = MateriaNode;

export class MatriculaService {
    private readonly config: MatriculaConfig = CONFIG as MatriculaConfig;

    // ─── Etapa 1: Acumular UC ────────────────────────────────────────────────

    /** Retorna el porcentaje de recargo por taxonomía (0 si exenta: virtual o semipresencial). */
    private getRecargoPct(taxonomia: string): number {
        if (taxonomia.includes('(V)') || taxonomia.includes('(SP)')) return 0;
        return this.config.recargos_taxonomia[taxonomia] ?? 0;
    }

    /** Acumula las UC base y las UC de recargo (cálculo puro, sin efectos de display). */
    private sumarUC(materias: MateriaMatricula[]): { ucBase: number; ucRecargo: number } {
        let ucBase    = 0;
        let ucRecargo = 0;
        for (const m of materias) {
            ucBase    += m.unidadesCredito;
            ucRecargo += m.unidadesCredito * this.getRecargoPct(m.taxonomia);
        }
        return { ucBase, ucRecargo };
    }

    /** Construye el detalle de materias con recargo para mostrar en la UI. */
    private getMateriasConRecargo(materias: MateriaMatricula[]): MateriaRecargo[] {
        return materias
            .map(m => ({ m, pct: this.getRecargoPct(m.taxonomia) }))
            .filter(({ pct }) => pct > 0)
            .map(({ m, pct }) => ({
                nombre:     m.nombre,
                taxonomia:  m.taxonomia,
                ucBase:     m.unidadesCredito,
                ucRecargo:  m.unidadesCredito * pct,
                porcentaje: pct,
            }));
    }

    // ─── Etapa 2: Cooperación económica ─────────────────────────────────────

    /**
     * Determina las UC a pagar según el tipo de cooperación.
     * La beca cubre solo ucBase (hasta el límite); ucRecargo siempre lo paga el estudiante.
     */
    private calcularCooperacion(
        ucBase: number,
        ucRecargo: number,
        coop: TipoCooperacion,
        coberturaPct: number,
        materiasConRecargo: MateriaRecargo[],
    ): CooperacionResult {
        const fraccionAPagar = 1 - coberturaPct / 100; // ej: beca 80% → 0.20
        const limites = this.config.cooperacion.limites;

        let ucPagar      = 0;
        let ucFuera      = 0;
        let excesoLimite = 0;
        let limiteBeca   = 0;

        if (coop === 'beca' || coop === 'prop' || coop === 'fab') {
            const limite = limites[coop];
            limiteBeca = limite;

            if (ucBase <= limite) {
                ucPagar = (ucBase * fraccionAPagar) + ucRecargo;
                ucFuera = ucRecargo;
            } else {
                const exceso = ucBase - limite;
                ucPagar      = exceso + ucRecargo + (limite * fraccionAPagar);
                ucFuera      = exceso + ucRecargo;
                excesoLimite = exceso;
            }
        } else if (coop === 'baup') {
            ucPagar = (ucBase + ucRecargo) * fraccionAPagar;
        } else {
            // ninguna
            ucPagar = ucBase + ucRecargo;
        }

        return { ucPagar, ucFuera, excesoLimite, limiteBeca, materiasConRecargo };
    }

    // ─── Etapa 5: Cuotas ─────────────────────────────────────────────────────

    /**
     * Calcula el monto de una cuota individual aplicando el fee adicional
     * y el recargo por retraso de forma uniforme sobre (mensualidad + fee).
     */
    private calcularCuota(mensualidad: number, fee: number, aplicaRetraso: boolean): number {
        const total = mensualidad + fee;
        return aplicaRetraso
            ? total * (1 + this.config.recargos_adicionales.retraso_pago)
            : total;
    }

    /** Genera el plan de 5 cuotas con sus fees e conversión a Bs. */
    private generarCuotas(mensualidadUSD: number, perfil: StudentProfile, tasaBCV: number): PagoMensual[] {
        const insc = this.config.derecho_inscripcion_uc;
        const vu   = this.config.costo_uc_base;

        const costoInsc  = (perfil.esAlumnoNuevo ? insc.alumno_nuevo_inscripcion  : insc.alumno_regular_inscripcion)  * vu;
        const costoCnfm  = (perfil.esAlumnoNuevo ? insc.alumno_nuevo_confirmacion : insc.alumno_regular_confirmacion) * vu;

        const fees: Record<number, { fee: number; desc: string }> = {
            1: { fee: costoInsc,  desc: 'Incluye Inscripción' },
            4: { fee: costoCnfm, desc: 'Incluye Confirmación' },
        };

        return Array.from({ length: 5 }, (_, i) => {
            const n = i + 1;
            const { fee = 0, desc = `Mes ${n}` } = fees[n] ?? {};
            const montoUSD = this.calcularCuota(mensualidadUSD, fee, perfil.aplicaRetraso);
            return { numero: n, descripcion: desc, montoUSD, montoBs: montoUSD * tasaBCV };
        });
    }

    // ─── Orquestador (pipeline completo) ─────────────────────────────────────

    /**
     * Calcula el desglose completo de matrícula para un conjunto de materias y un perfil.
     *
     * Pipeline:
     *   1. Acumular UC (base + recargo taxonomía por separado)
     *   2. Cooperación económica → ucPagar
     *   3. Valorizar: montoBase = ucPagar × valorUC
     *   4. Descuentos: aplicar carrera y sede al monto (no al valorUC)
     *   5. Cuotas: 5 pagos con fees de inscripción/confirmación y recargo de retraso
     */
    public calcularDesglose(materias: MateriaMatricula[], perfil: StudentProfile): MatriculaBreakdown {
        const tasaBCV = this.config.tasa_bcv_mock;
        const valorUC = this.config.costo_uc_base;

        // Etapa 1: sumar UC (cálculo) + detalle para UI (display)
        const { ucBase, ucRecargo }   = this.sumarUC(materias);
        const materiasConRecargo      = this.getMateriasConRecargo(materias);

        // Etapa 2
        const cooperacion = this.calcularCooperacion(
            ucBase, ucRecargo, perfil.cooperacion, perfil.coberturaPct, materiasConRecargo,
        );

        // Etapas 3 + 4: valorizar y luego descontar sobre el monto
        const descuentoCarreraPct = this.config.descuentos_carrera[perfil.carrera]?.porcentaje ?? 0;
        const descuentoSedePct    = this.config.descuentos_sede[perfil.sede] ?? 0;
        const mensualidadUSD = Math.round(
            cooperacion.ucPagar * valorUC * (1 - descuentoCarreraPct) * (1 - descuentoSedePct) * 100
        ) / 100;

        // Etapa 5
        const pagosMensuales   = this.generarCuotas(mensualidadUSD, perfil, tasaBCV);
        const totalSemestreUSD = pagosMensuales.reduce((s, p) => s + p.montoUSD, 0);

        return {
            ucBase,
            ucRecargo,
            valorUC,
            descuentoCarreraPct,
            descuentoSedePct,
            cooperacion,
            mensualidadUSD,
            totalSemestreUSD,
            pagosMensuales,
            tasaBCV,
            mensualidadBs:    mensualidadUSD * tasaBCV,
            totalSemestreBs:  totalSemestreUSD * tasaBCV,
        };
    }
}
