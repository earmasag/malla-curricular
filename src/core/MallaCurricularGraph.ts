import type { MateriaNode } from "../types/materia";

export class MallaCurricularGraph {
    private nodes: Map<string, MateriaNode> = new Map();
    private materiasRequeridas: Map<string, string[]> = new Map();
    private materiasQueDesbloquea: Map<string, string[]> = new Map();
    private maxSemestre: number = 0;

    addNode(materia: MateriaNode) {
        this.nodes.set(materia.codigoMateria, materia);
        this.materiasRequeridas.set(materia.codigoMateria, []);
        this.materiasQueDesbloquea.set(materia.codigoMateria, []);
        if (materia.semestre > this.maxSemestre) this.maxSemestre = materia.semestre;
    }

    addEdge(codigoMateria: string, codigoPrerrequisito: string) {
        if (!this.nodes.has(codigoPrerrequisito)) {
            console.warn(`Advertencia: El prerrequisito ${codigoPrerrequisito} definido para ${codigoMateria} no existe en las materias.`);
        }

        this.materiasRequeridas.get(codigoMateria)?.push(codigoPrerrequisito);
        this.materiasQueDesbloquea.get(codigoPrerrequisito)?.push(codigoMateria);
    }

    getMateriasRequeridas(codigoMateria: string): string[] {
        return this.materiasRequeridas.get(codigoMateria) || [];
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
}