import React from 'react';
import type { MallaCurricularGraph } from '../../core/MallaCurricularGraph';
import MateriaCard from '../MateriaCard/MateriaCard';

interface BloqueEstudioCardProps {
    bloque: string[];
    index: number;
    grafo: MallaCurricularGraph;
}

export const BloqueEstudioCard: React.FC<BloqueEstudioCardProps> = ({ bloque, index, grafo }) => {
    let ucBloque = 0;
    let horasBloque = 0;

    bloque.forEach((codigo) => {
        const nodo = grafo.getNode(codigo);
        if (nodo) {
            ucBloque += nodo.unidadesCredito || 0;
            horasBloque += nodo.horasTotales - nodo.horasAutonomas || 0;
        }
    });

    return (
        <div className="relative flex flex-col sm:flex-row gap-4 sm:gap-6 items-start">
            {/* Timeline Dot (Solo visible en Desktop/Tablet) */}
            <div className="hidden sm:flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 border-4 border-white shadow-sm z-10 shrink-0 text-blue-600 font-bold">
                {index + 1}
            </div>

            {/* Card del Bloque */}
            <div className="flex-1 bg-white border border-gray-100 rounded-xl shadow-sm p-5 hover:shadow-md transition-shadow min-w-0 w-full">
                <div className="flex items-center justify-between mb-2 border-b border-gray-50 pb-3">
                    <h3 className="text-lg font-bold text-gray-800">
                        Bloque de Estudio {index + 1}
                    </h3>
                    <span className="bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1 rounded-full border border-blue-100 whitespace-nowrap">
                        {bloque.length} Mat. • {horasBloque} Hrs • {ucBloque} UC
                    </span>
                </div>

                {/* Renderizado de MateriaCards escaladas para encajar */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-4 gap-x-2 w-full pt-2">
                    {bloque.map(codigo => {
                        const materia = grafo.getNode(codigo);
                        if (!materia) return null;

                        const materiaVisual = { ...materia, estado: "disponible" as const };

                        return (
                            <div key={codigo} className="transform scale-[0.80] origin-top-left -mb-6">
                                <MateriaCard materia={materiaVisual} />
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
