import React from 'react';
import { X } from 'lucide-react';
import MateriaCard from '../malla/MateriaCard';
import type { MateriaNode } from '../../types/materia';

interface LeyendaModalProps {
    isOpen: boolean;
    onClose: () => void;
    tituloCarrera: string;
    totalSemestres: number;
    totalUc: number;
    areasFormacion: { areaFormacion: string; colorCodigo: string; }[];
}

export const LeyendaModal: React.FC<LeyendaModalProps> = ({ 
    isOpen, 
    onClose, 
    tituloCarrera,
    totalSemestres, 
    totalUc, 
    areasFormacion 
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm transition-opacity">
            <div
                className="bg-[#f0f2f5] rounded-3xl w-full max-w-2xl max-h-[90vh] shadow-2xl relative animate-in fade-in zoom-in-95 duration-200 flex flex-col overflow-hidden"
                onClick={(e) => e.stopPropagation()}
                style={{ fontFamily: 'sans-serif' }}
            >
                {/* Header Unificado */}
                <div className="bg-white z-10 flex w-full border-b-[3px] border-gray-300 shadow-sm items-center justify-between px-6 py-4 rounded-t-3xl shrink-0">
                    <div className="font-extrabold text-[12px] sm:text-lg tracking-wider uppercase flex-1 text-[#1e293b] flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-center">
                        <span>{tituloCarrera}</span> 
                        <span className="hidden sm:inline text-gray-300">|</span> 
                        <span className="text-blue-700">{totalSemestres} SEMESTRES</span> 
                        <span className="text-gray-300">|</span> 
                        <span className="text-amber-600">{totalUc} UC</span>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors shrink-0 ml-2"
                    >
                        <X className="w-5 h-5 sm:w-6 sm:h-6" />
                    </button>
                </div>

                <div className="px-6 sm:px-8 flex flex-col gap-10 w-full mt-6 items-start pb-8 overflow-y-auto">

                        {/* Áreas de Formación */}
                        <div className="flex flex-col gap-4 w-full">
                            <span className="font-black text-lg text-gray-800 uppercase tracking-wider relative w-max pb-1">
                                Áreas de Formación
                                <div className="absolute bottom-0 left-0 w-full h-[3px] bg-blue-500 rounded-full"></div>
                            </span>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-3">
                                {areasFormacion.map((area, idx) => (
                                    <div key={idx} className="flex items-center gap-3 bg-white px-3 py-2 border border-gray-200 rounded-lg shadow-sm">
                                        <div className="w-5 h-5 rounded-[4px] border border-gray-400 shrink-0 shadow-inner" style={{ backgroundColor: area.colorCodigo }}></div>
                                        <span className="text-sm font-semibold text-gray-800 uppercase leading-tight" style={{ fontFamily: "'Oswald', sans-serif" }}>{area.areaFormacion}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Card Schema & Acronyms */}
                        <div className="flex flex-col gap-4 w-full">
                            <span className="font-black text-lg text-gray-800 uppercase tracking-wider relative max-w-full pb-1">
                                Estructura de la Materia
                                <div className="absolute bottom-0 left-0 w-full h-[3px] bg-purple-500 rounded-full"></div>
                            </span>
                            
                            <div className="flex flex-col items-center gap-8 bg-white p-5 sm:p-6 rounded-2xl border border-gray-200 shadow-sm w-full">
                                {/* Card mock */}
                                <div className="shrink-0 pointer-events-none transform drop-shadow-sm scale-105 my-2">
                                    <MateriaCard materia={{
                                        id: 'mock',
                                        codigoMateria: 'CÓDIGO',
                                        nombre: 'NOMBRE ASIGNATURA',
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
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 w-full text-sm text-gray-800 bg-gray-50 p-5 rounded-xl border border-gray-100">
                                    <div className="flex sm:items-center gap-2.5"><span className="font-black bg-white text-gray-800 px-1.5 py-0.5 border border-gray-200 rounded shadow-sm text-xs w-10 text-center">M</span> Modalidad</div>
                                    <div className="flex sm:items-center gap-2.5"><span className="font-black bg-white text-gray-800 px-1.5 py-0.5 border border-gray-200 rounded shadow-sm text-xs w-10 text-center">P</span> Presencial</div>
                                    <div className="flex sm:items-center gap-2.5"><span className="font-black bg-white text-gray-800 px-1.5 py-0.5 border border-gray-200 rounded shadow-sm text-xs w-10 text-center">V</span> Virtual</div>
                                    <div className="flex sm:items-center gap-2.5"><span className="font-black bg-white text-gray-800 px-1.5 py-0.5 border border-gray-200 rounded shadow-sm text-xs w-10 text-center">P/V</span> Pres. o Vir.</div>
                                    <div className="flex sm:items-center gap-2.5"><span className="font-black bg-white text-gray-800 px-1.5 py-0.5 border border-gray-200 rounded shadow-sm text-xs w-10 text-center">TAX</span> Taxonomía</div>
                                    <div className="flex sm:items-center gap-2.5"><span className="font-black bg-white text-gray-800 px-1.5 py-0.5 border border-gray-200 rounded shadow-sm text-xs w-10 text-center">HT</span> Horas Teoría</div>
                                    <div className="flex sm:items-center gap-2.5"><span className="font-black bg-white text-gray-800 px-1.5 py-0.5 border border-gray-200 rounded shadow-sm text-xs w-10 text-center">HP</span> Horas Práctica</div>
                                    <div className="flex sm:items-center gap-2.5"><span className="font-black bg-white text-gray-800 px-1.5 py-0.5 border border-gray-200 rounded shadow-sm text-xs w-10 text-center">HL</span> Horas Laborat.</div>
                                    <div className="flex sm:items-center gap-2.5"><span className="font-black bg-white text-gray-800 px-1.5 py-0.5 border border-gray-200 rounded shadow-sm text-xs w-10 text-center">TI</span> Trabajo Indep.</div>
                                    <div className="flex sm:items-center gap-2.5"><span className="font-black bg-white text-gray-800 px-1.5 py-0.5 border border-gray-200 rounded shadow-sm text-xs w-10 text-center">TH</span> Total (clas.+ind.)</div>
                                </div>
                            </div>
                        </div>

                        {/* Requisitos */}
                        <div className="flex flex-col gap-4 w-full">
                            <span className="font-black text-lg text-gray-800 uppercase tracking-wider relative max-w-full pb-1">
                                Dependencias y Requisitos
                                <div className="absolute bottom-0 left-0 w-full h-[3px] bg-amber-500 rounded-full"></div>
                            </span>

                            <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-10 bg-white p-6 sm:px-10 rounded-2xl border border-gray-200 shadow-sm w-full mx-auto justify-center">

                                <div className="flex flex-col gap-6 py-2 w-full sm:w-auto">
                                    <div className="flex items-center gap-4 justify-start sm:justify-start">
                                        <div className="w-16 h-[2px] bg-black relative shrink-0">
                                            <div className="absolute -right-1 -top-[4px] w-2.5 h-2.5 border-t-2 border-r-2 border-black rotate-45"></div>
                                        </div>
                                        <span className="text-sm font-bold text-gray-800 uppercase tracking-widest whitespace-nowrap" style={{ fontFamily: "'Oswald', sans-serif" }}>Prerrequisito</span>
                                    </div>

                                    <div className="flex items-center gap-4 justify-start sm:justify-start">
                                        <div className="w-16 h-[2px] border-b-[2.5px] border-dotted border-black relative shrink-0">
                                            <div className="absolute -right-[2px] -top-[4px] w-2.5 h-2.5 border-t-2 border-r-2 border-black rotate-45 bg-white"></div>
                                        </div>
                                        <span className="text-sm font-bold text-gray-800 uppercase tracking-widest whitespace-nowrap" style={{ fontFamily: "'Oswald', sans-serif" }}>Correquisito</span>
                                    </div>
                                </div>

                                <div className="hidden sm:block w-px bg-gray-200 h-20 self-center shrink-0"></div>
                                <div className="sm:hidden h-px bg-gray-200 w-full"></div>

                                <div className="flex items-center gap-4 py-2 w-full sm:w-auto justify-start sm:justify-start">
                                    <div className="relative flex flex-col items-center shrink-0">
                                        <span className="text-[11px] font-black mb-px leading-none bg-yellow-300 text-yellow-900 border border-yellow-400 px-1 rounded shadow-sm absolute -top-4 z-10 w-max" style={{ fontFamily: "'Oswald', sans-serif" }}># UC</span>
                                        <div className="w-16 h-[2.5px] bg-black relative mt-1">
                                            <div className="absolute -right-1 -top-[4px] w-2.5 h-2.5 border-t-2 border-r-2 border-black rotate-45"></div>
                                        </div>
                                    </div>
                                    <span className="text-sm font-bold text-gray-800 uppercase tracking-widest leading-tight w-32" style={{ fontFamily: "'Oswald', sans-serif" }}>Prerrequisito por Créditos</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    );
};
