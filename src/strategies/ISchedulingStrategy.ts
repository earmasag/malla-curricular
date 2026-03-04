import type { MateriaNode } from "../types/materia";
import type { MallaCurricularGraph } from "../core/MallaCurricularGraph";

export interface ISchedulingStrategy {
    sort(available: MateriaNode[], graph: MallaCurricularGraph): MateriaNode[];
}
