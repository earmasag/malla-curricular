import type { ProgresoMalla } from "../types/materia";
import type { MallaCurricularGraph } from "../core/MallaCurricularGraph";
import type { IMallaEvaluator } from "./IMallaEvaluator";
import { calcularUCAcumuladas } from "../utils/mallaUtils";

export class StandardMallaEvaluator implements IMallaEvaluator {
    // Función pura que reevalúa toda la malla hasta estabilizar todos los bloqueos y desbloqueos
    public evaluate(progresoBase: ProgresoMalla, grafo: MallaCurricularGraph): ProgresoMalla {
        const nuevoProgreso = { ...progresoBase };
        let cambiado = true;

        // Repetimos hasta que ningún estado cambie (efecto dominó global)
        while (cambiado) {
            cambiado = false;
            const ucActual = calcularUCAcumuladas(nuevoProgreso, grafo);

            for (const materia of grafo.getAllNodes()) {
                const cod = materia.codigoMateria;
                const estadoAnterior = nuevoProgreso[cod] || "bloqueada";

                const reqs = grafo.getMateriasRequeridas(cod);
                const correqs = grafo.getCorrequisitos(cod);
                const cumpleReqs = reqs.every(req => nuevoProgreso[req] === "aprobada");
                const cumpleCorreqs = correqs.length === 0 || correqs.every(req => nuevoProgreso[req] === "aprobada" || nuevoProgreso[req] === "disponible");
                const cumpleUC = ucActual >= materia.ucRequeridas;

                // Una materia está lista para cursarse si cumple pre-requisitos explícitos, correquisitos Y créditos (UC)
                const puedeCursarse = cumpleReqs && cumpleCorreqs && cumpleUC;

                if (estadoAnterior === "aprobada") {
                    // Si la teníamos aprobada pero perdió los requisitos (ej. perdimos UC o desaprobamos una prelativa)
                    if (!puedeCursarse) {
                        nuevoProgreso[cod] = "bloqueada";
                        cambiado = true;
                    }
                } else if (estadoAnterior === "disponible") {
                    // Si estaba disponible pero ya no cumple los requisitos
                    if (!puedeCursarse) {
                        nuevoProgreso[cod] = "bloqueada";
                        cambiado = true;
                    }
                } else if (estadoAnterior === "bloqueada") {
                    // Si estaba bloqueada pero ahora sí cumple todo
                    if (puedeCursarse) {
                        nuevoProgreso[cod] = "disponible";
                        cambiado = true;
                    }
                }
            }
        }
        return nuevoProgreso;
    }
}
