import type { MateriaNode, ProgresoMalla } from "../types/materia";

export class MallaCurricularGraph {
    private nodes: Map<string, MateriaNode> = new Map();
    private materiasRequeridas: Map<string, string[]> = new Map();
    private materiasQueDesbloquea: Map<string, string[]> = new Map();
    private materiasCorrequisito: Map<string, string[]> = new Map();
    private maxSemestre: number = 0;

    addNode(materia: MateriaNode) {
        this.nodes.set(materia.codigoMateria, materia);
        this.materiasRequeridas.set(materia.codigoMateria, []);
        this.materiasQueDesbloquea.set(materia.codigoMateria, []);
        this.materiasCorrequisito.set(materia.codigoMateria, []);
        if (materia.semestre > this.maxSemestre) this.maxSemestre = materia.semestre;
    }

    addEdge(codigoMateria: string, codigoPrerrequisito: string) {
        if (!this.nodes.has(codigoPrerrequisito)) {
            console.warn(`Advertencia: El prerrequisito ${codigoPrerrequisito} definido para ${codigoMateria} no existe en las materias.`);
        }

        this.materiasRequeridas.get(codigoMateria)?.push(codigoPrerrequisito);
        this.materiasQueDesbloquea.get(codigoPrerrequisito)?.push(codigoMateria);
    }

    addCorrequisito(codigoMateria: string, codigoCorrequisito: string) {
        if (!this.nodes.has(codigoCorrequisito)) {
            console.warn(`Advertencia: El correquisito ${codigoCorrequisito} definido para ${codigoMateria} no existe en las materias.`);
        }

        this.materiasCorrequisito.get(codigoMateria)?.push(codigoCorrequisito);
    }

    getMateriasRequeridas(codigoMateria: string): string[] {
        return this.materiasRequeridas.get(codigoMateria) || [];
    }

    getCorrequisitos(codigoMateria: string): string[] {
        return this.materiasCorrequisito.get(codigoMateria) || [];
    }

    getMateriasQueDesbloquea(codigoMateria: string): string[] {
        return this.materiasQueDesbloquea.get(codigoMateria) || [];
    }

    getNode(codigoMateria: string): MateriaNode | undefined {
        return this.nodes.get(codigoMateria);
    }

    getMateriasPorSemestre(semestre: number): MateriaNode[] {
        return Array.from(this.nodes.values()).filter(materia => materia.semestre === semestre);
    }

    getTotalSemestres(): number {
        return this.maxSemestre;
    }

    getAllNodes(): MateriaNode[] {
        return Array.from(this.nodes.values());
    }

    /**
     * Calcula qué materias específicas faltan por aprobar para desbloquear un nodo.
     * @param codigoMateria Código de la materia a evaluar
     * @param progresoActual Estado actual de la malla del estudiante
     * @returns Array de objetos {codigo, nombre} de las materias faltantes
     */
    obtenerPrerrequisitosFaltantes(codigoMateria: string, progresoActual: ProgresoMalla): { codigo: string; nombre: string }[] {
        const nodo = this.nodes.get(codigoMateria);
        if (!nodo) return [];

        // Filtramos las materias requeridas que NO estén marcadas como 'aprobada'
        const requisitosCodigos = this.getMateriasRequeridas(codigoMateria);
        const faltantesCodigos = requisitosCodigos.filter(reqCodigo => progresoActual[reqCodigo] !== 'aprobada');

        // Mapeamos a un objeto útil compuesto
        return faltantesCodigos.map(reqCodigo => {
            const reqNodo = this.nodes.get(reqCodigo);
            return {
                codigo: reqCodigo,
                nombre: reqNodo ? reqNodo.nombre : reqCodigo
            };
        });
    }

}