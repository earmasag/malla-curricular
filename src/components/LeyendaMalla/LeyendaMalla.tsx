
import MateriaCard from '../MateriaCard/MateriaCard';
import type { MateriaNode } from '../../types/materia';

export interface LeyendaMallaProps {
    tituloCarrera: string;
    totalSemestres: number;
    totalUc: number;
    areasFormacion: { areaFormacion: string; colorCodigo: string }[];
}

export const LeyendaMalla: React.FC<LeyendaMallaProps> = ({
    tituloCarrera,
    totalSemestres,
    totalUc,
    areasFormacion
}) => {
    return (
        <div className="bg-[#e4e6e8] rounded-xl p-4 flex flex-col gap-3 shadow-md border border-gray-300 select-none w-full md:w-max max-w-full" style={{ fontFamily: 'sans-serif' }}>
            {/* Header */}
            <div className="font-black text-lg tracking-wide text-gray-900 border-b border-gray-300 pb-1 flex w-full">
                <div className="bg-white px-3 py-1 rounded-t-lg -mb-[5px] border-t border-l border-r border-gray-300 shadow-sm relative z-10 uppercase">
                    {tituloCarrera} • {totalSemestres} SEMESTRES • {totalUc} UC
                </div>
                <div className="flex-1"></div>
            </div>

            <div className="flex flex-col lg:flex-row gap-6 mt-1 items-start">


                {/* Areas de Formacion */}
                <div className="flex flex-col gap-1">
                    <span className="font-bold text-lg mb-1 uppercase">Áreas de Formación:</span>
                    <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 pl-1">
                        {areasFormacion.map((area, idx) => (
                            <div key={idx} className="flex items-center gap-1.5">
                                <div className="w-5 h-4 rounded-sm border-[1.5px] border-black" style={{ backgroundColor: area.colorCodigo }}></div>
                                <span className="text-l text-black leading-none" style={{ fontFamily: "'Oswald', sans-serif" }}>{area.areaFormacion}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="hidden lg:block w-px bg-gray-300 h-28 mx-2"></div>
                <div className="lg:hidden h-px bg-gray-300 w-full my-1"></div>

                {/* Card Schema & Acronyms */}
                <div className="flex flex-col gap-1.5">
                    <div className="flex flex-col sm:flex-row gap-8 items-center h-full">
                        {/* Card mock */}
                        <div className="mt-2 shrink-0 pointer-events-none transform origin-left drop-shadow-sm scale-110">
                            <MateriaCard materia={{
                                id: 'mock',
                                codigoMateria: 'CÓDIGO',
                                nombre: 'NOMBRE DE LA ASIGNATURA',
                                horasTeoricas: 'HT' as unknown as number,
                                horasPracticas: 'HP' as unknown as number,
                                horasLaboratorio: 'HL' as unknown as number,
                                horasPresenciales: 0,
                                horasAutonomas: 'TI' as unknown as number,
                                horasTotales: 'TH' as unknown as number,
                                unidadesCredito: 'UC' as unknown as number,
                                tipo: '',
                                modalidad: 'M',
                                taxonomia: 'TAX',
                                areaFormacion: 'Extensión Social',
                                semestre: 0,
                                ucRequeridas: 0,
                                estado: 'disponible'
                            } as MateriaNode} />
                        </div>

                        {/* Acronyms */}
                        <div className="flex flex-col sm:flex-row gap-x-6 gap-y-3 w-full text-l text-black pt-1 leading-[1.3]">
                            {/* Columna Izquierda: Modalidad y relacionados */}
                            <div className="flex flex-col gap-1.5 flex-1 w-full">
                                <span><span className="font-bold">M:</span> Modalidad</span>
                                <span className="ml-4"><span className="font-bold">P:</span> Presencial</span>
                                <span className="ml-4"><span className="font-bold">V:</span> Virtual</span>
                                <span className="ml-4"><span className="font-bold">P/V:</span> Presen. o Virtual</span>
                                <span><span className="font-bold">TAX:</span> Taxonomía asignatura</span>
                            </div>

                            {/* Columna Derecha: Horas */}
                            <div className="flex flex-col gap-1.5 flex-1 w-full">
                                <span><span className="font-bold">HT:</span> Horas Teoría</span>
                                <span><span className="font-bold">HP:</span> Horas Práctica</span>
                                <span><span className="font-bold">HL:</span> Horas Laboratorio</span>
                                <span><span className="font-bold">TI:</span> Horas de Trabajo Indep.</span>
                                <span><span className="font-bold">TH:</span> Total Horas (clases+indep.)</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="hidden lg:block w-px bg-gray-300 h-28 mx-2"></div>
                <div className="lg:hidden h-px bg-gray-300 w-full my-1"></div>

                {/* Requisitos */}
                <div className="flex flex-col gap-1 shrink-0">
                    <span className="font-bold text-sm uppercase mb-1">Requisitos:</span>

                    <div className="flex items-center gap-3">
                        <div className="w-10 h-[2px] bg-black relative">
                            <div className="absolute -right-px -top-[4px] w-2.5 h-2.5 border-t-2 border-r-2 border-black rotate-45"></div>
                        </div>
                        <span className="text-l text-black" style={{ fontFamily: "'Oswald', sans-serif" }}>Prerrequisito</span>
                    </div>

                    <div className="flex items-center gap-3 mt-1">
                        <div className="w-10 h-0 border-t-2 border-dotted border-black relative">
                            <div className="absolute -right-px -top-[5px] w-2.5 h-2.5 border-t-2 border-r-2 border-black rotate-45"></div>
                        </div>
                        <span className="text-l text-black" style={{ fontFamily: "'Oswald', sans-serif" }}>Correquisito</span>
                    </div>

                    <div className="flex items-center gap-3 mt-1.5">
                        <div className="relative flex flex-col items-center">
                            <span className="text-[10px] font-bold mb-px leading-none [text-shadow:0_0_2px_#fff]"># UC</span>
                            <div className="w-10 h-[2px] bg-black relative">
                                <div className="absolute -right-px -top-[4px] w-2.5 h-2.5 border-t-2 border-r-2 border-black rotate-45"></div>
                            </div>
                        </div>
                        <span className="text-l text-black leading-tight w-32" style={{ fontFamily: "'Oswald', sans-serif" }}>Prerrequisito por Unidades Crédito (UC)</span>
                    </div>

                </div>
            </div>
        </div>
    );
};
