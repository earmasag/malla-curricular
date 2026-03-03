import type { MateriaNode, ProgresoMalla } from "../types/materia";
import { evaluarMalla } from "./evaluarMalla";

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

    /**
     * Algoritmo de recorrido topológico (Basado en Kahn) que simula cursar todas las materias
     * "disponibles" de golpe en bloques sucesivos (semestres) hasta completar la malla.
     */
    calcularRutaOptima(progresoActual: ProgresoMalla, maxUcPorSemestre: number = Infinity, maxMateriasPorSemestre: number = Infinity, maxHorasPorSemestre: number = Infinity): string[][] {
        let simulacion = { ...progresoActual };
        const bloquesOptimos: string[][] = [];

        // Por seguridad contra grafos cíclicos teóricos (deadlock), limitamos las iteraciones
        const maxIteraciones = this.nodes.size;
        let iteracion = 0;

        while (iteracion < maxIteraciones) {
            // 1. Identificar materias disponibles en esta "ventana de tiempo"
            const disponiblesEnEsteBloque = this.getAllNodes().filter(
                m => simulacion[m.codigoMateria] === "disponible"
            );

            // Si no hay nada disponible, terminamos (malla terminada o deadlock por falta de UC)
            if (disponiblesEnEsteBloque.length === 0) {
                break;
            }

            // [NUEVO] Estrategia Codiciosa (Greedy): Ordenar las disponibles según cuántas materias desbloquean a futuro
            // Esto prioriza destrabar ramas largas (cuellos de botella)
            disponiblesEnEsteBloque.sort((a, b) => {
                const unlocksA = this.getMateriasQueDesbloquea(a.codigoMateria).length;
                const unlocksB = this.getMateriasQueDesbloquea(b.codigoMateria).length;
                return unlocksB - unlocksA; // Mayor a menor
            });

            // 2. Extraer los códigos para el bloque final respetando los límites
            const bloquePendiente: string[] = [];
            let ucAcumuladasBloque = 0;
            let horasAcumuladasBloque = 0;

            for (const materia of disponiblesEnEsteBloque) {
                if (
                    bloquePendiente.length < maxMateriasPorSemestre &&
                    (ucAcumuladasBloque + materia.unidadesCredito) <= maxUcPorSemestre &&
                    (horasAcumuladasBloque + materia.horasTotales) <= maxHorasPorSemestre
                ) {
                    bloquePendiente.push(materia.codigoMateria);
                    ucAcumuladasBloque += materia.unidadesCredito;
                    horasAcumuladasBloque += materia.horasTotales - materia.horasAutonomas;
                }
            }

            if (bloquePendiente.length === 0) {
                console.warn("Deadlock en ruta óptima: Límites demasiado estrictos para avanzar.");
                break; // Evitar loop infinito
            }

            bloquesOptimos.push(bloquePendiente);

            // 3. Aprobar forzosamente todas las materias de este sub-bloque filtrado
            bloquePendiente.forEach(codigo => {
                simulacion[codigo] = "aprobada";
            });

            // 4. Reevaluar la malla entera para desbloquear el siguiente bloque
            simulacion = evaluarMalla(simulacion, this);

            iteracion++;
        }

        return bloquesOptimos;
    }
}