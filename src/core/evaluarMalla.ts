import type { ProgresoMalla } from "../types/materia";
import { MallaCurricularGraph } from "./MallaCurricularGraph";

export const calcularUCAcumuladas = (progreso: ProgresoMalla, grafo: MallaCurricularGraph): number => {
    let total = 0;
    Object.entries(progreso).forEach(([codigo, estado]) => {
        if (estado === "aprobada") {
            const materia = grafo.getNode(codigo);
            if (materia) total += materia.unidadesCredito;
        }
    });
    return total;
};

// Función pura que reevalúa toda la malla hasta estabilizar todos los bloqueos y desbloqueos
export const evaluarMalla = (progresoBase: ProgresoMalla, grafo: MallaCurricularGraph): ProgresoMalla => {
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
            const cumpleReqs = reqs.every(req => nuevoProgreso[req] === "aprobada");
            const cumpleUC = ucActual >= materia.ucRequeridas;

            // Una materia está lista para cursarse si cumple pre-requisitos explícitos Y créditos (UC)
            const puedeCursarse = cumpleReqs && cumpleUC;

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
};
