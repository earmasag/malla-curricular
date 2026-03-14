import type { MateriaJSON, MateriaNode } from "../types/materia";
import { MallaCurricularGraph } from "./MallaCurricularGraph";

export class MallaCurricularBuilder {
    private graph: MallaCurricularGraph;

    constructor() {
        this.graph = new MallaCurricularGraph();
    }

    build(materias: MateriaJSON[]) {
        // Reiniciamos el grafo en cada llamado para evitar que datos anteriores queden en memoria.
        this.graph = new MallaCurricularGraph();
        const nameToCode: Record<string, string> = {};

        // 1. Primera pasada: Agregar todos los nodos al grafo
        for (const materia of materias) {
            const materiaNode = this.createNode(materia);
            this.graph.addNode(materiaNode);
            // Guardamos el nombre para buscar su código después
            nameToCode[materia.nombre.trim()] = materia.codigoMateria;
        }

        // 2. Segunda pasada: Establecer las conexiones (aristas)
        for (const materia of materias) {
            if (materia.prelacion && Array.isArray(materia.prelacion)) {
                for (const codigoRequisito of materia.prelacion) {
                    if (this.graph.getNode(codigoRequisito)) {
                        this.graph.addEdge(materia.codigoMateria, codigoRequisito);
                    } else {
                        console.warn(`Advertencia: No se encontró la materia para el prerrequisito con código "${codigoRequisito}" de la materia "${materia.nombre}".`);
                    }
                }
            }
            if (materia.correquisito && Array.isArray(materia.correquisito)) {
                for (const codigoCorrequisito of materia.correquisito) {
                    if (this.graph.getNode(codigoCorrequisito)) {
                        this.graph.addCorrequisito(materia.codigoMateria, codigoCorrequisito);
                    } else {
                        console.warn(`Advertencia: No se encontró la materia para el correquisito con código "${codigoCorrequisito}" de la materia "${materia.nombre}".`);
                    }
                }
            }
        }

        return this.graph;
    }

    private createNode(materia: MateriaJSON): MateriaNode {
        // Extraemos 'prelacion' y 'correquisito' para no incluirlas en el MateriaNode final
        const { prelacion, correquisito, ...materiaBase } = materia;
        return {
            ...materiaBase,
            estado: "disponible"
        };
    }
}