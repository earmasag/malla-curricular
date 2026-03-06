import planEstudioJSON from "../data/plan_estudio.json";
import { useMallaCurricular } from "../hooks/useMallaCurricular";
import { useCustomRoute } from "../hooks/useCustomRoute";
import { MallaCurricularBuilder } from "../core/MallaCurricularBuilder";
import type { MateriaJSON, SavedRoute } from "../types/materia";
import { SemestreColumn } from "../components/SemestreColumn/SemestreColumn";
import MallaConnections from "../components/MallaConnections/MallaConnections";
import React, { useState, useMemo } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { Xwrapper, useXarrow } from "react-xarrows";
import { useIsMobile } from "../hooks/useIsMobile";
import { MallaHeader } from "../components/MallaHeader/MallaHeader";
import { ZoomControls } from "../components/ZoomControls/ZoomControls";
import { RutaModal } from "../components/RutaModal/RutaModal";
import { MisRutasModal } from "../components/MisRutasModal/MisRutasModal";
import { FeedbackModal } from "../components/FeedbackModal/FeedbackModal";
import { MateriaRepository } from "../repository/MateriaRepository";

const builder = new MallaCurricularBuilder();
const materiaData = planEstudioJSON as unknown as MateriaJSON[];
const malla = builder.build(materiaData);

const MallaContent = () => {
    const {
        progreso,
        cantidadAprobadas,
        ucAcumuladas,
        toggleAprobacion,
        toggleCursando,
        toggleSemestre,
        resetProgreso,
        generarRutaOptima,
    } = useMallaCurricular(malla);

    const {
        isCustomRouteMode,
        customProgreso,
        customSemesters,
        hasDraftRoute,
        currentSemesterUCs,
        totalCustomUCs,
        startCustomRoute,
        deleteDraftRoute,
        toggleCustomMateria,
        advanceCustomSemester,
        cancelCustomRoute,
        saveAndFinishRoute
    } = useCustomRoute(malla, progreso);


    const [hoveredMateria, setHoveredMateria] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [optimaRuta, setOptimaRuta] = useState<string[][] | null>(null);
    const [customRouteResult, setCustomRouteResult] = useState<string[][] | null>(null);
    const [isMisRutasModalOpen, setIsMisRutasModalOpen] = useState(false);
    const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
    const [savedRoutesList, setSavedRoutesList] = useState<SavedRoute[]>([]);

    // Repository for loading routes list
    const repository = useMemo(() => new MateriaRepository(), []);

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

    const handleShowRutaOptima = () => {
        const ruta = generarRutaOptima(24, 6, undefined);
        setOptimaRuta(ruta);
        setCustomRouteResult(null); // Ensure we are in "Ruta Optima" mode
        setIsModalOpen(true);
    };

    const handleFinishCustomRoute = (name: string) => {
        // Filtrar semestres vacíos en caso de que el último no tenga nada
        const validSemesters = customSemesters.filter((sem: string[]) => sem.length > 0);
        if (validSemesters.length > 0) {
            const uniqueId = `route-${Date.now()}`;
            saveAndFinishRoute(uniqueId, name);
            setCustomRouteResult(validSemesters);
            setIsModalOpen(true);
        }
        cancelCustomRoute();
    };

    const handleOpenMisRutas = () => {
        setSavedRoutesList(repository.getSavedRoutes());
        setIsMisRutasModalOpen(true);
    };

    const handleDeleteSavedRoute = (routeId: string) => {
        repository.deleteRoute(routeId);
        setSavedRoutesList(repository.getSavedRoutes());
    };

    const handleViewSavedRoute = (routeSemesters: string[][]) => {
        setIsMisRutasModalOpen(false);
        setCustomRouteResult(routeSemesters);
        setIsModalOpen(true);
    };

    // Determinar qué progreso usar
    const activeProgreso = isCustomRouteMode ? customProgreso : progreso;

    return (
        <div className="flex relative h-screen w-screen bg-gray-100 font-sans m-0 overflow-hidden">
            {/* Cabecera / Dashboard (Flotante) */}
            <MallaHeader
                cantidadAprobadas={cantidadAprobadas}
                ucAcumuladas={ucAcumuladas}
                onResetProgreso={resetProgreso}
                onShowRutaOptima={handleShowRutaOptima}
                isCustomRouteMode={isCustomRouteMode}
                startCustomRoute={startCustomRoute}
                advanceCustomSemester={advanceCustomSemester}
                cancelCustomRoute={cancelCustomRoute}
                finishCustomRoute={handleFinishCustomRoute}
                deleteDraftRoute={deleteDraftRoute}
                customSemestersCount={customSemesters.length}
                customCurrentSemesterCount={customSemesters.length > 0 ? customSemesters[customSemesters.length - 1].length : 0}
                hasDraftRoute={hasDraftRoute}
                currentSemesterUCs={currentSemesterUCs}
                totalCustomUCs={totalCustomUCs}
                onOpenMisRutas={handleOpenMisRutas}
                onOpenFeedback={() => setIsFeedbackModalOpen(true)}
            />

            <MisRutasModal
                isOpen={isMisRutasModalOpen}
                onClose={() => setIsMisRutasModalOpen(false)}
                savedRoutes={savedRoutesList}
                onViewRoute={handleViewSavedRoute}
                onDeleteRoute={handleDeleteSavedRoute}
            />

            <FeedbackModal
                isOpen={isFeedbackModalOpen}
                onClose={() => setIsFeedbackModalOpen(false)}
            />

            <RutaModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                generarRutaOptima={generarRutaOptima}
                grafo={malla}
                optimaRuta={optimaRuta}
                customRoute={customRouteResult}
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
                                hoveredMateria={hoveredMateria}
                            />

                            <TransformComponent
                                wrapperStyle={{ width: "100%", height: "100%" }}
                            >
                                <div className="relative flex flex-row gap-12 px-20 items-start pb-32 pt-32 min-w-max min-h-max">
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
                                                onSelectMateria={isCustomRouteMode ? toggleCustomMateria : toggleAprobacion}
                                                onToggleCursandoMateria={isCustomRouteMode ? () => { } : toggleCursando}
                                                onHoverMateria={setHoveredMateria}
                                                hoveredMateria={hoveredMateria}
                                                onToggleSemestre={isCustomRouteMode ? () => { } : toggleSemestre}
                                                hideActions={isCustomRouteMode}
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
