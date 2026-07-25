import { usePlanEstudio } from '../../contexts/PlanContext';
import type { PlanId } from '../../contexts/PlanContext';
import { BookOpen } from 'lucide-react';

export const WelcomeModal = () => {
    const { setActivePlanId } = usePlanEstudio();

    const handleSelectPlan = (plan: PlanId) => {
        setActivePlanId(plan);
    };

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-300">
            <div className="bg-white rounded-3xl p-8 md:p-10 w-full max-w-lg shadow-2xl relative animate-in zoom-in-95 duration-300">
                
                <div className="flex flex-col items-center text-center mb-8">
                    <div className="bg-(--color-theme-) text-(--color-theme-) p-4 rounded-full mb-4">
                        <BookOpen className="w-10 h-10" />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-black text-gray-800 tracking-tight">
                        ¡Bienvenido a tu Malla Curricular!
                    </h2>
                    <p className="text-gray-500 mt-3 text-lg leading-relaxed">
                        Para comenzar, selecciona el plan de estudio bajo el cual estás cursando la carrera de Ingeniería Informática.
                    </p>
                </div>

                <div className="flex flex-col gap-4">
                    <button
                        onClick={() => handleSelectPlan("202415")}
                        className="flex flex-col items-center justify-center p-5 bg-white border-2 border-gray-200 rounded-2xl hover:border-(--color-theme-) hover:bg-(--color-theme-) transition-all group cursor-pointer"
                    >
                        <span className="text-xl font-bold text-gray-700 group-hover:text-(--color-theme-)">Plan Antiguo</span>
                        <span className="text-sm text-gray-500 group-hover:text-(--color-theme-) mt-1">Septiembre 2023 - TERM 202415</span>
                    </button>

                    <button
                        onClick={() => handleSelectPlan("202715")}
                        className="flex flex-col items-center justify-center p-5 bg-white border-2 border-gray-200 rounded-2xl hover:border-green-500 hover:bg-green-50 transition-all group cursor-pointer relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                            NUEVO
                        </div>
                        <span className="text-xl font-bold text-gray-700 group-hover:text-green-700">Plan Modificado</span>
                        <span className="text-sm text-gray-500 group-hover:text-green-500 mt-1">Septiembre 2026 - TERM 202715</span>
                    </button>
                </div>

                <div className="mt-8 text-center text-xs text-gray-400">
                    Podrás cambiar tu plan más adelante desde la configuración de la malla.
                </div>
            </div>
        </div>
    );
};
