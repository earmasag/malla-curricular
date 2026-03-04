import type { MateriaNode, ProgresoMalla } from "../types/materia";
import type { MallaCurricularGraph } from "../core/MallaCurricularGraph";
import type { ISchedulingStrategy } from "../strategies/ISchedulingStrategy";
import type { IMallaEvaluator } from "../rules/IMallaEvaluator";

export class PathfindingService {
    public graph: MallaCurricularGraph;
    public evaluator: IMallaEvaluator;
    public strategy: ISchedulingStrategy;

    constructor(
        graph: MallaCurricularGraph,
        evaluator: IMallaEvaluator,
        strategy: ISchedulingStrategy
    ) {
        this.graph = graph;
        this.evaluator = evaluator;
        this.strategy = strategy;
    }

    /**
     * Algoritmo de recorrido topológico que simula cursar todas las materias
     * "disponibles" de golpe en bloques sucesivos (semestres) hasta completar la malla.
     */
    public calcularRutaOptima(
        progresoActual: ProgresoMalla,
        maxUcPorSemestre: number = Infinity,
        maxMateriasPorSemestre: number = Infinity,
        maxHorasPorSemestre: number = Infinity
    ): string[][] {

        let simulacion = { ...progresoActual };
        const bloquesOptimos: string[][] = [];

        // Por seguridad contra grafos cíclicos teóricos (deadlock), limitamos las iteraciones
        const maxIteraciones = this.graph.getAllNodes().length;
        let iteracion = 0;

        while (iteracion < maxIteraciones) {
            // 1. Identificar materias disponibles en esta "ventana de tiempo"
            const disponiblesEnEsteBloque = this.graph.getAllNodes().filter(
                m => simulacion[m.codigoMateria] === "disponible"
            );

            // Si no hay nada disponible, terminamos (malla terminada o deadlock por falta de UC)
            if (disponiblesEnEsteBloque.length === 0) {
                break;
            }

            // 2. Extraer los códigos para el bloque final respetando los límites
            // USANDO LA ESTRATEGIA DE ORDENAMIENTO INYECTADA
            const materiasOrdenadas = this.strategy.sort(disponiblesEnEsteBloque, this.graph);

            const bloquePendiente: string[] = [];
            let ucAcumuladasBloque = 0;
            let horasAcumuladasBloque = 0;

            for (const materia of materiasOrdenadas) {
                // Función auxiliar para revisar si se puede meter una materia dada
                const puedeInsertar = (m: MateriaNode) => {
                    return !bloquePendiente.includes(m.codigoMateria) &&
                        bloquePendiente.length < maxMateriasPorSemestre &&
                        (ucAcumuladasBloque + m.unidadesCredito) <= maxUcPorSemestre &&
                        (horasAcumuladasBloque + (m.horasTotales - m.horasAutonomas)) <= maxHorasPorSemestre;
                };

                const insertar = (m: MateriaNode) => {
                    bloquePendiente.push(m.codigoMateria);
                    ucAcumuladasBloque += m.unidadesCredito;
                    horasAcumuladasBloque += (m.horasTotales - m.horasAutonomas);
                };

                // Validamos si la materia necesita de un correquisito que NO ESTÁ APROBADO todavía
                let correqsAprobados = true;
                const correqsPendientes: MateriaNode[] = [];
                for (let codCorreq of this.graph.getCorrequisitos(materia.codigoMateria)) {
                    if (simulacion[codCorreq] !== "aprobada") {
                        const mCorreq = this.graph.getNode(codCorreq);
                        if (mCorreq && !bloquePendiente.includes(codCorreq)) {
                            correqsPendientes.push(mCorreq);
                            correqsAprobados = false;
                        }
                    }
                }

                if (correqsAprobados) {
                    if (puedeInsertar(materia)) insertar(materia);
                } else {
                    // Tratar de insertar ambas
                    // Proyección mental de lo que añadirán los correquisitos y la materia misma
                    let projectedItems = 1 + correqsPendientes.length;
                    let projectedUC = materia.unidadesCredito;
                    let projectedHoras = materia.horasTotales - materia.horasAutonomas;

                    for (const reqP of correqsPendientes) {
                        projectedUC += reqP.unidadesCredito;
                        projectedHoras += (reqP.horasTotales - reqP.horasAutonomas);
                    }

                    if (
                        (bloquePendiente.length + projectedItems) <= maxMateriasPorSemestre &&
                        (ucAcumuladasBloque + projectedUC) <= maxUcPorSemestre &&
                        (horasAcumuladasBloque + projectedHoras) <= maxHorasPorSemestre
                    ) {
                        // Insertar ambos
                        insertar(materia);
                        correqsPendientes.forEach(c => insertar(c));
                    }
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
            // USANDO EL EVALUADOR INYECTADO
            simulacion = this.evaluator.evaluate(simulacion, this.graph);

            iteracion++;
        }

        return bloquesOptimos;
    }
}
