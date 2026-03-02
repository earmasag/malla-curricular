import planEstudioJSON from '../data/plan_estudio.json';
import { useMallaCurricular } from '../hooks/useMallaCurricular';
import { MallaCurricularBuilder } from '../core/MallaCurricularBuilder';
import type { MateriaJSON } from '../types/materia';
import { SemestreColumn } from '../components/SemestreColumn/SemestreColumn';
import MallaConnections from '../components/MallaConnections/MallaConnections';
import React from 'react';
const builder = new MallaCurricularBuilder();
const materiaData = planEstudioJSON as unknown as MateriaJSON[];
const malla = builder.build(materiaData);

console.log(malla.getAllNodes());

export const MallaPage = () => {
    const { progreso, cantidadAprobadas, ucAcumuladas, toggleAprobacion } = useMallaCurricular(malla);
    const [hoveredMateria, setHoveredMateria] = React.useState<string | null>(null);

    // 1. Array de los números de semestre [1, 2, 3...]
    const totalSemestres = malla.getTotalSemestres();
    const semestresArray = Array.from({ length: totalSemestres }, (_, i) => i + 1);

    return (
        <div className="flex h-screen w-screen bg-gray-100 font-sans m-0 overflow-hidden ">

            {/* Main Content Area (Scrollable Dashboard + Grid) */}
            <div className="flex-1 flex flex-col h-full overflow-y-auto">
                <div className="pr-8 pl-8">
                    {/* Cabecera / Dashboard */}
                    <header className="mb-10 text-center">
                        <h1 className="text-4xl font-black text-gray-800 mb-4">Mi Malla Curricular</h1>
                        <div className="flex justify-center gap-8 text-lg font-semibold text-gray-700">
                            <div className="bg-white px-6 py-3 rounded-xl shadow-sm border border-gray-200">
                                📚 Materias Aprobadas: <span className="text-blue-600">{cantidadAprobadas}</span>
                            </div>
                            <div className="bg-white px-6 py-3 rounded-xl shadow-sm border border-gray-200">
                                ⭐ UC Acumuladas: <span className="text-blue-600">{ucAcumuladas}</span>
                            </div>
                        </div>
                    </header>

                    {/* Grilla Horizontal con Scroll que agrupa Columnas Verticales */}
                    <div className="relative flex flex-row overflow-x-auto gap-8 px-4 items-start max-w-[95vw] mx-auto pb-4 pt-10">

                        {/* Flechas de Prerrequisitos dibujadas por debajo de las materias */}
                        <MallaConnections grafo={malla} progreso={progreso} hoveredMateria={hoveredMateria} />

                        {semestresArray.map((numeroSemestre) => {
                            // Le pedimos al Grafo solo las materias de esta columna
                            const materiasDelSemestre = malla.getMateriasPorSemestre(numeroSemestre);

                            return (
                                <SemestreColumn
                                    key={`semestre-${numeroSemestre}`}
                                    numeroSemestre={numeroSemestre}
                                    materiasDelSemestre={materiasDelSemestre}
                                    progreso={progreso}
                                    onSelectMateria={toggleAprobacion}
                                    onHoverMateria={setHoveredMateria}
                                    hoveredMateria={hoveredMateria}
                                />
                            );
                        })}
                    </div>
                </div>
            </div>


        </div>
    );
};
