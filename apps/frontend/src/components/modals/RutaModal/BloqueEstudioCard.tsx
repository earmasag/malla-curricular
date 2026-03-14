import React from 'react';
import type { MallaCurricularGraph } from '../../../core/MallaCurricularGraph';
import MateriaCard from '../../malla/MateriaCard';
import { MatriculaService, type StudentProfile, type MateriaMatricula } from '../../../services/MatriculaService';
import { Info } from 'lucide-react';

const matriculaService = new MatriculaService();

// Default profile for estimations. Users can change this in a real app via settings.
const defaultProfile: StudentProfile = {
    esSedeGuayana: true,
    carrera: "sinDescuento",
    esAlumnoNuevo: false,
    aplicaRetraso: false,
    esIntensivo: false
};

interface BloqueEstudioCardProps {
    bloque: string[];
    index: number;
    grafo: MallaCurricularGraph;
}

export const BloqueEstudioCard: React.FC<BloqueEstudioCardProps> = ({ bloque, index, grafo }) => {
    let ucBloque = 0;
    let horasBloque = 0;
    const materiasMatricula: MateriaMatricula[] = [];

    bloque.forEach((codigo) => {
        const nodo = grafo.getNode(codigo);
        if (nodo) {
            ucBloque += nodo.unidadesCredito || 0;
            horasBloque += nodo.horasTotales - nodo.horasAutonomas || 0;

            // Cast properties explicitly for the cost calculator.
            materiasMatricula.push({
                ...nodo,
                estado: "disponible",
                esTSU: false, // Defaulting logic. Can be mapped if graphto supports it.
                esElectivaEspecialHumanidades: false,
            });
        }
    });

    const desgloseInscripcion = matriculaService.calcularDesglose(materiasMatricula, defaultProfile);

    return (
        <div className="relative flex flex-col sm:flex-row gap-4 sm:gap-6 items-start">
            {/* Timeline Dot (Solo visible en Desktop/Tablet) */}
            <div className="hidden sm:flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 border-4 border-white shadow-sm z-10 shrink-0 text-blue-600 font-bold">
                {index + 1}
            </div>

            {/* Card del Bloque */}
            <div className="flex-1 bg-white border border-gray-100 rounded-xl shadow-sm p-5 hover:shadow-md transition-shadow min-w-0 w-full">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-2 border-b border-gray-50 pb-3 gap-3">
                    <h3 className="text-lg font-bold text-gray-800 flex flex-wrap items-center gap-2">
                        Bloque de Estudio {index + 1}

                        {/* Cost Estimation Badge */}
                        <div className="group relative flex items-center shrink-0">
                            <span className="bg-green-50 text-green-700 text-xs font-bold px-2 py-1 rounded border border-green-200 flex items-center gap-1 cursor-help">
                                Est. ${desgloseInscripcion.totalFinal.toFixed(2)}
                                <Info className="w-3 h-3" />
                            </span>

                            {/* Tooltip for Installments */}
                            <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-64 bg-gray-900 text-white text-xs rounded-lg p-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20 shadow-xl pointer-events-none">
                                <p className="font-bold border-b border-gray-700 pb-1 mb-2 text-green-400">Desglose Estimado:</p>
                                <ul className="space-y-1">
                                    <li className="flex justify-between"><span>Materias:</span> <span>${desgloseInscripcion.costoMaterias.toFixed(2)}</span></li>
                                    <li className="flex justify-between"><span>Inscripción:</span> <span>${desgloseInscripcion.derechoInscripcion.toFixed(2)}</span></li>
                                </ul>
                                <p className="font-bold border-b border-gray-700 pb-1 mt-2 mb-2 text-blue-300">Plan de Pagos:</p>
                                <ul className="space-y-1 text-gray-300">
                                    {desgloseInscripcion.pagosMensuales.map((pago, i) => (
                                        <li key={i} className="flex justify-between">
                                            <span>Cuota {i + 1}:</span>
                                            <span className={i === 0 || i === 3 ? "text-blue-300 font-semibold" : ""}>${pago.toFixed(2)}</span>
                                        </li>
                                    ))}
                                </ul>
                                {/* Triangle arrow */}
                                <div className="absolute left-1/2 -translate-x-1/2 -top-1 border-4 border-transparent border-b-gray-900"></div>
                            </div>
                        </div>

                    </h3>
                    <div className="flex flex-wrap items-center gap-2 sm:justify-end shrink-0">
                        <span className="bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1 rounded-full border border-blue-100 whitespace-nowrap">
                            {bloque.length} Mat. • {horasBloque} Hrs • {ucBloque} UC
                        </span>
                    </div>
                </div>

                {/* Renderizado de MateriaCards escaladas para encajar */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-1 gap-x-2 w-full pt-2 items-center">
                    {bloque.map(codigo => {
                        const materia = grafo.getNode(codigo);
                        if (!materia) return null;

                        const materiaVisual = { ...materia, estado: "disponible" as const };

                        return (
                            <div key={codigo} className="flex items-center justify-center sm:justify-start overflow-visible h-20">
                                <div className="transform scale-[0.75] origin-center sm:origin-left transition-transform">
                                    <MateriaCard materia={materiaVisual} />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
