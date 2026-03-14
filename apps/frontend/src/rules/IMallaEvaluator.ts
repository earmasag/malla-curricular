import type { ProgresoMalla } from "../types/materia";
import type { MallaCurricularGraph } from "../core/MallaCurricularGraph";

export interface IMallaEvaluator {
    evaluate(progresoBase: ProgresoMalla, grafo: MallaCurricularGraph): ProgresoMalla;
}
