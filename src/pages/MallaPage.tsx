import React, { useMemo } from "react";
import { SemestreColumn } from "../components/malla/SemestreColumn";
import MallaConnections from "../components/malla/MallaConnections";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { Xwrapper, useXarrow } from "react-xarrows";

// Core y Datos
import { MallaCurricularBuilder } from "../core/MallaCurricularBuilder";
import planEstudioJSON from "../data/plan_estudio.json";

// Hook auxiliar
import { useIsMobile } from "../hooks/ui/useIsMobile";

// Provider
import { MallaProvider, useMallaData, useMallaUI } from "../contexts/MallaContexts";
import { NavigationSidebar } from "../components/layout/NavigationSidebar/NavigationSidebar";
import { ZoomControls } from "../components/ui/ZoomControls";
import { RutaModal } from "../components/modals/RutaModal/RutaModal";
import { MisRutasModal } from "../components/modals/MisRutasModal";
import { FeedbackModal } from "../components/modals/FeedbackModal";
import { MatriculaModal } from "../components/modals/MatriculaModal";
import { SettingsModal } from "../components/modals/SettingsModal";
import { LeyendaModal } from "../components/modals/LeyendaModal";
import { Settings, X } from "lucide-react";

// Datos estáticos
import areasColorData from '../data/areas_color.json';

const builder = new MallaCurricularBuilder();
const materiaData = planEstudioJSON as any; // Allow the builder to cast internally
const malla = builder.build(materiaData);

const MallaLayout = () => {
    // 1. Extraemos los Contextos Globales (Mitigación Prop Bloat)
    const { estadoMalla, estadoCustom, accionesMalla } = useMallaData();
    const { ui, modales, configuraciones, datos, handlers } = useMallaUI();

    const mallaContext = useMemo(() => builder.build(materiaData), []);

    // 2. Estado local para renders del componente (Zoom, Mobile, Flechas)
    const isMobile = useIsMobile();

    // 3. Helpers locales
    const updateXarrow = useXarrow();

    // 1. Array de los números de semestre [1, 2, 3...]
    const totalSemestres = mallaContext.getTotalSemestres();
    const semestresArray = Array.from(
        { length: totalSemestres },
        (_, i) => i + 1
    );

    // Determinar qué progreso usar visualmente en las cajas
    const activeProgreso = estadoCustom.isCustomRouteMode ? estadoCustom.customProgreso : estadoMalla.progreso;

    const materiasCursando = estadoCustom.isCustomRouteMode
        // En modo personalizado simulamos que no cursa nada
        ? []
        : estadoMalla.materiasCursando;

    const totalMaterias = mallaContext.getAllNodes().length;

    return (
        <div className="flex relative h-dvh w-dvw bg-gray-100 font-sans m-0 overflow-hidden text-gray-800 dark:bg-gray-900 dark:text-gray-100 transition-colors">
            {/* Botón Flotante Settings (Top Right, replaced Legend) */}
            <button
                onClick={() => modales.setIsSettingsOpen(!modales.isSettingsOpen)}
                className="absolute cursor-pointer top-4 right-4 md:top-6 md:right-6 z-50 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md p-3 rounded-full shadow-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-700 transition-all"
                title="Configuración"
            >
                {modales.isSettingsOpen ? <X className="w-6 h-6" /> : <Settings className="w-6 h-6" />}
            </button>

            <NavigationSidebar 
              totalMaterias={totalMaterias} 
            />

            <MatriculaModal
                isOpen={modales.isMatriculaModalOpen}
                onClose={() => modales.setIsMatriculaModalOpen(false)}
                materiasCursando={materiasCursando}
            />

            <MisRutasModal
                isOpen={modales.isMisRutasModalOpen}
                onClose={() => modales.setIsMisRutasModalOpen(false)}
                savedRoutes={datos.savedRoutesList}
                onViewRoute={handlers.handleViewSavedRoute}
                onDeleteRoute={handlers.handleDeleteSavedRoute}
            />

            <FeedbackModal
                isOpen={modales.isFeedbackModalOpen}
                onClose={() => modales.setIsFeedbackModalOpen(false)}
            />

            <SettingsModal
                isOpen={modales.isSettingsOpen}
                onClose={() => modales.setIsSettingsOpen(false)}
                configuraciones={configuraciones}
            />

            <LeyendaModal
                isOpen={ui.isLeyendaOpen}
                onClose={() => ui.setIsLeyendaOpen(false)}
                tituloCarrera="Ingeniería Informática"
                totalSemestres={totalSemestres}
                totalUc={mallaContext.getAllNodes().reduce((acc: number, curr: any) => acc + curr.unidadesCredito, 0)}
                areasFormacion={areasColorData}
            />

            <RutaModal
                isOpen={modales.isModalOpen}
                onClose={() => modales.setIsModalOpen(false)}
                generarRutaOptima={accionesMalla.generarRutaOptima}
                grafo={mallaContext}
                optimaRuta={datos.optimaRuta}
                customRoute={datos.customRouteResult}
            />

            {/* Main Content Area (Grilla Horizontal Libre de Zoom y Paneo) */}
            <div className="w-full h-full relative cursor-grab active:cursor-grabbing">
                <TransformWrapper
                    initialScale={0.8}
                    minScale={0.3}
                    maxScale={2}
                    centerOnInit={true}
                    wheel={{ step: 0.1, disabled: !configuraciones.zoomConRueda || isMobile }}
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
                            {!isMobile && <ZoomControls zoomIn={zoomIn} zoomOut={zoomOut} resetTransform={resetTransform} />}

                            {/* Overlay de Flechas, movido fuera del contenedor escalable para evitar el bug del doble escalado (css scale + boudning rect) */}
                            <MallaConnections
                                grafo={mallaContext}
                                progreso={activeProgreso}
                                hoveredMateria={ui.hoveredMateria}
                            />

                            <TransformComponent
                                wrapperStyle={{ width: "100%", height: "100%" }}
                            >
                                <div className="flex flex-col min-w-max min-h-max items-start">
                                    <div className="relative flex flex-row gap-12 px-20 pl-32 md:pl-32 items-start pt-20 pb-32 min-w-max min-h-max">
                                        {semestresArray.map((numeroSemestre) => {
                                            // Le pedimos al Grafo solo las materias de esta columna
                                            const materiasDelSemestre = mallaContext
                                                .getMateriasPorSemestre(numeroSemestre)
                                                .sort((a: any, b: any) =>
                                                    b.areaFormacion.localeCompare(a.areaFormacion)
                                                );

                                            return (
                                                <SemestreColumn
                                                    key={`semestre-${numeroSemestre}`}
                                                    numeroSemestre={numeroSemestre}
                                                    materiasDelSemestre={materiasDelSemestre}
                                                />
                                            );
                                        })}
                                    </div>
                                </div>
                            </TransformComponent>
                        </React.Fragment>
                    )}
                </TransformWrapper>
            </div>
        </div>
    );
};

export const MallaPage = () => (
    <Xwrapper>
        <MallaProvider grafo={malla}>
            <MallaLayout />
        </MallaProvider>
    </Xwrapper>
);
