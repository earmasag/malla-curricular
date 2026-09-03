import React from 'react';
import { Map as MapPath, Wrench } from 'lucide-react';
import type { MallaCurricularGraph } from '../../../core/MallaCurricularGraph';
import { useRutaOptima } from '../../../hooks/malla/useRutaOptima';
import { BloqueEstudioCard } from './BloqueEstudioCard';
import { FiltrosRutaOptimaButton, FiltrosRutaOptimaPanel } from './FiltrosRutaOptima';
import { ModalHeader } from '../shared/ModalHeader';
import { AnimatedModalWrapper } from '../shared/AnimatedModalWrapper';

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

    // Usar la ruta personalizada si se proporciona, si no, usar la óptima generada (o la inicial prop)
    const rutaParaMostrar = customRoute || estado.ruta || initialOptimaRuta || [];

    return (
        <AnimatedModalWrapper className="bg-white rounded-2xl shadow-xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden">
            <ModalHeader 
                title={customRoute ? 'Tu Ruta Personalizada' : 'Ruta Óptima'}
                icon={customRoute ? <Wrench /> : <MapPath />}
                onClose={onClose}
                rightContent={
                    !customRoute ? (
                        <FiltrosRutaOptimaButton
                            isOpen={isFiltrosOpen}
                            setIsOpen={setIsFiltrosOpen}
                        />
                    ) : null
                }
            />

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
                        <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-theme-500 hidden sm:block"></div>

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
        </AnimatedModalWrapper>
    );
};
