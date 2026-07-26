import React, { useRef } from "react";
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


// Datos estáticos
import areasColorData from '../data/areas_color.json';

import { usePlanEstudio } from "../contexts/PlanContext";
import { WelcomeModal } from "../components/modals/WelcomeModal";
import { PlanSwitcherFloat } from "../components/layout/PlanSwitcherFloat";
import { useTourPanHandler } from "../hooks/ui/useTourPanHandler";

const TourPanHandler = ({ zoomToElement, currentScale }: { zoomToElement: any, currentScale: number }) => {
    useTourPanHandler(zoomToElement, currentScale);
    return null;
};

const MallaLayout = ({ planData }: { planData: any }) => {
    const { grafo, semestresArray, semestresMaterias, totalMaterias, totalUc, totalSemestres } = planData;
    const contentRef = useRef<HTMLDivElement>(null);
    // 1. Extraemos los Contextos Globales (Mitigación Prop Bloat)
    const { estadoMalla, estadoCustom, accionesMalla } = useMallaData();
    const { ui, modales, configuraciones, datos, handlers } = useMallaUI();
    const { hover: { hoveredMateria } } = useMallaHover();

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

            {modales.isMatriculaModalOpen && (
                <MatriculaModal
                    isOpen={modales.isMatriculaModalOpen}
                    onClose={() => modales.setIsMatriculaModalOpen(false)}
                    materiasCursando={materiasCursando}
                />
            )}

            {modales.isMisRutasModalOpen && (
                <MisRutasModal
                    isOpen={modales.isMisRutasModalOpen}
                    onClose={() => modales.setIsMisRutasModalOpen(false)}
                    savedRoutes={datos.savedRoutesList}
                    onViewRoute={handlers.handleViewSavedRoute}
                    onDeleteRoute={handlers.handleDeleteSavedRoute}
                />
            )}

            {modales.isFeedbackModalOpen && (
                <FeedbackModal
                    isOpen={modales.isFeedbackModalOpen}
                    onClose={() => modales.setIsFeedbackModalOpen(false)}
                />
            )}

            {modales.isSettingsOpen && (
                <SettingsModal
                    isOpen={modales.isSettingsOpen}
                    onClose={() => modales.setIsSettingsOpen(false)}
                    configuraciones={configuraciones}
                />
            )}

            {modales.isPensumAnteriorModalOpen && (
                <PensumAnteriorModal
                    isOpen={modales.isPensumAnteriorModalOpen}
                    onClose={() => modales.setIsPensumAnteriorModalOpen(false)}
                    pensumAnterior={estadoMalla.pensumAnterior}
                    updatePensumAnterior={accionesMalla.updatePensumAnterior}
                />
            )}

            {ui.isLeyendaOpen && (
                <LeyendaModal
                    isOpen={ui.isLeyendaOpen}
                    onClose={() => ui.setIsLeyendaOpen(false)}
                    tituloCarrera="Ingeniería Informática"
                    totalSemestres={totalSemestres}
                    totalUc={totalUc}
                    areasFormacion={areasColorData}
                />
            )}

            {modales.isModalOpen && (
                <RutaModal
                    isOpen={modales.isModalOpen}
                    onClose={() => modales.setIsModalOpen(false)}
                    generarRutaOptima={accionesMalla.generarRutaOptima}
                    grafo={grafo}
                    optimaRuta={datos.optimaRuta}
                    customRoute={datos.customRouteResult}
                />
            )}

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
                    panning={{ velocityDisabled: true }}
                    alignmentAnimation={{ animationTime: 0, animationType: "linear" }}
                >
                    {({ zoomIn, zoomOut, resetTransform, zoomToElement }) => (
                        <React.Fragment>
                            <TourPanHandler zoomToElement={zoomToElement} currentScale={0.8} />
                            {/* Botones de Control de Zoom (Flotantes Inferior Derecha) */}
                            {!isMobile && <ZoomControls zoomIn={zoomIn} zoomOut={zoomOut} resetTransform={resetTransform} />}

                            <TransformComponent
                                wrapperStyle={{ width: "100%", height: "100%" }}
                                wrapperClass="will-change-transform transform-gpu"
                            >
                                <div ref={contentRef} className="relative flex flex-col min-w-max min-h-max items-start will-change-transform transform-gpu">
                                    <MallaConnections
                                        grafo={grafo}
                                        progreso={activeProgreso}
                                        hoveredMateria={hoveredMateria}
                                        containerRef={contentRef}
                                    />
                                    <div className="relative flex flex-row gap-12 px-20 pl-32 md:pl-32 items-start pt-20 pb-32 min-w-max min-h-max">
                                        {semestresArray.map((numeroSemestre: number, index: number) => {
                                            return (
                                                <SemestreColumn
                                                    key={`semestre-${numeroSemestre}`}
                                                    numeroSemestre={numeroSemestre}
                                                    materiasDelSemestre={semestresMaterias[index]}
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
