import { usePlanEstudio } from '../../contexts/PlanContext';
import type { PlanId } from '../../contexts/PlanContext';
import { useCarrera } from '../../contexts/CarreraContext';
import { CARRERAS_DISPONIBLES } from '../../data/carreras';

interface DecoCardProps {
    nombre: string;
    codigo: string;
    horas: number[];
    taxonomia: string;
    modalidad: string;
    uc: number;
    color: string;
    rotate: string;
    translateX: string;
    translateY: string;
    zIndex: number;
    opacity?: boolean;
}

const DecoCard = ({ nombre, codigo, horas, taxonomia, modalidad, uc, color, rotate, translateX, translateY, zIndex, opacity }: DecoCardProps) => (
    <div
        className="absolute w-52 h-22 rounded-br-[20px] border-[3px] shadow-lg pointer-events-none"
        style={{
            backgroundColor: color,
            borderColor: color,
            transform: `rotate(${rotate}) translate(${translateX}, ${translateY})`,
            zIndex,
            opacity: opacity ? 0.5 : 1,
        }}
    >
        {/* Modalidad tag */}
        <div className="absolute w-5 h-7 left-0 bottom-0 z-10 leading-none overflow-hidden">
            <div className="absolute inset-0 bg-white [clip-path:polygon(50%_0%,100%_30%,100%_100%,0%_100%,0%_30%)]"></div>
            <div className="absolute top-0.5 left-0 right-0 -bottom-0.5 bg-[#4B4B4B] [clip-path:polygon(50%_0%,100%_30%,100%_100%,0%_100%,0%_30%)] flex items-center justify-center">
                <p className="text-white font-bold text-[10px] pt-1" style={{ fontFamily: "'Oswald', sans-serif" }}>{modalidad}</p>
            </div>
        </div>

        {/* Content area */}
        <div className="absolute left-5 right-1 top-0 bottom-0 flex flex-col bg-white rounded-br-[18px]">
            <p
                className="absolute top-2 left-2 right-0 text-left text-black font-bold text-[12px] uppercase leading-tight line-clamp-3 wrap-break-words"
                style={{ fontFamily: "'Oswald', sans-serif", letterSpacing: "0.5px", lineHeight: "1.1" }}
            >
                {nombre}
            </p>
            <p
                className="absolute bottom-5 left-2 right-0 text-left text-gray-700 font-bold text-[11px] uppercase"
                style={{ fontFamily: "'Oswald', sans-serif", letterSpacing: "0.5px" }}
            >
                {codigo}
            </p>
        </div>

        {/* Hours row */}
        <div
            className="absolute bottom-0 left-5 flex z-10 border-t-2 border-b-0 mask-[linear-gradient(to_right,transparent_0%,black_5%,black_95%,transparent_100%)]"
            style={{ borderColor: color, fontFamily: "'Oswald', sans-serif" }}
        >
            {horas.map((h, i) => (
                <div key={i} className="flex items-center justify-center w-5 h-4 bg-white border-r-2 text-[12px] font-semibold text-black" style={{ borderColor: color }}>
                    {h}
                </div>
            ))}
            <div className="flex items-center justify-center w-10 h-4 bg-white text-[12px] font-semibold text-black">
                {taxonomia}
            </div>
        </div>

        {/* UC circle */}
        <div
            className="absolute flex items-center justify-center right-0 bottom-0 size-7 rounded-full z-20 text-white font-bold text-[14px] border-2"
            style={{ backgroundColor: color, borderColor: color, fontFamily: "'Oswald', sans-serif" }}
        >
            {uc}
        </div>
    </div>
);

export const WelcomeModal = () => {
    const { setActivePlanId } = usePlanEstudio();
    const { activeCarreraId } = useCarrera();

    const handleSelectPlan = (plan: PlanId) => {
        setActivePlanId(plan);
    };

    const carreraActiva = CARRERAS_DISPONIBLES.find(c => c.id === activeCarreraId);

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-300">
            <div
                className="rounded-3xl p-8 md:p-10 w-full max-w-lg shadow-2xl relative animate-in zoom-in-95 duration-300"
                style={{
                    background: 'linear-gradient(180deg, #f0f0f0 0%, #ffffff 50%)'
                }}
            >
                {/* Decorative stacked cards */}
                <div className="relative h-28 mb-6 mt-2 flex items-center justify-center">
                    <DecoCard
                        nombre="Lógica"
                        codigo="FING-02009"
                        horas={[2, 1, 0, 3, 6]}
                        taxonomia="TA-4"
                        modalidad="EVC"
                        uc={4}
                        color="#22c55e"
                        rotate="-4deg"
                        translateX="-38px"
                        translateY="-4px"
                        zIndex={1}
                    />
                    <DecoCard
                        nombre="Estrategia y Proyección Profesional"
                        codigo="INFO-00002"
                        horas={[2, 1, 0, 3, 6]}
                        taxonomia="TA-6"
                        modalidad="PRE"
                        uc={5}
                        color="#ec4899"
                        rotate="-1deg"
                        translateX="0px"
                        translateY="0px"
                        zIndex={2}
                    />
                    <DecoCard
                        nombre="Álgebra y Trigonometría"
                        codigo="FING-02002"
                        horas={[2, 2, 0, 4, 10]}
                        taxonomia="TA-4"
                        modalidad="PRE"
                        uc={5}
                        color="#3b82f6"
                        rotate="3deg"
                        translateX="38px"
                        translateY="4px"
                        zIndex={3}
                    />
                </div>

                {/* Text content */}
                <div className="flex flex-col items-center text-center mb-6">
                    <h2 className="text-2xl md:text-3xl font-black text-theme-700 tracking-tight">
                        ¡Bienvenido a tu Malla Curricular!
                    </h2>
                    <p className="text-gray-600 mt-3 text-base leading-relaxed max-w-sm">
                        Selecciona el plan de estudio bajo el cual estás cursando la carrera de{' '}
                        <strong className="font-bold text-gray-800">
                            {carreraActiva?.nombre || 'Ingeniería en Informática'}
                        </strong>
                    </p>
                </div>

                {/* Plan selection buttons */}
                <div className="flex flex-col gap-3">
                    <button
                        onClick={() => handleSelectPlan("202415")}
                        className="flex flex-col items-center justify-center p-5 bg-white border-2 border-theme-200 rounded-2xl hover:border-theme-500 hover:bg-theme-50 transition-all group cursor-pointer shadow-sm hover:shadow-md"
                    >
                        <span className="text-xl font-bold text-theme-700">Plan Antiguo</span>
                        <span className="text-sm text-theme-500 mt-1 font-medium">Septiembre 2023 - TERM 202415</span>
                    </button>

                    <button
                        onClick={() => handleSelectPlan("202715")}
                        className="flex flex-col items-center justify-center p-5 bg-theme-500 text-white border-2 border-theme-600 rounded-2xl hover:bg-theme-600 transition-all group cursor-pointer relative overflow-hidden shadow-md hover:shadow-lg"
                    >
                        <div className="absolute top-0 right-0 bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-bl-lg backdrop-blur-sm">
                            NUEVO
                        </div>
                        <span className="text-xl font-bold text-white">Plan Modificado</span>
                        <span className="text-sm text-theme-100 mt-1 font-medium">Septiembre 2026 - TERM 202715</span>
                    </button>
                </div>

                <div className="mt-8 text-center text-xs text-gray-400">
                    Podrás cambiar tu plan más adelante desde la configuración de la malla.
                </div>
            </div>
        </div>
    );
};
