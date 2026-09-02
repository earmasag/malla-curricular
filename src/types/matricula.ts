export type Sede = "ccs" | "g" | "tq";
export type TipoCooperacion = "beca" | "prop" | "fab" | "baup" | "ninguna";

export interface StudentProfile {
    sede: Sede;
    carrera: string;          // clave del descuento_carrera
    esAlumnoNuevo: boolean;
    cooperacion: TipoCooperacion;
    coberturaPct: number;     // 0-100
    aplicaRetraso: boolean;
}

export interface MateriaRecargo {
    nombre: string;
    ucBase: number;
    ucRecargo: number;        // UC adicionales por taxonomía (ucBase × pct)
    taxonomia: string;
    porcentaje: number;
}

export interface CooperacionResult {
    ucPagar: number;          // UC que paga el estudiante
    ucFuera: number;          // UC fuera de cobertura (alerta)
    excesoLimite: number;     // UC que exceden el límite de la beca
    limiteBeca: number;       // El límite de la beca
    materiasConRecargo: MateriaRecargo[];
}

export interface MatriculaBreakdown {
    // Acumulación UC
    ucBase: number;           // UC puras (suma directa de unidadesCredito)
    ucRecargo: number;        // UC adicionales por recargo de taxonomía

    // Valores UC y descuentos aplicados
    valorUC: number;          // Valor base (costo_uc_base del config)
    descuentoCarreraPct: number;
    descuentoSedePct: number;

    // Cooperación
    cooperacion: CooperacionResult;

    // Montos (pipeline: valorizar → descontar → cuotas)
    mensualidadUSD: number;   // Monto mensual neto en USD
    totalSemestreUSD: number; // Total del semestre (suma de 5 cuotas)

    // Pagos mensuales (5 cuotas)
    pagosMensuales: PagoMensual[];

    // BCV
    tasaBCV: number;
    mensualidadBs: number;
    totalSemestreBs: number;
}

export interface PagoMensual {
    numero: number;           // 1-5
    descripcion: string;      // "Incluye Inscripción", "Incluye Confirmación", etc.
    montoUSD: number;
    montoBs: number;
}

// Tipado del JSON de configuración de aranceles
export interface MatriculaConfig {
    costo_uc_base: number;
    tasa_bcv_mock: number;
    meses_por_semestre: number;
    recargos_taxonomia: Record<string, number>;
    descuentos_sede: Record<string, number>;
    descuentos_carrera: Record<string, { porcentaje: number; sobreBaseBruta: boolean }>;
    derecho_inscripcion_uc: {
        alumno_nuevo_inscripcion: number;
        alumno_nuevo_confirmacion: number;
        alumno_regular_inscripcion: number;
        alumno_regular_confirmacion: number;
    };
    recargos_adicionales: { retraso_pago: number; cursos_intensivos: number };
    cooperacion: { limites: { beca: number; prop: number; fab: number } };
}
