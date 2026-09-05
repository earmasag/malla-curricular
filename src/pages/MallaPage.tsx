import React from "react";
import { SemestreColumn } from "../components/malla/SemestreColumn";
import MallaConnections from "../components/malla/MallaConnections";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
// Hook auxiliar
import { useIsMobile } from "../hooks/ui/useIsMobile";

// Provider
import { MallaProvider, useMallaData, useMallaUI, useMallaHover } from "../contexts/MallaContexts";
import { NavigationSidebar } from "../components/layout/NavigationSidebar/NavigationSidebar";
import { ZoomControls } from "../components/ui/ZoomControls";
import { RutaModal } from "../components/modals/RutaModal/RutaModal";
import { MisRutasModal } from "../components/modals/MisRutasModal";
import { FeedbackModal } from "../components/modals/FeedbackModal";
import { MatriculaModal } from "../components/modals/MatriculaModal";
import { SettingsModal } from "../components/modals/SettingsModal";
import { LeyendaModal } from "../components/modals/LeyendaModal";
import { PensumAnteriorModal } from "../components/modals/PensumAnteriorModal";
import { AnimatePresence } from "framer-motion";


import { usePlanEstudio } from "../contexts/PlanContext";
import { useCarrera } from "../contexts/CarreraContext";
import { WelcomeModal } from "../components/modals/WelcomeModal";
import { PlanSwitcherFloat } from "../components/layout/PlanSwitcherFloat";
import { ConstructorToolbar } from "../components/layout/ConstructorToolbar";
import { useTourPanHandler } from "../hooks/ui/useTourPanHandler";

const TourPanHandler = ({ zoomToElement, currentScale }: { zoomToElement: (node: HTMLElement | string, scale?: number, animationTime?: number) => void, currentScale: number }) => {
    useTourPanHandler(zoomToElement, currentScale);
    return null;
};

import type { MallaCurricularGraph } from "../core/MallaCurricularGraph";
import type { MateriaNode } from "../types/materia";

