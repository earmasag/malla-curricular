    import React, { useState } from 'react';
import { usePlanEstudio } from '../../contexts/PlanContext';
import type { PlanId } from '../../contexts/PlanContext';
import { MigrationConfirmModal } from '../modals/MigrationConfirmModal';
import { MateriaRepository } from '../../repository/MateriaRepository';
import { MigrationService } from '../../services/MigrationService';
import { StandardMallaEvaluator } from '../../rules/StandardMallaEvaluator';
import { MallaCurricularBuilder } from '../../core/MallaCurricularBuilder';
import planEstudio2027 from '../../data/plan_estudio_nuevo.json';
import { RefreshCw } from 'lucide-react';

export const PlanSwitcherFloat: React.FC = () => {
    const { activePlanId, setActivePlanId } = usePlanEstudio();
    const [showMigrationModal, setShowMigrationModal] = useState(false);

    const handleSwitchPlan = (newPlan: PlanId) => {
        setActivePlanId(newPlan);
    };

    const confirmMigration = () => {
        const oldRepo = new MateriaRepository("202415");
        const newRepo = new MateriaRepository("202715");
        const oldProgress = oldRepo.getStudentProgress();
        
        const evaluator = new StandardMallaEvaluator();
        const migrationService = new MigrationService(evaluator);
        
        const builder = new MallaCurricularBuilder();
        const newGraph = builder.build(planEstudio2027 as any);

        const { newProgreso, pensumAnterior } = migrationService.migrateTo2027(oldProgress, newGraph);
        newRepo.saveStudentProgress(newProgreso);
        newRepo.savePensumAnterior(pensumAnterior); 
        
        setActivePlanId("202715");
        setShowMigrationModal(false);
    };

    return (
        <>
            <MigrationConfirmModal 
                isOpen={showMigrationModal}
                onClose={() => setShowMigrationModal(false)}
                onConfirm={confirmMigration}
            />
            
            <div className="fixed top-3 left-1/2 -translate-x-1/2 sm:top-6 z-40 flex items-center gap-1 sm:gap-2">
                {/* Selector de Plan */}
                <div id="tour-main-plan-switcher" className="bg-theme-50/40 backdrop-blur-2xl shadow-2xl shadow-theme-500/5 border border-white/60 rounded-full p-1 sm:p-1.5 flex items-center animate-in slide-in-from-top-4 duration-500">
                    <button
                        onClick={() => handleSwitchPlan("202415")}
                        className={`px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold rounded-full transition-all duration-300 ${
                            activePlanId === "202415" 
                            ? 'bg-theme-500 text-white shadow-md' 
                            : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100/50'
                        }`}
                    >
                        Plan 2024
                    </button>
                    <button
                        onClick={() => handleSwitchPlan("202715")}
                        className={`px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold rounded-full transition-all duration-300 ${
                            activePlanId === "202715" 
                            ? 'bg-theme-500 text-white shadow-md' 
                            : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100/50'
                        }`}
                    >
                        Plan 2027
                    </button>
                </div>

                {/* Botón de Sincronizar (Solo visible en plan viejo) */}
                {activePlanId === "202415" && (
                    <button
                        id="tour-main-plan-sync"
                        onClick={() => setShowMigrationModal(true)}
                        className="group flex items-center justify-center w-8 h-8 sm:w-11 sm:h-11 bg-linear-to-br from-theme-500 to-theme-600 hover:from-theme-600 hover:to-theme-700 text-white rounded-full shadow-lg shadow-theme-500/30 border border-theme-600 transition-all duration-300 animate-in slide-in-from-left-4 fade-in"
                        title="Migrar progreso al Plan 2027"
                    >
                        <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:rotate-180 duration-500" />
                    </button>
                )}
            </div>
        </>
    );
};
