import type { MateriaNode, EstadoMateria } from '../../types/materia';

interface SidebarProps {
    materiaSeleccionada: MateriaNode | null;
    estadoActual: EstadoMateria | null;
    onToggleAprobacion: () => void;
    onClose: () => void;
}

export const Sidebar = ({ materiaSeleccionada, estadoActual, onToggleAprobacion, onClose }: SidebarProps) => {
    if (!materiaSeleccionada) {
        return (
            <div className="w-[380px] min-w-[380px] bg-white h-full border-l border-gray-200 shadow-2xl p-8 flex flex-col items-center justify-center text-gray-400 text-center transition-all duration-300">
                <svg className="w-16 h-16 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" /></svg>
                <p className="font-semibold text-lg text-gray-500">Haz clic en una materia</p>
                <p className="text-sm mt-2">Para ver todos sus detalles, prequisitos y gestionarla.</p>
            </div>
        );
    }

    const isAprobada = estadoActual === 'aprobada';
    const isBloqueada = estadoActual === 'bloqueada';
    const isDisponible = estadoActual === 'disponible';

    return (
        <div className="w-[380px] min-w-[380px] bg-white h-full border-l border-gray-200 shadow-2xl flex flex-col relative overflow-y-auto transition-all duration-300">
            {/* Header / Botón Cerrar */}
            <div className="sticky top-0 bg-white/90 backdrop-blur pb-2 pt-6 px-6 z-10 flex justify-between items-start">
                <div className="pr-4">
                    <p className="text-sm font-bold text-gray-400 mb-1 tracking-widest uppercase">{materiaSeleccionada.codigoMateria}</p>
                    <h2 className="text-2xl font-black text-gray-800 leading-tight">{materiaSeleccionada.nombre}</h2>
                </div>
                <button
                    onClick={onClose}
                    className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold transition-colors cursor-pointer"
                >
                    ✕
                </button>
            </div>

            {/* Contenido scrolleable */}
            <div className="p-6 flex flex-col gap-6 flex-1">

                {/* Badges */}
                <div className="flex flex-wrap gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide
                        ${isAprobada ? 'bg-green-100 text-green-700' :
                            isDisponible ? 'bg-blue-100 text-blue-700' :
                                'bg-gray-100 text-gray-600'}`}>
                        {estadoActual}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-bold tracking-wide">
                        {materiaSeleccionada.unidadesCredito} UC
                    </span>
                </div>

                {/* Info Grid */}
                <div className="bg-gray-50 rounded-xl p-4 grid grid-cols-2 gap-4 border border-gray-100">
                    <div>
                        <p className="text-xs text-gray-500 font-semibold mb-1">Semestre</p>
                        <p className="text-md font-bold text-gray-800">{materiaSeleccionada.semestre}</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 font-semibold mb-1">Área Formación</p>
                        <p className="text-sm font-bold text-gray-800">{materiaSeleccionada.areaFormacion}</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 font-semibold mb-1">Taxonomía</p>
                        <p className="text-sm font-bold text-gray-800">{materiaSeleccionada.taxonomia}</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 font-semibold mb-1">Modalidad</p>
                        <p className="text-sm font-bold text-gray-800">{materiaSeleccionada.modalidad}</p>
                    </div>
                </div>

                {/* Desglose de Horas */}
                <div className="border-t border-gray-100 pt-4">
                    <h3 className="text-sm font-bold text-gray-700 mb-3">Distribución de Horas (Total: {materiaSeleccionada.horasTotales}h)</h3>
                    <div className="flex gap-2">
                        <div className="flex-1 bg-gray-50 p-2 text-center rounded-lg border border-gray-100">
                            <p className="text-[10px] text-gray-500 font-bold">Teo</p>
                            <p className="font-black text-gray-700">{materiaSeleccionada.horasTeoricas}</p>
                        </div>
                        <div className="flex-1 bg-gray-50 p-2 text-center rounded-lg border border-gray-100">
                            <p className="text-[10px] text-gray-500 font-bold">Prac</p>
                            <p className="font-black text-gray-700">{materiaSeleccionada.horasPracticas}</p>
                        </div>
                        <div className="flex-1 bg-gray-50 p-2 text-center rounded-lg border border-gray-100">
                            <p className="text-[10px] text-gray-500 font-bold">Lab</p>
                            <p className="font-black text-gray-700">{materiaSeleccionada.horasLaboratorio}</p>
                        </div>
                        <div className="flex-1 bg-gray-50 p-2 text-center rounded-lg border border-gray-100">
                            <p className="text-[10px] text-gray-500 font-bold">Aut</p>
                            <p className="font-black text-gray-700">{materiaSeleccionada.horasAutonomas}</p>
                        </div>
                    </div>
                </div>

                {/* UC Requeridas */}
                {materiaSeleccionada.ucRequeridas > 0 && (
                    <div className="border-t border-gray-100 pt-4">
                        <p className="text-sm text-amber-700 bg-amber-50 p-3 rounded-lg border border-amber-100 inline-flex items-center gap-2">
                            ⚠️ Requiere tener {materiaSeleccionada.ucRequeridas} UC aprobadas en total.
                        </p>
                    </div>
                )}
            </div>

            {/* Bottom Action Area */}
            <div className="p-6 bg-gray-50 border-t border-gray-200">
                <button
                    onClick={onToggleAprobacion}
                    disabled={isBloqueada}
                    className={`w-full py-4 rounded-xl font-bold text-lg shadow-sm transition-all
                        ${isBloqueada
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            : isAprobada
                                ? 'bg-red-100 text-red-700 hover:bg-red-200 border border-red-200 cursor-pointer'
                                : 'bg-green-600 text-white hover:bg-green-700 hover:shadow-md cursor-pointer'
                        }
                    `}
                >
                    {isBloqueada ? "🔐 Materia Bloqueada" : isAprobada ? "Deshacer Aprobación ↩" : "✓ Marcar Aprobada"}
                </button>
            </div>
        </div>
    );
};
