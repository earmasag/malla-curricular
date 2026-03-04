export type EstadoMateria = "bloqueada" | "disponible" | "cursando" | "aprobada";

export interface MateriaBase {
    codigoMateria: string;
    nombre: string;
    horasTeoricas: number;
    horasPracticas: number;
    horasLaboratorio: number;
    horasPresenciales: number;
    horasAutonomas: number;
    horasTotales: number;
    unidadesCredito: number;
    tipo: string;
    modalidad: string;
    taxonomia: string;
    areaFormacion: string;
    semestre: number;
    ucRequeridas: number;
}

export type ProgresoMalla = Record<string, EstadoMateria>;

export interface MateriaNode extends MateriaBase {
    estado: EstadoMateria
}

export interface MateriaJSON extends MateriaBase {
    prelacion: string[];
    correquisito?: string[];
}
