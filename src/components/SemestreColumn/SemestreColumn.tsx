import MateriaCard from '../MateriaCard/MateriaCard';
import type { MateriaNode, ProgresoMalla } from '../../types/materia';

interface SemestreColumnProps {
    numeroSemestre: number;
    materiasDelSemestre: MateriaNode[];
    progreso: ProgresoMalla;
    onSelectMateria: (codigoMateria: string) => void;
    onHoverMateria: (codigoMateria: string | null) => void;
    hoveredMateria: string | null;
}

export const SemestreColumn = ({
    numeroSemestre,
    materiasDelSemestre,
    progreso,
    onSelectMateria,
    onHoverMateria,
    hoveredMateria
}: SemestreColumnProps) => {
    return (
        <div className="flex flex-col gap-3 min-w-[200px]">
            {/* Título de la Columna */}
            <h2 className="text-xl font-bold text-center text-gray-500 uppercase tracking-widest border-b-2 border-gray-300 pb-2">
                Semestre {numeroSemestre}
            </h2>

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
                        onMouseEnter={() => onHoverMateria(materiaInmutable.codigoMateria)}
                        onMouseLeave={() => onHoverMateria(null)}
                        isHovered={hoveredMateria === materiaInmutable.codigoMateria}
                    />
                );
            })}
        </div>
    );
};
