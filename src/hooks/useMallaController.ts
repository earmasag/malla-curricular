import { useState, useMemo } from "react";
import { MateriaRepository } from "../repository/MateriaRepository";
import type { SavedRoute } from "../types/materia";

export const useMallaController = (
    generarRutaOptima: (maxUcPorSemestre?: number, maxMateriasPorSemestre?: number, maxHorasPorSemestre?: number) => string[][],
    saveAndFinishRoute: (id: string, name: string) => void,
    cancelCustomRoute: () => void,
    customSemesters: string[][]
) => {
    const [hoveredMateria, setHoveredMateria] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [optimaRuta, setOptimaRuta] = useState<string[][] | null>(null);
    const [customRouteResult, setCustomRouteResult] = useState<string[][] | null>(null);

    // Modal states
    const [isMisRutasModalOpen, setIsMisRutasModalOpen] = useState(false);
    const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
    const [isMatriculaModalOpen, setIsMatriculaModalOpen] = useState(false);
    const [savedRoutesList, setSavedRoutesList] = useState<SavedRoute[]>([]);

    // Repository for loading routes list
    const repository = useMemo(() => new MateriaRepository(), []);

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

    return {
        hoveredMateria,
        setHoveredMateria,
        isModalOpen,
        setIsModalOpen,
        optimaRuta,
        customRouteResult,
        isMisRutasModalOpen,
        setIsMisRutasModalOpen,
        isFeedbackModalOpen,
        setIsFeedbackModalOpen,
        isMatriculaModalOpen,
        setIsMatriculaModalOpen,
        savedRoutesList,
        handleShowRutaOptima,
        handleFinishCustomRoute,
        handleOpenMisRutas,
        handleDeleteSavedRoute,
        handleViewSavedRoute
    };
};
