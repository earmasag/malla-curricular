import type { ProgresoMalla } from "../types/materia";
import type { IMallaEvaluator } from "../rules/IMallaEvaluator";
import type { MallaCurricularGraph } from "../core/MallaCurricularGraph";

// ==========================================
// MIGRATION RULES (202415 -> 202715)
// ==========================================

export const MIGRATION_RULES = {
    // 1:1 Mappings (Old Code -> New Code)
    // Only those where the code actually changed need to be here.
    // If the code is the same (e.g. INFO-02010 -> INFO-02010), we map it automatically.
    oneToOne: {
        "ADCO-00350": "INFO-00002", // Principios de Marketing -> Estrategia y Proyección Profesional
        "FING-02015": "FING-02017", // Física General -> Mecánica
        "INFO-02008": "INFO-02030", // Interacción Humano-Computador -> Diseño de Experiencia de Usuario
        "CUSC": "CURSO-SC", // Curso de Servicio Comunitario
        "IISC": "PROY-SC", // Servicio Comunitario
        "VARIABLE": "FING-ELEC1", // Electiva Informatica I
        "VARIABLE-2": "FING-ELEC2", // Electiva Complementaria
    } as Record<string, string>,

    // N:1 Mappings (New Code -> Array of Old Codes required)
    manyToOne: {
        "INFO-02001": ["FING-02008", "INFO-02001"], // Fundamentos + Algoritmos = Algoritmos (7 UC)
        "INFO-00001": ["INFO-02014", "INFO-02021"], // Inglés I + Inglés II = Inglés (3 UC)
    } as Record<string, string[]>,

    // 1:N Mappings (Old Code -> Array of New Codes granted)
    oneToMany: {
        "INFO-02023": ["INFO-02031", "INFO-02032"], // Ciberseguridad -> Ofensiva + Defensiva
    } as Record<string, string[]>
};

export class MigrationService {
    constructor(private evaluator: IMallaEvaluator) { }

    /**
     * Migra el progreso del plan 202415 al plan 202715.
     * @param oldProgreso Progreso en el plan viejo
     * @param newGraph Grafo del nuevo plan
     * @returns Nuevo Progreso evaluado
     */
    public migrateTo2027(oldProgreso: ProgresoMalla, newGraph: MallaCurricularGraph): { newProgreso: ProgresoMalla, pensumAnterior: Record<string, boolean> } {
        const baseNewProgreso: ProgresoMalla = {};
        const pensumAnterior: Record<string, boolean> = {};

        // Helper: verificar si una materia vieja fue aprobada
        const isApprovedInOld = (oldCode: string) => oldProgreso[oldCode] === "aprobada";

        // --- LÓGICA DE COMPENSACIÓN DE UC ---
        
        // 1. Materias Derogadas
        if (isApprovedInOld("INFO-02006")) pensumAnterior['progWeb'] = true; // Prog. Orientada a la Web (3 UC)
        if (isApprovedInOld("FING-02013")) pensumAnterior['labFisica'] = true; // Lab. de Física (2 UC)
        if (isApprovedInOld("VARIABLE-1")) pensumAnterior['electiva2'] = true; // Electiva Informática II (4 UC)

        // 2. Lógica Especial para Inglés
        const hasIngles1 = isApprovedInOld("INFO-02014"); // 4 UC
        const hasIngles2 = isApprovedInOld("INFO-02021"); // 4 UC

        if (hasIngles1 && hasIngles2) {
            // Tienen ambos (8 UC). Se les aprueba el nuevo (3 UC), así que les compensamos 5 UC.
            pensumAnterior['inglesCompensacion5'] = true; 
        } else if (hasIngles1 && !hasIngles2) {
            // Solo tienen Inglés 1 (4 UC). No se les aprueba el nuevo, compensamos 4 UC.
            pensumAnterior['ingles1'] = true;
        } else if (!hasIngles1 && hasIngles2) {
            // Solo tienen Inglés 2 (4 UC). No se les aprueba el nuevo, compensamos 4 UC.
            pensumAnterior['ingles2'] = true;
        }

        // Obtener todos los nodos del nuevo grafo
        const newNodes = newGraph.getAllNodes();

        newNodes.forEach(newNode => {
            const newCode = newNode.codigoMateria;

            // 1. Chequear mapeos N:1 (Varios a Uno)
            if (MIGRATION_RULES.manyToOne[newCode]) {
                const requiredOldCodes = MIGRATION_RULES.manyToOne[newCode];
                if (requiredOldCodes.every(isApprovedInOld)) {
                    baseNewProgreso[newCode] = "aprobada";
                }
                return; // Continuamos al siguiente nodo
            }

            // 2. Chequear mapeos 1:N (Uno a Varios)
            for (const [oldCode, newCodesArray] of Object.entries(MIGRATION_RULES.oneToMany)) {
                if (newCodesArray.includes(newCode) && isApprovedInOld(oldCode)) {
                    baseNewProgreso[newCode] = "aprobada";
                    return;
                }
            }

            // 3. Chequear mapeos 1:1 (Cambio de código)
            for (const [oldCode, mappedNewCode] of Object.entries(MIGRATION_RULES.oneToOne)) {
                if (mappedNewCode === newCode && isApprovedInOld(oldCode)) {
                    baseNewProgreso[newCode] = "aprobada";
                    return;
                }
            }

            // 4. Mapeo implícito 1:1 (Mismo código)
            if (isApprovedInOld(newCode)) {
                baseNewProgreso[newCode] = "aprobada";
            }
        });

        // Una vez que tenemos las aprobaciones crudas mapeadas, 
        // pasamos el progreso por el evaluador de reglas para desbloquear
        // las materias disponibles, cursando, etc.
        const evaluatedProgreso = this.evaluator.evaluate(baseNewProgreso, newGraph);

        return {
            newProgreso: evaluatedProgreso,
            pensumAnterior
        };
    }
}
