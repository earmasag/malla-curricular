import React from 'react';
import type { MallaCurricularGraph } from '../../core/MallaCurricularGraph';
import MateriaCard from '../MateriaCard/MateriaCard';
import { useRutaOptima } from '../../hooks/useRutaOptima';

interface RutaModalProps {
    isOpen: boolean;
    onClose: () => void;
    generarRutaOptima: (maxUcPorSemestre?: number, maxMateriasPorSemestre?: number, maxHorasPorSemestre?: number) => string[][];
    grafo: MallaCurricularGraph;
}

export const RutaModal: React.FC<RutaModalProps> = ({ isOpen, onClose, generarRutaOptima, grafo }) => {

    const {
        maxUcInput,
        setMaxUcInput,
        maxMateriasInput,
        setMaxMateriasInput,
        maxHorasInput,
        setMaxHorasInput,
        ruta
    } = useRutaOptima(isOpen, generarRutaOptima);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden animate-fade-in-up">

                {/* Header Dinámico */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-6 py-4 bg-gray-50 border-b border-gray-100">
                    <h2 className="text-2xl font-black text-gray-800 flex items-center gap-2">
                        <span>🚀</span> Ruta Óptima
                    </h2>

                    <div className="flex flex-col sm:flex-row items-center gap-3 bg-white p-2 rounded-lg border border-gray-200 shadow-sm w-full sm:w-auto overflow-x-auto">
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                            <label className="text-sm font-semibold text-gray-600 whitespace-nowrap">Máx. UC:</label>
                            <input
                                type="number"
                                min="1"
                                placeholder="∞"
                                value={maxUcInput}
                                onChange={(e) => setMaxUcInput(e.target.value)}
                                className="w-16 sm:w-20 border border-gray-200 rounded-md px-2 py-1 text-sm focus:ring-2 focus:ring-blue-400 outline-none"
                            />
                        </div>
                        <div className="hidden sm:block w-px h-6 bg-gray-200"></div>
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                            <label className="text-sm font-semibold text-gray-600 whitespace-nowrap">Máx. Materias:</label>
                            <input
                                type="number"
                                min="1"
                                placeholder="∞"
                                value={maxMateriasInput}
                                onChange={(e) => setMaxMateriasInput(e.target.value)}
                                className="w-16 sm:w-20 border border-gray-200 rounded-md px-2 py-1 text-sm focus:ring-2 focus:ring-blue-400 outline-none"
                            />
                        </div>
                        <div className="hidden sm:block w-px h-6 bg-gray-200"></div>
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                            <label className="text-sm font-semibold text-gray-600 whitespace-nowrap">Máx. Horas:</label>
                            <input
                                type="number"
                                min="1"
                                placeholder="∞"
                                value={maxHorasInput}
                                onChange={(e) => setMaxHorasInput(e.target.value)}
                                className="w-16 sm:w-20 border border-gray-200 rounded-md px-2 py-1 text-sm focus:ring-2 focus:ring-blue-400 outline-none"
                            />
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-200 rounded-full transition-colors self-end sm:self-auto shrink-0"
                        title="Cerrar"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Body (Scrollable) */}
                <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50">
                    {ruta.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                            <p className="text-lg font-medium">¡Felicidades!</p>
                            <p>Has completado o tienes disponibles los requisitos para finalizar toda la malla académica.</p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-6 relative">
                            {/* Línea conectora de la línea de tiempo */}
                            <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-blue-200 hidden sm:block"></div>

                            {ruta.map((bloque, index) => {
                                // Calculamos las UC y Horas recomendadas para este bloque
                                let ucBloque = 0;
                                let horasBloque = 0;
                                bloque.forEach((codigo) => {
                                    const nodo = grafo.getNode(codigo);
                                    if (nodo) {
                                        ucBloque += nodo.unidadesCredito || 0;
                                        horasBloque += nodo.horasTotales || 0;
                                    }
                                });

                                return (
                                    <div key={index} className="relative flex flex-col sm:flex-row gap-4 sm:gap-6 items-start">

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
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