const MallaLayout = ({ planData }: { planData: { grafo: MallaCurricularGraph; semestresArray: number[]; semestresMaterias: MateriaNode[][]; semestresAcumUC: number[]; totalMaterias: number; totalUc: number; totalSemestres: number } }) => {
    const { grafo, semestresArray, semestresMaterias, semestresAcumUC, totalMaterias, totalUc, totalSemestres } = planData;
    // 1. Extraemos los Contextos Globales (Mitigación Prop Bloat)
    const { estadoMalla, estadoCustom, accionesMalla } = useMallaData();
    const { ui, modales, configuraciones, datos, handlers } = useMallaUI();
    const { hover: { hoveredMateria } } = useMallaHover();
    const { carreraData, areasColorMap } = useCarrera();

    // 2. Estado local para renders del componente (Zoom, Mobile, Flechas)
    const isMobile = useIsMobile();

    // Determinar qué progreso usar visualmente en las cajas
    const activeProgreso = estadoCustom.isCustomRouteMode ? estadoCustom.customProgreso : estadoMalla.progreso;

    const materiasCursando = estadoCustom.isCustomRouteMode
        // En modo personalizado simulamos que no cursa nada
        ? []
        : estadoMalla.materiasCursando;

    return (
        <div className="flex relative h-dvh w-dvw bg-(--bg-app) font-sans m-0 overflow-hidden text-gray-800 transition-colors">

            <NavigationSidebar
                totalMaterias={totalMaterias}
            />

            <AnimatePresence>
                {modales.isMatriculaModalOpen && (
                    <MatriculaModal
                        key="matricula-modal"
                        isOpen={modales.isMatriculaModalOpen}
                        onClose={() => modales.setIsMatriculaModalOpen(false)}
                        materiasCursando={materiasCursando}
                    />
                )}

                {modales.isMisRutasModalOpen && (
                    <MisRutasModal
                        key="mis-rutas-modal"
                        isOpen={modales.isMisRutasModalOpen}
                        onClose={() => modales.setIsMisRutasModalOpen(false)}
                        savedRoutes={datos.savedRoutesList}
                        onViewRoute={handlers.handleViewSavedRoute}
                        onDeleteRoute={handlers.handleDeleteSavedRoute}
                    />
                )}

                {modales.isFeedbackModalOpen && (
                    <FeedbackModal
                        key="feedback-modal"
                        isOpen={modales.isFeedbackModalOpen}
                        onClose={() => modales.setIsFeedbackModalOpen(false)}
                    />
                )}

                {modales.isSettingsOpen && (
                    <SettingsModal
                        key="settings-modal"
                        isOpen={modales.isSettingsOpen}
                        onClose={() => modales.setIsSettingsOpen(false)}
                        configuraciones={configuraciones}
                    />
                )}

                {modales.isPensumAnteriorModalOpen && (
                    <PensumAnteriorModal
                        key="pensum-anterior-modal"
                        isOpen={modales.isPensumAnteriorModalOpen}
                        onClose={() => modales.setIsPensumAnteriorModalOpen(false)}
                        pensumAnterior={estadoMalla.pensumAnterior}
                        updatePensumAnterior={accionesMalla.updatePensumAnterior}
                    />
                )}

                {ui.isLeyendaOpen && (
                    <LeyendaModal
                        key="leyenda-modal"
                        isOpen={ui.isLeyendaOpen}
                        onClose={() => ui.setIsLeyendaOpen(false)}
                        tituloCarrera="Ingeniería Informática"
                        totalSemestres={totalSemestres}
                        totalUc={totalUc}
                        areasFormacion={carreraData?.areas_color || []}
                    />
                )}

                {modales.isModalOpen && (
                    <RutaModal
                        key="ruta-modal"
                        isOpen={modales.isModalOpen}
                        onClose={() => modales.setIsModalOpen(false)}
                        generarRutaOptima={accionesMalla.generarRutaOptima}
                        grafo={grafo}
                        optimaRuta={datos.optimaRuta}
                        customRoute={datos.customRouteResult}
                    />
                )}
            </AnimatePresence>

            {/* Main Content Area (Grilla Horizontal Libre de Zoom y Paneo) */}
            <div className="w-full h-full relative cursor-grab active:cursor-grabbing">
                <TransformWrapper
                    initialScale={0.8}
                    minScale={0.3}
                    maxScale={2}
                    centerOnInit={true}
                    wheel={{ step: 0.1, disabled: !configuraciones.zoomConRueda || isMobile }}
                    pinch={{ disabled: false }} // Pinch-to-zoom (táctil o macpad) siempre habilitado
                    doubleClick={{ disabled: true }}
                    limitToBounds={true}
                    disablePadding={true}
                    panning={{ velocityDisabled: !isMobile }}
                    alignmentAnimation={{ animationTime: 0, animationType: "linear" }}
                >
                    {({ zoomIn, zoomOut, resetTransform, zoomToElement }) => (
                        <React.Fragment>
                            <TourPanHandler zoomToElement={zoomToElement} currentScale={0.8} />
                            {/* Botones de Control de Zoom (Flotantes Inferior Derecha) */}
                            <ZoomControls zoomIn={zoomIn} zoomOut={zoomOut} resetTransform={resetTransform} isCompact={isMobile} />

                            <TransformComponent
                                wrapperStyle={{ width: "100%", height: "100%" }}
                                wrapperClass="will-change-transform transform-gpu"
                            >
                                <div id="malla-content-grid" ref={ui.contentRef} className="relative flex flex-col min-w-max min-h-max items-start will-change-transform transform-gpu">
                                    <MallaConnections
                                        grafo={grafo}
                                        progreso={activeProgreso}
                                        hoveredMateria={hoveredMateria}
                                        containerRef={ui.contentRef}
                                        areasColorMap={areasColorMap}
                                    />
                                    <div className={`relative flex flex-row gap-12 px-20 pl-32 md:pl-32 items-start pt-48 landscape:pt-28 min-w-max min-h-max ${estadoCustom.isCustomRouteMode ? 'pb-48 landscape:pb-48' : 'pb-32 landscape:pb-16'}`}>
                                        {semestresArray.map((numeroSemestre: number, index: number) => {
                                            return (
                                                <SemestreColumn
                                                    key={`semestre-${numeroSemestre}`}
                                                    numeroSemestre={numeroSemestre}
                                                    materiasDelSemestre={semestresMaterias[index]}
                                                    acumUC={semestresAcumUC[index]}
                                                />
                                            );
                                        })}
                                    </div>
                                </div>
                            </TransformComponent>
                        </React.Fragment>
                    )}
                </TransformWrapper>
                <ConstructorToolbar />
            </div>
        </div>
    );
};

export const MallaPage = () => {
    const { activePlanId, planData } = usePlanEstudio();

    if (!activePlanId || !planData) {
        return <WelcomeModal />;
    }

    return (
        <>
            <PlanSwitcherFloat />
            <MallaProvider key={activePlanId} grafo={planData.grafo} activePlanId={activePlanId}>
                <MallaLayout planData={planData} />
            </MallaProvider>
        </>
    );
};
