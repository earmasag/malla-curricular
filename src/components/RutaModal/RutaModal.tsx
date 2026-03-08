import React from 'react';
import { Map as MapPath, Wrench, X } from 'lucide-react';
import type { MallaCurricularGraph } from '../../core/MallaCurricularGraph';
import { useRutaOptima } from '../../hooks/useRutaOptima';
import { BloqueEstudioCard } from './BloqueEstudioCard';
import { FiltrosRutaOptimaButton, FiltrosRutaOptimaPanel } from './FiltrosRutaOptima';

interface RutaModalProps {
    isOpen: boolean;
    onClose: () => void;
    generarRutaOptima: (maxUcPorSemestre?: number, maxMateriasPorSemestre?: number, maxHorasPorSemestre?: number) => string[][];
    grafo: MallaCurricularGraph;
    customRoute?: string[][] | null;
    optimaRuta?: string[][] | null;
}

export const RutaModal: React.FC<RutaModalProps> = ({ isOpen, onClose, generarRutaOptima, grafo, customRoute, optimaRuta: initialOptimaRuta }) => {

    const { estado, acciones } = useRutaOptima(isOpen, generarRutaOptima);

    const [isFiltrosOpen, setIsFiltrosOpen] = React.useState(false);

    if (!isOpen) return null;

    // Usar la ruta personalizada si se proporciona, si no, usar la óptima generada (o la inicial prop)
    const rutaParaMostrar = customRoute || estado.ruta || initialOptimaRuta || [];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden animate-fade-in-up">

                {/* Header Dinámico */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-6 py-4 bg-gray-50 border-b border-gray-100">
                    <div className="flex items-center gap-4">
                        <h2 className="text-2xl font-black text-gray-800 flex items-center gap-2">
                            {customRoute ? <Wrench className="w-6 h-6 text-purple-500" /> : <MapPath className="w-6 h-6 text-blue-500" />} {customRoute ? 'Tu Ruta Personalizada' : 'Ruta Óptima'}
                        </h2>
                        {!customRoute && (
                            <FiltrosRutaOptimaButton
                                isOpen={isFiltrosOpen}
                                setIsOpen={setIsFiltrosOpen}
                            />
                        )}
                    </div>

                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-200 rounded-full transition-colors self-end sm:self-auto shrink-0"
                        title="Cerrar"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Filtros Accordion Panel */}
                {!customRoute && (
                    <FiltrosRutaOptimaPanel
                        isOpen={isFiltrosOpen}
                        maxUcInput={estado.maxUcInput} setMaxUcInput={acciones.setMaxUcInput}
                        maxMateriasInput={estado.maxMateriasInput} setMaxMateriasInput={acciones.setMaxMateriasInput}
                        maxHorasInput={estado.maxHorasInput} setMaxHorasInput={acciones.setMaxHorasInput}
                    />
                )}

                {/* Body (Scrollable) */}
                <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50">
                    {rutaParaMostrar.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                            <p className="text-lg font-medium">¡Felicidades!</p>
                            <p>Has completado o tienes disponibles los requisitos para finalizar toda la malla académica.</p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-6 relative">
                            {/* Línea conectora de la línea de tiempo */}
                            <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-blue-200 hidden sm:block"></div>

                            {rutaParaMostrar.map((bloque: string[], index: number) => (
                                <BloqueEstudioCard
                                    key={index}
                                    bloque={bloque}
                                    index={index}
                                    grafo={grafo}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
