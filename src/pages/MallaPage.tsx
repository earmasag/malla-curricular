import planEstudioJSON from '../data/plan_estudio.json';
import { useMallaCurricular } from '../hooks/useMallaCurricular';
import { MallaCurricularBuilder } from '../core/MallaCurricularBuilder';
import type { MateriaJSON } from '../types/materia';
import { SemestreColumn } from '../components/SemestreColumn/SemestreColumn';
import MallaConnections from '../components/MallaConnections/MallaConnections';
import React from 'react';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { Xwrapper, useXarrow } from 'react-xarrows';


const builder = new MallaCurricularBuilder();
const materiaData = planEstudioJSON as unknown as MateriaJSON[];
const malla = builder.build(materiaData);


const MallaContent = () => {
    const { progreso, cantidadAprobadas, ucAcumuladas, toggleAprobacion, toggleSemestre, resetProgreso } = useMallaCurricular(malla);
    const [hoveredMateria, setHoveredMateria] = React.useState<string | null>(null);

    // Detectar si es móvil para deshabilitar el zoom con la rueda del ratón en escritorio
    const [isMobile, setIsMobile] = React.useState(window.innerWidth < 768);

    // Obtener la función para recalcular las flechas de react-xarrows manualmente
    const updateXarrow = useXarrow();

    React.useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // 1. Array de los números de semestre [1, 2, 3...]
    const totalSemestres = malla.getTotalSemestres();
    const semestresArray = Array.from({ length: totalSemestres }, (_, i) => i + 1);

    const handleResetProgreso = () => {
        if (window.confirm("¿Estás seguro que deseas borrar todo tu progreso? Esta acción no se puede deshacer.")) {
            resetProgreso();
        }
    };

    return (
        <div className="flex relative h-screen w-screen bg-gray-100 font-sans m-0 overflow-hidden">

            {/* Cabecera / Dashboard (Flotante) */}
            <header className="absolute top-6 left-0 right-0 z-50 flex flex-col items-center pointer-events-none">
                <h1 className="text-4xl font-black text-gray-800 mb-4 drop-shadow-sm">Mi Malla Curricular</h1>
                <div className="flex justify-center flex-wrap gap-4 md:gap-8 text-lg font-semibold text-gray-700 pointer-events-auto">
                    <div className="bg-white/90 backdrop-blur-sm px-6 py-3 rounded-2xl shadow-md border border-gray-200/50 transition-transform hover:scale-105 flex items-center">
                        📚 Materias Aprobadas: <span className="text-blue-600 ml-2">{cantidadAprobadas}</span>
                    </div>
                    <div className="bg-white/90 backdrop-blur-sm px-6 py-3 rounded-2xl shadow-md border border-gray-200/50 transition-transform hover:scale-105 flex items-center">
                        ⭐ UC Acumuladas: <span className="text-blue-600 ml-2">{ucAcumuladas}</span>
                    </div>
                    <button
                        onClick={handleResetProgreso}
                        className="bg-red-50/90 backdrop-blur-sm text-red-600 hover:bg-red-500 hover:text-white px-6 py-3 rounded-2xl shadow-md border border-red-200 transition-all hover:scale-105 flex items-center group"
                        title="Borrar todo el historial"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 mr-2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                        Borrar Progreso
                    </button>
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

                    // Aseguramos que las flechas se redibujen interactivamente al mover la cámara
                    onTransformed={updateXarrow}
                    onPanning={updateXarrow}
                    onZoom={updateXarrow}
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

                            {/* Overlay de Flechas, movido fuera del contenedor escalable para evitar el bug del doble escalado (css scale + boudning rect) */}
                            <MallaConnections grafo={malla} progreso={progreso} hoveredMateria={hoveredMateria} />

                            <TransformComponent wrapperStyle={{ width: "100%", height: "100%" }}>
                                <div className="relative flex flex-row gap-12 px-20 items-start pb-32 pt-32 min-w-max min-h-max">

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
                                                onToggleSemestre={toggleSemestre}
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

// Necesario envolver el sistema de renderizado de react-xarrows dentro de su contexto global
// para que useXarrow() pueda solicitar un repintado síncrono en todos los lugares donde existan flechas
export const MallaPage = () => (
    <Xwrapper>
        <MallaContent />
    </Xwrapper>
);
