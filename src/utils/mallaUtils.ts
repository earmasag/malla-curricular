import type { ProgresoMalla } from "../types/materia";
import type { MallaCurricularGraph } from "../core/MallaCurricularGraph";
import ajustesData from "../data/ajustes_pensum_viejo.json";

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

export const obtenerPrerrequisitosFaltantes = (codigoMateria: string, progresoActual: ProgresoMalla, grafo: MallaCurricularGraph): { codigo: string; nombre: string }[] => {
    const nodo = grafo.getNode(codigoMateria);
    if (!nodo) return [];

    const requisitosCodigos = grafo.getMateriasRequeridas(codigoMateria);
    const faltantesCodigos = requisitosCodigos.filter(reqCodigo => progresoActual[reqCodigo] !== 'aprobada');

    return faltantesCodigos.map(reqCodigo => {
        const reqNodo = grafo.getNode(reqCodigo);
        return {
            codigo: reqCodigo,
            nombre: reqNodo ? reqNodo.nombre : reqCodigo
        };
    });
};

export const obtenerCorrequisitosFaltantes = (codigoMateria: string, progresoActual: ProgresoMalla, grafo: MallaCurricularGraph): { codigo: string; nombre: string }[] => {
    const nodo = grafo.getNode(codigoMateria);
    if (!nodo) return [];

    const correqCodigos = grafo.getCorrequisitos(codigoMateria);
    const faltantesCodigos = correqCodigos.filter(correq => {
        const estado = progresoActual[correq];
        return estado !== 'aprobada' && estado !== 'cursando' && estado !== 'disponible';
    });

    return faltantesCodigos.map(correq => {
        const reqNodo = grafo.getNode(correq);
        return {
            codigo: correq,
            nombre: reqNodo ? reqNodo.nombre : correq
        };
    });
};

export const calcularUCPensumAnterior = (pensumAnterior: Record<string, boolean>): number => {
    let total = 0;
    // Ajuste: Si tiene ambos ingles, se le convalidó el nuevo (3 UC). 
    // Para "no anexar esas 3uc" del nuevo pensum, las restamos aquí.
    // Así el neto será exactamente 8 UC (4+4 del viejo + 3 del nuevo - 3 de ajuste).
    if (pensumAnterior['INFO-02014'] && pensumAnterior['INFO-02021']) {
        total -= 3;
    }

    ajustesData.forEach(ajuste => {
        if (pensumAnterior[ajuste.key]) {
            total += ajuste.uc;
        }
    });

    return total;
};
