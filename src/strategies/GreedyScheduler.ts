import type { MateriaNode } from "../types/materia";
import type { MallaCurricularGraph } from "../core/MallaCurricularGraph";
import type { ISchedulingStrategy } from "./ISchedulingStrategy";

export class GreedyScheduler implements ISchedulingStrategy {
    /**
     * Ordena las materias disponibles de forma codiciosa (Greedy).
     * Prioriza las materias basándose en cuántas materias futuras desbloquean.
     * Mayor cantidad de "unlocks" -> Mayor prioridad.
     */
    sort(available: MateriaNode[], graph: MallaCurricularGraph): MateriaNode[] {
        // Hacemos una copia para no mutar el array original (buena práctica)
        const sorted = [...available];

        sorted.sort((a, b) => {
            const unlocksA = graph.getMateriasQueDesbloquea(a.codigoMateria).length;
            const unlocksB = graph.getMateriasQueDesbloquea(b.codigoMateria).length;
            return unlocksB - unlocksA; // Orden descendente
        });

        return sorted;
    }
}
