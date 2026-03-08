import { useState, useMemo, useRef, useEffect } from "react";
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
    const [isLeyendaOpen, setIsLeyendaOpen] = useState(false);
    const [savedRoutesList, setSavedRoutesList] = useState<SavedRoute[]>([]);

    const leyendaRef = useRef<HTMLDivElement>(null);
    const botonLeyendaRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                leyendaRef.current &&
                !leyendaRef.current.contains(event.target as Node) &&
                botonLeyendaRef.current &&
                !botonLeyendaRef.current.contains(event.target as Node)
            ) {
                setIsLeyendaOpen(false);
            }
        };

        if (isLeyendaOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isLeyendaOpen]);

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
        ui: {
            hoveredMateria,
            setHoveredMateria,
            isLeyendaOpen,
            setIsLeyendaOpen,
            leyendaRef,
            botonLeyendaRef
        },
        modales: {
            isModalOpen,
            setIsModalOpen,
            isMisRutasModalOpen,
            setIsMisRutasModalOpen,
            isFeedbackModalOpen,
            setIsFeedbackModalOpen,
            isMatriculaModalOpen,
            setIsMatriculaModalOpen
        },
        datos: {
            optimaRuta,
            customRouteResult,
            savedRoutesList
        },
        handlers: {
            handleShowRutaOptima,
            handleFinishCustomRoute,
            handleOpenMisRutas,
            handleDeleteSavedRoute,
            handleViewSavedRoute
        }
    };
};
