import MateriaCard from '../MateriaCard/MateriaCard';
import type { MateriaNode, ProgresoMalla } from '../../types/materia';

interface SemestreColumnProps {
    numeroSemestre: number;
    materiasDelSemestre: MateriaNode[];
    progreso: ProgresoMalla;
    onSelectMateria: (codigoMateria: string) => void;
    onToggleCursandoMateria: (codigoMateria: string) => void;
    onHoverMateria: (codigoMateria: string | null) => void;
    hoveredMateria: string | null;
    onToggleSemestre: (numeroSemestre: number) => void;
}

export const SemestreColumn = ({
    numeroSemestre,
    materiasDelSemestre,
    progreso,
    onSelectMateria,
    onToggleCursandoMateria,
    onHoverMateria,
    hoveredMateria,
    onToggleSemestre
}: SemestreColumnProps) => {

    // Verificamos si TODAS las materias están aprobadas visualmente, 
    // ignorando las que ni siquiera se pueden aprobar estructuralmente (bloqueadas absolutas).
    // Para simplificar, asumimos que si todas las cursables están aprobadas, check = verde.
    const materiasCursables = materiasDelSemestre.filter(m => progreso[m.codigoMateria] !== 'bloqueada');
    const todasAprobadas = materiasCursables.length > 0 && materiasCursables.every(m => progreso[m.codigoMateria] === 'aprobada');

    return (
        <div className="flex flex-col gap-3 min-w-[200px]">
            {/* Título de la Columna y Botón de Aprobar Todo */}
            <div className="flex items-center justify-between border-b-2 border-gray-300 pb-2 px-1">
                <h2 className="text-xl font-bold text-gray-500 uppercase tracking-widest flex-1 text-center">
                    Semestre {numeroSemestre}
                </h2>
                <button
                    onClick={() => onToggleSemestre(numeroSemestre)}
                    className={`ml-2 w-7 h-7 flex items-center justify-center rounded-full transition-all border-2 
                        ${todasAprobadas
                            ? 'bg-green-500 border-green-500 text-white hover:bg-green-600 hover:border-green-600'
                            : 'bg-white border-gray-300 text-gray-300 hover:text-green-500 hover:border-green-500'}`}
                    title={todasAprobadas ? "Desaprobar Semestre" : "Aprobar Semestre"}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                        <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z" clipRule="evenodd" />
                    </svg>
                </button>
            </div>

            {/* Las Tarjetas de esa Columna vertical */}
            {materiasDelSemestre.map(materiaInmutable => {
                // Combinamos los datos estáticos del Grafo con el Estado reactivo actual de la Malla
                const estadoDinamico = progreso[materiaInmutable.codigoMateria] || 'bloqueada';
                const materiaPaPintar = { ...materiaInmutable, estado: estadoDinamico };

                return (
                    <MateriaCard
                        key={materiaInmutable.codigoMateria}
                        materia={materiaPaPintar}
                        onClick={() => onSelectMateria(materiaInmutable.codigoMateria)}
                        onRightClick={() => onToggleCursandoMateria(materiaInmutable.codigoMateria)}
                        onMouseEnter={() => onHoverMateria(materiaInmutable.codigoMateria)}
                        onMouseLeave={() => onHoverMateria(null)}
                        isHovered={hoveredMateria === materiaInmutable.codigoMateria}
                    />
                );
            })}
        </div>
    );
};
