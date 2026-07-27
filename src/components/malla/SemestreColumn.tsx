import { memo } from 'react';
import MateriaCard from './MateriaCard';
import type { MateriaNode, ProgresoMalla } from '../../types/materia';
import { useMallaData, useMallaHover } from '../../contexts/MallaContexts';
import { useSemestreColumn } from '../../hooks/malla/useSemestreColumn';

// Wrapper memoizado que se conecta al micro-contexto de hover
// Solo los wrappers re-evalúan en hover, protegiendo a las columnas
const MateriaCardWrapper = memo(({ 
    materiaInmutable, 
    progreso, 
    onSelectMateria, 
    onToggleCursandoMateria 
}: {
    materiaInmutable: MateriaNode;
    progreso: ProgresoMalla;
    onSelectMateria: (id: string) => void;
    onToggleCursandoMateria: (id: string) => void;
}) => {
    const { hover: { hoveredMateria, setHoveredMateria } } = useMallaHover();
    const estadoDinamico = progreso[materiaInmutable.codigoMateria] || 'bloqueada';
    const materiaPaPintar = { ...materiaInmutable, estado: estadoDinamico };

    return (
        <MateriaCard
            materia={materiaPaPintar}
            onClick={() => onSelectMateria(materiaInmutable.codigoMateria)}
            onRightClick={() => onToggleCursandoMateria(materiaInmutable.codigoMateria)}
            onMouseEnter={() => setHoveredMateria(materiaInmutable.codigoMateria)}
            onMouseLeave={() => setHoveredMateria(null)}
            isHovered={hoveredMateria === materiaInmutable.codigoMateria}
        />
    );
});

interface SemestreColumnProps {
    numeroSemestre: number;
    materiasDelSemestre: MateriaNode[];
    acumUC: number;
}

export const SemestreColumn = memo(({
    numeroSemestre,
    materiasDelSemestre,
    acumUC
}: SemestreColumnProps) => {

    // 1. Contextos para mitigar el Prop Bloat
    const { estadoMalla, estadoCustom, accionesMalla, accionesCustom } = useMallaData();
    // Ya no consumimos useMallaUI ni useMallaHover aquí, protegiendo la columna de re-renders por hover

    // 2. Data Mapeada
    const { isCustomRouteMode, customProgreso } = estadoCustom;
    const progreso = isCustomRouteMode ? customProgreso : estadoMalla.progreso;
    const hideActions = isCustomRouteMode;

    const onSelectMateria = isCustomRouteMode ? accionesCustom.toggleCustomMateria : accionesMalla.toggleAprobacion;
    const onToggleCursandoMateria = isCustomRouteMode ? () => { } : accionesMalla.toggleCursando;
    const onToggleSemestre = isCustomRouteMode ? () => { } : accionesMalla.toggleSemestre;

    // Hooks
    const { todasAprobadas, stats } = useSemestreColumn({
        numeroSemestre,
        materiasDelSemestre,
        progreso,
        isCustomRouteMode,
        acumUC
    });
    
    const { totalHT, totalHP, totalHL, totalHAut, totalUC } = stats;

    return (
        <div id={numeroSemestre === 1 ? "tour-malla-grid" : undefined} className="flex flex-col gap-3 min-w-50 items-center">
            {/* Título de la Columna y Botón de Aprobar Todo */}
            <div className="relative flex w-48 h-13.5 bg-white border-[3px] border-theme-600 select-none group">
                
                {/* Botón de Aprobar Todo superpuesto */}
                {!hideActions && (
                    <button
                        onClick={() => onToggleSemestre(numeroSemestre)}
                        className={`absolute -top-3 -right-3 z-50 w-7 h-7 flex items-center justify-center rounded-full transition-all border-2 cursor-pointer shadow-sm
                            ${todasAprobadas
                                ? 'bg-theme-500 border-theme-500 text-white hover:bg-theme-600 hover:border-theme-600'
                                : 'bg-white border-gray-300 text-gray-300 hover:text-theme-500 hover:border-theme-500 opacity-0 group-hover:opacity-100'}`}
                        title={todasAprobadas ? "Desaprobar Semestre" : "Aprobar Semestre"}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                            <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z" clipRule="evenodd" />
                        </svg>
                    </button>
                )}

                {/* Decorador Izquierdo */}
                {numeroSemestre === 1 ? (
                    <div className="absolute left-0 top-0 w-5.5 h-full bg-theme-500 border-r-[3px] border-theme-600 flex items-center justify-center z-10">
                        <span className="text-white text-[9px] font-bold tracking-[0.2em] uppercase" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
                            Ingreso
                        </span>
                    </div>
                ) : (
                    <div className="absolute left-0 top-0 w-4 h-full z-10 overflow-hidden text-theme-500">
                        <svg width="100%" height="100%" preserveAspectRatio="none">
                            <polygon points="0,0 100,50 0,100" fill="currentColor" />
                            <polyline points="0,0 100,50 0,100" fill="none" stroke="currentColor" className="text-theme-600" strokeWidth="6" vectorEffect="non-scaling-stroke" strokeLinejoin="miter" />
                        </svg>
                    </div>
                )}

                {/* Círculo de UC (Esquina Inferior Derecha) */}
                <div 
                    className="absolute -bottom-2.5 -right-2.5 z-40 w-8 h-8 rounded-full bg-theme-500 border-2 border-white flex items-center justify-center text-[11px] font-extrabold text-white shadow-md"
                    title="Unidades de Crédito del Semestre"
                >
                    {totalUC}
                </div>

                {/* Contenido Central */}
                <div className={`flex-1 flex flex-col justify-center relative z-0 ${numeroSemestre === 1 ? 'ml-5.5' : 'ml-3.5'} mr-2`}>
                    <div className="text-[13px] font-extrabold uppercase italic tracking-wider text-theme-900 ml-1.5 leading-none mb-1" style={{ fontFamily: "'Oswald', sans-serif" }}>
                        Semestre {numeroSemestre.toString().padStart(2, '0')}
                    </div>
                    <div className="flex items-center ml-1.5 gap-0.5">
                        <div className="w-4.5 h-4 bg-theme-50 border border-theme-200 flex items-center justify-center text-[10px] font-bold text-theme-900" title="Horas Teóricas">{totalHT}</div>
                        <div className="w-4.5 h-4 bg-theme-50 border border-theme-200 flex items-center justify-center text-[10px] font-bold text-theme-900" title="Horas Prácticas">{totalHP}</div>
                        <div className="w-4.5 h-4 bg-theme-50 border border-theme-200 flex items-center justify-center text-[10px] font-bold text-theme-900" title="Horas de Laboratorio">{totalHL}</div>
                        <div className="w-4.5 h-4 bg-theme-50 border border-theme-200 flex items-center justify-center text-[10px] font-bold text-theme-900" title="Horas Autónomas">{totalHAut}</div>
                        
                        {!isCustomRouteMode && (
                            <div className="ml-0.5 px-1 h-4 bg-theme-100 flex items-center justify-center text-[9.5px] font-bold text-theme-900 whitespace-nowrap tracking-tight">
                                ACUM: {acumUC}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Las Tarjetas de esa Columna vertical */}
            {materiasDelSemestre.map(materiaInmutable => (
                <MateriaCardWrapper
                    key={materiaInmutable.codigoMateria}
                    materiaInmutable={materiaInmutable}
                    progreso={progreso}
                    onSelectMateria={onSelectMateria}
                    onToggleCursandoMateria={onToggleCursandoMateria}
                />
            ))}
        </div>
    );
});
