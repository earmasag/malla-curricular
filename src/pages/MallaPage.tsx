import planEstudioJSON from '../data/plan_estudio.json';
import { useMallaCurricular } from '../hooks/useMallaCurricular';
import { MallaCurricularBuilder } from '../core/MallaCurricularBuilder';
import type { MateriaJSON } from '../types/materia';
import { SemestreColumn } from '../components/SemestreColumn/SemestreColumn';
import MallaConnections from '../components/MallaConnections/MallaConnections';
import React from 'react';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";


const builder = new MallaCurricularBuilder();
const materiaData = planEstudioJSON as unknown as MateriaJSON[];
const malla = builder.build(materiaData);


export const MallaPage = () => {
    const { progreso, cantidadAprobadas, ucAcumuladas, toggleAprobacion } = useMallaCurricular(malla);
    const [hoveredMateria, setHoveredMateria] = React.useState<string | null>(null);

    // Detectar si es móvil para deshabilitar el zoom con la rueda del ratón en escritorio
    const [isMobile, setIsMobile] = React.useState(window.innerWidth < 768);

    React.useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // 1. Array de los números de semestre [1, 2, 3...]
    const totalSemestres = malla.getTotalSemestres();
    const semestresArray = Array.from({ length: totalSemestres }, (_, i) => i + 1);

    return (
        <div className="flex relative h-screen w-screen bg-gray-50 font-sans m-0 overflow-hidden">

            {/* Cabecera / Dashboard (Flotante) */}
            <header className="absolute top-6 left-0 right-0 z-50 flex flex-col items-center pointer-events-none">
                <h1 className="text-4xl font-black text-gray-800 mb-4 drop-shadow-sm">Mi Malla Curricular</h1>
                <div className="flex justify-center gap-8 text-lg font-semibold text-gray-700 pointer-events-auto">
                    <div className="bg-white/90 backdrop-blur-sm px-6 py-3 rounded-2xl shadow-md border border-gray-200/50 transition-transform hover:scale-105">
                        📚 Materias Aprobadas: <span className="text-blue-600">{cantidadAprobadas}</span>
                    </div>
                    <div className="bg-white/90 backdrop-blur-sm px-6 py-3 rounded-2xl shadow-md border border-gray-200/50 transition-transform hover:scale-105">
                        ⭐ UC Acumuladas: <span className="text-blue-600">{ucAcumuladas}</span>
                    </div>
                </div>
            </header>

            {/* Main Content Area (Grilla Horizontal Libre de Zoom y Paneo) */}
            <div className="w-full h-full relative cursor-grab active:cursor-grabbing">
                <TransformWrapper
                    initialScale={1}
                    minScale={0.3}
                    maxScale={2}
                    centerOnInit={true}
                    wheel={{ step: 0.1, disabled: !isMobile }}
                    pinch={{ disabled: false }} // Pinch-to-zoom (táctil o macpad) siempre habilitado
                    limitToBounds={true}
                    disablePadding={true}
                    panning={{ velocityDisabled: true }}
                    alignmentAnimation={{ animationTime: 0, animationType: "linear" }}
                >
                    {({ zoomIn, zoomOut, resetTransform }) => (
                        <React.Fragment>
                            {/* Botones de Control de Zoom (Flotantes Inferior Derecha) */}
                            <div className="absolute bottom-8 right-8 z-50 flex flex-col gap-3 pointer-events-auto">
                                <button onClick={() => zoomIn()} className="flex items-center justify-center w-12 h-12 bg-white/90 backdrop-blur text-gray-700 hover:text-blue-600 hover:bg-white rounded-full shadow-lg border border-gray-200 transition-all hover:scale-110" title="Acercar">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                                </button>
                                <button onClick={() => zoomOut()} className="flex items-center justify-center w-12 h-12 bg-white/90 backdrop-blur text-gray-700 hover:text-blue-600 hover:bg-white rounded-full shadow-lg border border-gray-200 transition-all hover:scale-110" title="Alejar">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" /></svg>
                                </button>
                                <button onClick={() => resetTransform()} className="flex items-center justify-center w-12 h-12 bg-white/90 backdrop-blur text-gray-700 hover:text-blue-600 hover:bg-white rounded-full shadow-lg border border-gray-200 transition-all hover:scale-110" title="Restablecer vista">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" /></svg>
                                </button>
                            </div>

                            <TransformComponent wrapperStyle={{ width: "100%", height: "100%" }}>
                                <div className="relative flex flex-row gap-12 px-20 items-start pb-32 pt-32 min-w-max min-h-max">
                                    {/* Flechas de Prerrequisitos dibujadas por debajo de las materias */}
                                    <MallaConnections grafo={malla} progreso={progreso} hoveredMateria={hoveredMateria} />

                                    {semestresArray.map((numeroSemestre) => {
                                        // Le pedimos al Grafo solo las materias de esta columna
                                        const materiasDelSemestre = malla.getMateriasPorSemestre(numeroSemestre).sort((a, b) => b.areaFormacion.localeCompare(a.areaFormacion));

                                        return (
                                            <SemestreColumn
                                                key={`semestre-${numeroSemestre}`}
                                                numeroSemestre={numeroSemestre}
                                                materiasDelSemestre={materiasDelSemestre}
                                                progreso={progreso}
                                                onSelectMateria={toggleAprobacion}
                                                onHoverMateria={setHoveredMateria}
                                                hoveredMateria={hoveredMateria}
                                            />
                                        );
                                    })}
                                </div>
                            </TransformComponent>
                        </React.Fragment>
                    )}
                </TransformWrapper>
            </div>
        </div>
    );
};
