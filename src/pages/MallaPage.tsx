import React from "react";
import planEstudioJSON from "../data/plan_estudio.json";
import areasColorData from "../data/areas_color.json";
import { useMallaCurricular } from "../hooks/useMallaCurricular";
import { useCustomRoute } from "../hooks/useCustomRoute";
import { MallaCurricularBuilder } from "../core/MallaCurricularBuilder";
import type { MateriaJSON } from "../types/materia";
import { SemestreColumn } from "../components/SemestreColumn/SemestreColumn";
import MallaConnections from "../components/MallaConnections/MallaConnections";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { Xwrapper, useXarrow } from "react-xarrows";
import { useIsMobile } from "../hooks/useIsMobile";
import { MallaHeader } from "../components/MallaHeader/MallaHeader";
import { ZoomControls } from "../components/ZoomControls/ZoomControls";
import { RutaModal } from "../components/RutaModal/RutaModal";
import { MisRutasModal } from "../components/MisRutasModal/MisRutasModal";
import { FeedbackModal } from "../components/FeedbackModal/FeedbackModal";
import { MatriculaModal } from "../components/MatriculaModal/MatriculaModal";
import { LeyendaMalla } from "../components/LeyendaMalla/LeyendaMalla";
import { useMallaController } from "../hooks/useMallaController";
import { Info, X } from "lucide-react";

const builder = new MallaCurricularBuilder();
const materiaData = planEstudioJSON as unknown as MateriaJSON[];
const malla = builder.build(materiaData);

