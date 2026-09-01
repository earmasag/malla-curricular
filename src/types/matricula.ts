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
    ucRecargo: number;
    taxonomia: string;
    ucBase: number;
    porcentaje: number;
}

export interface CooperacionResult {
    ucpagar: number;          // UC que paga el estudiante
    ucfuera: number;          // UC fuera de cobertura (alerta)
    excesoLimite: number;     // UC que exceden el límite de la beca
    limiteBeca: number;       // El límite de la beca
    materiasConRecargo: MateriaRecargo[]; // Detalle de materias con recargo
}

export interface MatriculaBreakdown {
    // Acumulación UC
    ucbase: number;           // UC puras sin recargo
    uctotal: number;          // UC con recargo por taxonomía
    ucre: number;             // Recargos (uctotal - ucbase)

    // Valores UC
    valorUC: number;          // Valor base (costo_uc_base)
    vrealUC: number;          // Valor real tras descuentos sede + carrera
    descuentoCarreraPct: number;
    descuentoSedePct: number;

    // Cooperación
    cooperacion: CooperacionResult;

    // Montos
    mensualidadUSD: number;   // Monto mensual en USD
    totalSemestreUSD: number; // Total del semestre

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
