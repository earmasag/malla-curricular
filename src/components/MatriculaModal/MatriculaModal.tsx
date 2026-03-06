import React, { useState, useMemo } from 'react';
import { X, Calculator, Info, AlertTriangle } from 'lucide-react';
import { MatriculaService, type StudentProfile, type MateriaMatricula } from '../../services/MatriculaService';

interface MatriculaModalProps {
    isOpen: boolean;
    onClose: () => void;
    materiasCursando: MateriaMatricula[];
}

const matriculaService = new MatriculaService();

export const MatriculaModal: React.FC<MatriculaModalProps> = ({ isOpen, onClose, materiasCursando }) => {
    // Estado del perfil del estudiante para cálculo interactivo
    const [perfil, setPerfil] = useState<StudentProfile>({
        esSedeGuayana: false,
        carrera: "sinDescuento",
        esAlumnoNuevo: false,
        aplicaRetraso: false,
        esIntensivo: false
    });

    // Calcular desglose cuando el perfil o las materias cambian
    const desglose = useMemo(() => {
        if (!isOpen || materiasCursando.length === 0) return null;
        return matriculaService.calcularDesglose(materiasCursando, perfil);
    }, [isOpen, materiasCursando, perfil]);

    if (!isOpen) return null;

    const totalUc = materiasCursando.reduce((sum, m) => sum + m.unidadesCredito, 0);

    return (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in text-sm sm:text-base">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-slide-up">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 bg-green-500 border-b border-green-600 text-white">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <Calculator className="w-6 h-6" />
                        Cálculo de Matrícula
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-full transition-colors"
                        title="Cerrar"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 bg-gray-50 flex flex-col gap-6">
                    {materiasCursando.length === 0 ? (
                        <div className="text-center py-12 flex flex-col items-center justify-center text-gray-400">
                            <AlertTriangle className="w-16 h-16 mb-4 text-amber-400" />
                            <h3 className="text-lg font-bold text-gray-600">Sin Materias en Curso</h3>
                            <p className="max-w-md mt-2">No tienes materias marcadas como "cursando" actualmente (color azul). Marca algunas materias en la malla para simular sus costos de matrícula.</p>
                        </div>
                    ) : (
                        <>
                            {/* Panel de Configuración del Perfil */}
                            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                                <h3 className="font-bold text-gray-800 mb-4 border-b pb-2">Configuración del Estudiante</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <label className="flex flex-col gap-1">
                                        <span className="text-xs font-semibold text-gray-600 uppercase">Carrera:</span>
                                        <select
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5"
                                            value={perfil.carrera}
                                            onChange={(e) => setPerfil({ ...perfil, carrera: e.target.value as any })}
                                        >
                                            <option value="sinDescuento">Informática / Otra</option>
                                            <option value="educacion">Educación</option>
                                            <option value="letras">Letras</option>
                                            <option value="filosofia">Filosofía</option>
                                        </select>
                                    </label>

                                    <div className="flex flex-col gap-2 pt-1">
                                        <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700 font-medium">
                                            <input type="checkbox" checked={!perfil.esSedeGuayana} onChange={(e) => setPerfil({ ...perfil, esSedeGuayana: !e.target.checked })} className="rounded text-green-500 focus:ring-green-500 w-4 h-4" />
                                            Sede Caracas
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700 font-medium">
                                            <input type="checkbox" checked={perfil.esAlumnoNuevo} onChange={(e) => setPerfil({ ...perfil, esAlumnoNuevo: e.target.checked })} className="rounded text-green-500 focus:ring-green-500 w-4 h-4" />
                                            Es Alumno Nuevo
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700 font-medium">
                                            <input type="checkbox" checked={perfil.esIntensivo} onChange={(e) => setPerfil({ ...perfil, esIntensivo: e.target.checked })} className="rounded text-green-500 focus:ring-green-500 w-4 h-4" />
                                            Cursos Intensivos
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700 font-medium">
                                            <input type="checkbox" checked={perfil.aplicaRetraso} onChange={(e) => setPerfil({ ...perfil, aplicaRetraso: e.target.checked })} className="rounded text-green-500 focus:ring-green-500 w-4 h-4" />
                                            Aplica Retraso Mensual
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* Panel Principal Desglose */}
                            {desglose && (
                                <div className="bg-white rounded-xl border border-green-200 overflow-hidden shadow-sm">
                                    <div className="bg-green-50 p-4 border-b border-green-100 flex flex-wrap gap-4 items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-white p-2 rounded-lg shadow-sm font-bold text-gray-700 text-center min-w-16">
                                                <div className="text-xl leading-none text-green-600">{materiasCursando.length}</div>
                                                <div className="text-[10px] uppercase tracking-wider text-gray-400 mt-1">Materias</div>
                                            </div>
                                            <div className="bg-white p-2 rounded-lg shadow-sm font-bold text-gray-700 text-center min-w-16">
                                                <div className="text-xl leading-none text-blue-600">{totalUc}</div>
                                                <div className="text-[10px] uppercase tracking-wider text-gray-400 mt-1">Total UC</div>
                                            </div>
                                        </div>

                                        <div className="text-right flex-1">
                                            <div className="text-xs text-green-600 font-bold uppercase tracking-wider mb-1">Total Semestre</div>
                                            <div className="text-3xl font-black text-gray-800">${desglose.totalFinal.toFixed(2)}</div>
                                        </div>
                                    </div>

                                    <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-8">
                                        {/* Columna 1: Desglose */}
                                        <div>
                                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Desglose General</h4>
                                            <ul className="space-y-3 text-sm">
                                                <li className="flex justify-between items-center text-gray-700">
                                                    <span>Materias y Recargos:</span>
                                                    <span className="font-semibold">${desglose.costoMaterias.toFixed(2)}</span>
                                                </li>
                                                <li className="flex justify-between items-center text-gray-700">
                                                    <span>Derechos de Inscripción:</span>
                                                    <span className="font-semibold">${desglose.derechoInscripcion.toFixed(2)}</span>
                                                </li>
                                                {desglose.montoDescuentos > 0 && (
                                                    <li className="flex justify-between items-center text-green-600">
                                                        <span>Descuentos (Becas/Sede):</span>
                                                        <span className="font-bold">-${desglose.montoDescuentos.toFixed(2)}</span>
                                                    </li>
                                                )}
                                                {desglose.montoRecargos > 0 && (
                                                    <li className="flex justify-between items-center text-red-500">
                                                        <span>Recargos Adicionales:</span>
                                                        <span className="font-bold">+${desglose.montoRecargos.toFixed(2)}</span>
                                                    </li>
                                                )}
                                                <li className="flex justify-between items-center text-gray-800 font-bold pt-2 border-t mt-2">
                                                    <span className="uppercase text-xs tracking-wider">Costo Neto:</span>
                                                    <span className="text-base">${desglose.totalFinal.toFixed(2)}</span>
                                                </li>
                                            </ul>
                                        </div>

                                        {/* Columna 2: Pagos */}
                                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1">
                                                <Info className="w-3 h-3" /> Cronograma (5 Cuotas)
                                            </h4>
                                            <ul className="space-y-2 text-sm font-medium">
                                                {desglose.pagosMensuales.map((pago, idx) => (
                                                    <li key={idx} className={`flex justify-between items-center p-2 rounded ${idx === 0 || idx === 3 ? 'bg-blue-50 text-blue-800' : 'text-gray-600 hover:bg-gray-100'}`}>
                                                        <span className="flex items-center gap-2">
                                                            {idx + 1}° Pago
                                                            {idx === 0 && <span className="text-[10px] bg-blue-100 px-1.5 py-0.5 rounded text-blue-700 hidden sm:inline">Incluye Inscrip.</span>}
                                                            {idx === 3 && <span className="text-[10px] bg-blue-100 px-1.5 py-0.5 rounded text-blue-700 hidden sm:inline">Incluye Confirm.</span>}
                                                        </span>
                                                        <span className="font-bold">${pago.toFixed(2)}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};