const MallaContent = () => {
    const { estado: estadoMalla, acciones: accionesMalla } = useMallaCurricular(malla);
    const { estado: estadoCustom, acciones: accionesCustom } = useCustomRoute(malla, estadoMalla.progreso);

    const { ui, modales, datos, handlers } = useMallaController(
        accionesMalla.generarRutaOptima,
        accionesCustom.saveAndFinishRoute,
        accionesCustom.cancelCustomRoute,
        estadoCustom.customSemesters
    );

    // Detectar si es móvil para deshabilitar el zoom con la rueda del ratón en escritorio
    const isMobile = useIsMobile();

    // Obtener la función para recalcular las flechas de react-xarrows manualmente
    const updateXarrow = useXarrow();

    // 1. Array de los números de semestre [1, 2, 3...]
    const totalSemestres = malla.getTotalSemestres();
    const semestresArray = Array.from(
        { length: totalSemestres },
        (_, i) => i + 1
    );



    // Determinar qué progreso usar
    const activeProgreso = estadoCustom.isCustomRouteMode ? estadoCustom.customProgreso : estadoMalla.progreso;

    const materiasCursando = estadoCustom.isCustomRouteMode
        // En modo personalizado simulamos que no cursa nada
        ? []
        : estadoMalla.materiasCursando;

    const ucCursando = materiasCursando.reduce((sum, m) => sum + m.unidadesCredito, 0);
    const totalMaterias = malla.getAllNodes().length;

    return (
        <div className="flex relative h-dvh w-dvw bg-gray-100 font-sans m-0 overflow-hidden">
            {/* Botón Flotante Leyenda (Top Right) */}
            <button
                ref={ui.botonLeyendaRef}
                onClick={() => ui.setIsLeyendaOpen(!ui.isLeyendaOpen)}
                className="absolute top-4 right-4 md:top-6 md:right-6 z-50 bg-white/90 backdrop-blur-md p-3 rounded-full shadow-lg border border-gray-200 text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all"
                title="Ver Leyenda y Abreviaturas"
            >
                {ui.isLeyendaOpen ? <X className="w-6 h-6" /> : <Info className="w-6 h-6" />}
            </button>

            {/* Popover / Modal de Leyenda */}
            {ui.isLeyendaOpen && (
                <div ref={ui.leyendaRef} className="absolute top-20 right-2 md:right-6 z-50 animate-in fade-in slide-in-from-top-4 duration-300 max-h-[calc(100dvh-100px)] max-w-[calc(100dvw-16px)] md:max-w-none overflow-y-auto overflow-x-hidden rounded-xl shadow-2xl">
                    <LeyendaMalla
                        tituloCarrera="Ingeniería Informática"
                        totalSemestres={totalSemestres}
                        totalUc={malla.getAllNodes().reduce((acc, curr) => acc + curr.unidadesCredito, 0)}
                        areasFormacion={areasColorData}
                    />
                </div>
            )}

            {/* Cabecera / Dashboard (Flotante) */}
            <MallaHeader
                cantidadAprobadas={estadoMalla.cantidadAprobadas}
                ucAcumuladas={estadoMalla.ucAcumuladas}
                totalMaterias={totalMaterias}
                ucCursando={ucCursando}
                onResetProgreso={accionesMalla.resetProgreso}
                onShowRutaOptima={handlers.handleShowRutaOptima}
                isCustomRouteMode={estadoCustom.isCustomRouteMode}
                startCustomRoute={accionesCustom.startCustomRoute}
                advanceCustomSemester={accionesCustom.advanceCustomSemester}
                cancelCustomRoute={accionesCustom.cancelCustomRoute}
                finishCustomRoute={handlers.handleFinishCustomRoute}
                deleteDraftRoute={accionesCustom.deleteDraftRoute}
                customSemestersCount={estadoCustom.customSemesters.length}
                customCurrentSemesterCount={estadoCustom.customSemesters.length > 0 ? estadoCustom.customSemesters[estadoCustom.customSemesters.length - 1].length : 0}
                hasDraftRoute={estadoCustom.hasDraftRoute}
                currentSemesterUCs={estadoCustom.currentSemesterUCs}
                totalCustomUCs={estadoCustom.totalCustomUCs}
                onOpenMisRutas={handlers.handleOpenMisRutas}
                onOpenFeedback={() => modales.setIsFeedbackModalOpen(true)}
                onCalculoMatricula={() => modales.setIsMatriculaModalOpen(true)}
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

            <RutaModal
                isOpen={modales.isModalOpen}
                onClose={() => modales.setIsModalOpen(false)}
                generarRutaOptima={accionesMalla.generarRutaOptima}
                grafo={malla}
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
                            <ZoomControls zoomIn={zoomIn} zoomOut={zoomOut} resetTransform={resetTransform} />

                            {/* Overlay de Flechas, movido fuera del contenedor escalable para evitar el bug del doble escalado (css scale + boudning rect) */}
                            <MallaConnections
                                grafo={malla}
                                progreso={activeProgreso}
                                hoveredMateria={ui.hoveredMateria}
                            />

                            <TransformComponent
                                wrapperStyle={{ width: "100%", height: "100%" }}
                            >
                                <div className="flex flex-col min-w-max min-h-max items-start">
                                    <div className="relative flex flex-row gap-12 px-20 items-start pt-20 pb-32 min-w-max min-h-max">
                                        {semestresArray.map((numeroSemestre) => {
                                            // Le pedimos al Grafo solo las materias de esta columna
                                            const materiasDelSemestre = malla
                                                .getMateriasPorSemestre(numeroSemestre)
                                                .sort((a, b) =>
                                                    b.areaFormacion.localeCompare(a.areaFormacion)
                                                );

                                            return (
                                                <SemestreColumn
                                                    key={`semestre-${numeroSemestre}`}
                                                    numeroSemestre={numeroSemestre}
                                                    materiasDelSemestre={materiasDelSemestre}
                                                    progreso={activeProgreso}
                                                    onSelectMateria={estadoCustom.isCustomRouteMode ? accionesCustom.toggleCustomMateria : accionesMalla.toggleAprobacion}
                                                    onToggleCursandoMateria={estadoCustom.isCustomRouteMode ? () => { } : accionesMalla.toggleCursando}
                                                    onHoverMateria={ui.setHoveredMateria}
                                                    hoveredMateria={ui.hoveredMateria}
                                                    onToggleSemestre={estadoCustom.isCustomRouteMode ? () => { } : accionesMalla.toggleSemestre}
                                                    hideActions={estadoCustom.isCustomRouteMode}
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

// Necesario envolver el sistema de renderizado de react-xarrows dentro de su contexto global
// para que useXarrow() pueda solicitar un repintado síncrono en todos los lugares donde existan flechas
export const MallaPage = () => (
    <Xwrapper>
        <MallaContent />
    </Xwrapper>
);
