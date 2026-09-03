import type { ProgresoMalla } from "../types/materia";
import type { IMallaEvaluator } from "../rules/IMallaEvaluator";
import type { MallaCurricularGraph } from "../core/MallaCurricularGraph";
import { calcularUCPensumAnterior } from "../utils/mallaUtils";

// Formato de reglas en el JSON:
// {
//    "key": "identificador_unico",
//    "oldCodes": ["viejo_1", "viejo_2"],
//    "newCodes": ["nuevo_1"],
//    "nombre": "Descripción",
//    "uc": 4, // Opcional, usado para derogadas/ajustes
//    "tipo": "derogada" | "ajuste" | "1:1" | "N:1" | "1:N" | "excluida" | "N_of_M" | "ajuste_condicional"
//    // N_of_M: mapea newCodes si entre minAprobadas y maxAprobadas de oldCodes están aprobados
//    // ajuste_condicional: igual condición que N_of_M pero agrega al pensumAnterior para compensar UC
// }

export class MigrationService {
    constructor(private evaluator: IMallaEvaluator) { }

    /**
     * Migra el progreso del plan 202415 al plan 202715.
     * @param oldProgreso Progreso en el plan viejo
     * @param newGraph Grafo del nuevo plan
     * @param rulesData Array con las reglas de transición (JSON)
     * @returns Nuevo Progreso evaluado
     */
    public migrateTo2027(oldProgreso: ProgresoMalla, newGraph: MallaCurricularGraph, rulesData: any[] = []): { newProgreso: ProgresoMalla, pensumAnterior: Record<string, boolean> } {
        const baseNewProgreso: ProgresoMalla = {};
        const pensumAnterior: Record<string, boolean> = {};

        // Helper: verificar si una materia vieja fue aprobada
        const isApprovedInOld = (oldCode: string) => oldProgreso[oldCode] === "aprobada";

        const excludedCodes = new Set<string>();

        // 1. Primer paso: Analizar todas las reglas
        rulesData.forEach((rule: any) => {
            const { tipo, oldCodes, newCodes, key } = rule;
            
            // Verificar que se cumplen todos los prerequisitos de la regla en el pensum viejo
            const conditionMet = oldCodes && oldCodes.length > 0 && oldCodes.every((code: string) => isApprovedInOld(code));

            if (tipo === "derogada" || tipo === "ajuste") {
                if (conditionMet && key) {
                    pensumAnterior[key] = true;
                }
            } else if (tipo === "excluida") {
                // Registrar códigos para no mapearlos implícitamente
                if (oldCodes) {
                    oldCodes.forEach((code: string) => excludedCodes.add(code));
                }
            } else if (tipo === "1:1" || tipo === "N:1" || tipo === "1:N") {
                if (conditionMet && newCodes) {
                    newCodes.forEach((code: string) => {
                        baseNewProgreso[code] = "aprobada";
                    });
                }
            } else if (tipo === "N_of_M") {
                // Si entre minAprobadas y maxAprobadas (inclusive) de los oldCodes están aprobados, mapear newCodes
                const minAprobadas: number = rule.minAprobadas ?? oldCodes?.length ?? 0;
                const maxAprobadas: number = rule.maxAprobadas ?? Infinity;
                const approvedCount = (oldCodes ?? []).filter((code: string) => isApprovedInOld(code)).length;
                if (approvedCount >= minAprobadas && approvedCount <= maxAprobadas && newCodes) {
                    newCodes.forEach((code: string) => {
                        baseNewProgreso[code] = "aprobada";
                    });
                }
            } else if (tipo === "ajuste_condicional") {
                // Igual que N_of_M pero en lugar de mapear materias, añade una entrada al pensumAnterior
                // para compensar la diferencia de UC (se procesará en calcularUCPensumAnterior)
                const minAprobadas: number = rule.minAprobadas ?? oldCodes?.length ?? 0;
                const maxAprobadas: number = rule.maxAprobadas ?? Infinity;
                const approvedCount = (oldCodes ?? []).filter((code: string) => isApprovedInOld(code)).length;
                if (approvedCount >= minAprobadas && approvedCount <= maxAprobadas && key) {
                    pensumAnterior[key] = true;
                }
            }
        });

        // 2. Conservar Inglés I y II explícitamente en el pensumAnterior 
        // (ya están marcadas como derogadas en el JSON si las tienen, pero las agregamos explícitamente si existen
        // en el viejo progreso para la compensación, aunque la regla "derogada" ya lo haría si key coincide con el code)
        // Ya no es necesario hardcodearlo aquí porque el JSON lo maneja, pero lo mantenemos por consistencia si 
        // oldCodes o key son diferentes, o si dependemos de la regla "ajuste" que evalúa INFO-02014 y INFO-02021.
        
        // De hecho, el JSON ya tiene "INFO-02014" y "INFO-02021" como derogadas, así que se añadirán al pensumAnterior.

        // Obtener todos los nodos del nuevo grafo para el mapeo implícito 1:1
        const newNodes = newGraph.getAllNodes();

        newNodes.forEach(newNode => {
            const newCode = newNode.codigoMateria;

            // Mapeo implícito 1:1 (Mismo código)
            // Si el código existe en el plan viejo y fue aprobado, y NO está en excluidos
            // y no fue ya mapeado por una regla explícita
            if (baseNewProgreso[newCode] !== "aprobada") {
                if (!excludedCodes.has(newCode) && isApprovedInOld(newCode)) {
                    baseNewProgreso[newCode] = "aprobada";
                }
            }
        });

        // Una vez que tenemos las aprobaciones crudas mapeadas, 
        // pasamos el progreso por el evaluador de reglas para desbloquear
        // las materias disponibles, cursando, etc.
        const ucAdicionales = calcularUCPensumAnterior(pensumAnterior, rulesData);
        const evaluatedProgreso = this.evaluator.evaluate(baseNewProgreso, newGraph, ucAdicionales);

        return {
            newProgreso: evaluatedProgreso,
            pensumAnterior
        };
    }
}
