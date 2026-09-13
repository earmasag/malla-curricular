import { createContext, useContext, useState, useEffect, useMemo } from "react";
import type { ReactNode } from "react";
import { MallaCurricularBuilder } from "../core/MallaCurricularBuilder";
import { MallaCurricularGraph } from "../core/MallaCurricularGraph";
import { useCarrera } from "./CarreraContext";
import { LoadingScreen } from "../components/ui/LoadingScreen";
import { useMinLoading } from "../hooks/ui/useMinLoading";
import type { MateriaJSON, MateriaNode } from "../types/materia";

export type PlanId = "202415" | "202715";

export interface PlanData {
    grafo: MallaCurricularGraph;
    semestresArray: number[];
    semestresMaterias: MateriaNode[][];
    semestresAcumUC: number[];
    totalMaterias: number;
    totalUc: number;
    totalSemestres: number;
}

interface PlanContextType {
    activePlanId: PlanId | null;
    setActivePlanId: (id: PlanId) => void;
    planData: PlanData | null;
}

const PlanContext = createContext<PlanContextType | undefined>(undefined);

export const PlanProvider = ({ children }: { children: ReactNode }) => {
    const { carreraData, isLoading } = useCarrera();
    const showLoading = useMinLoading(isLoading, 1000);
    const [activePlanId, setActivePlanId] = useState<PlanId | null>(() => {
        const saved = localStorage.getItem("malla-active-plan") as PlanId;
        return (saved === "202415" || saved === "202715") ? saved : null;
    });

    // Actualizamos localStorage cuando cambia
    useEffect(() => {
        if (activePlanId) {
            localStorage.setItem("malla-active-plan", activePlanId);
        }
    }, [activePlanId]);

    // Reconstruimos el grafo dinámicamente cuando el activePlanId o carreraData cambia
    const planData = useMemo<PlanData | null>(() => {
        if (!activePlanId || !carreraData) return null;

        const builder = new MallaCurricularBuilder();
        const json = activePlanId === "202415" ? carreraData.plan_estudio : carreraData.plan_estudio_nuevo;
        
        if (!json) return null;

        const grafo = builder.build(json as MateriaJSON[]);

        const totalSemestres = grafo.getTotalSemestres();
        const semestresArray = Array.from({ length: totalSemestres }, (_, i) => i + 1);
        const allNodes = grafo.getAllNodes();
        const totalMaterias = allNodes.length;
        const totalUc = allNodes.reduce((acc: number, curr: MateriaNode) => acc + curr.unidadesCredito, 0);

        const semestresMaterias = semestresArray.map(numeroSemestre => {
            return grafo
                .getMateriasPorSemestre(numeroSemestre)
                .sort((a: MateriaNode, b: MateriaNode) => b.areaFormacion.localeCompare(a.areaFormacion));
        });

        let runningAcum = 0;
        const semestresAcumUC = semestresMaterias.map(materias => {
            const sum = materias.reduce((acc: number, m: MateriaNode) => acc + (m.unidadesCredito || 0), 0);
            runningAcum += sum;
            return runningAcum;
        });

        return {
            grafo,
            semestresArray,
            semestresMaterias,
            semestresAcumUC,
            totalMaterias,
            totalUc,
            totalSemestres
        };
    }, [activePlanId, carreraData]);

    if (showLoading) {
        return <LoadingScreen message="Cargando malla..." />;
    }

    return (
        <PlanContext.Provider value={{ activePlanId, setActivePlanId, planData }}>
            {children}
        </PlanContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const usePlanEstudio = () => {
    const context = useContext(PlanContext);
    if (!context) {
        throw new Error("usePlanEstudio debe usarse dentro de un PlanProvider");
    }
    return context;
};
