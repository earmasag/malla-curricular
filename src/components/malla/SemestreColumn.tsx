import { memo } from 'react';
import MateriaCard from './MateriaCard';
import type { MateriaNode, ProgresoMalla } from '../../types/materia';
import { useMallaData, useMallaHover } from '../../contexts/MallaContexts';

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
}

export const SemestreColumn = memo(({
    numeroSemestre,
    materiasDelSemestre,
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

    // Verificamos si TODAS las materias del semestre están aprobadas visualmente.
    // Un semestre solo se marca con check verde si no queda ninguna materia pendiente, sin importar su estado.
    const todasAprobadas = materiasDelSemestre.length > 0 && materiasDelSemestre.every(m => progreso[m.codigoMateria] === 'aprobada');

    return (
        <div className="flex flex-col gap-3 min-w-50">
            {/* Título de la Columna y Botón de Aprobar Todo */}
            <div className="flex items-center justify-between border-b-2 border-gray-300 pb-2 px-1">
                <h2 className="text-xl font-bold text-gray-500 uppercase tracking-widest flex-1 text-center">
                    Semestre {numeroSemestre}
                </h2>
                {!hideActions && (
                    <button
                        onClick={() => onToggleSemestre(numeroSemestre)}
                        className={`ml-2 w-7 h-7 flex items-center justify-center rounded-full transition-all border-2 cursor-pointer
                            ${todasAprobadas
                                ? 'bg-green-500 border-green-500 text-white hover:bg-green-600 hover:border-green-600'
                                : 'bg-white border-gray-300 text-gray-300 hover:text-green-500 hover:border-green-500'}`}
                        title={todasAprobadas ? "Desaprobar Semestre" : "Aprobar Semestre"}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                            <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z" clipRule="evenodd" />
                        </svg>
                    </button>
                )}
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
