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
                for (const requisitoNombre of materia.prelacion) {
                    // Ignoramos "Ingreso" ya que no es una materia real
                    if (requisitoNombre !== "Ingreso") {
                        const codigoRequisito = nameToCode[requisitoNombre.trim()];
                        if (codigoRequisito) {
                            this.graph.addEdge(materia.codigoMateria, codigoRequisito);
                        } else {
                            console.warn(`Advertencia: No se encontró el código para el prerrequisito "${requisitoNombre}" de la materia "${materia.nombre}".`);
                        }
                    }
                }
            }
        }

        return this.graph;
    }

    private createNode(materia: MateriaJSON): MateriaNode {
        // Extraemos 'prelacion' para no incluirla en el MateriaNode final
        const { prelacion, ...materiaBase } = materia;
        return {
            ...materiaBase,
            estado: "disponible"
        };
    }
}