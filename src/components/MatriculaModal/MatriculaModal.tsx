import React, { useState, useMemo } from 'react';
import { X, Calculator, Info, AlertTriangle } from 'lucide-react';
import { MatriculaService, type StudentProfile, type MateriaMatricula } from '../../services/MatriculaService';
import { CustomSelect } from '../CustomSelect';
import { CustomCheckbox } from '../CustomCheckbox';

interface MatriculaModalProps {
    isOpen: boolean;
    onClose: () => void;
    materiasCursando: MateriaMatricula[];
}

const matriculaService = new MatriculaService();

export const MatriculaModal: React.FC<MatriculaModalProps> = ({ isOpen, onClose, materiasCursando }) => {
    // Estado del perfil del estudiante para cálculo interactivo
    const [perfil, setPerfil] = useState<StudentProfile>({
        esSedeGuayana: true,
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
        <div className="fixed inset-0 z-60 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4 sm:p-4 animate-fade-in text-sm sm:text-base">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90dvh] sm:max-h-[90vh] flex flex-col overflow-hidden animate-slide-up mb-2 sm:mb-0 mt-8 sm:mt-0 relative">

                {/* Indicador visual móvil */}
                <div className="w-full flex justify-center pt-2 pb-2 sm:hidden absolute top-0 left-0 z-10 pointer-events-none">
                    <div className="w-12 h-1.5 bg-white/30 rounded-full"></div>
                </div>

                {/* Header */}
                <div className="flex items-center justify-between px-5 sm:px-6 py-4 sm:py-4 pt-6 bg-green-500 border-b border-green-600 text-white shrink-0">
                    <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2">
                        <Calculator className="w-5 h-5 sm:w-6 sm:h-6" />
                        Cálculo de Matrícula
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-full transition-colors shrink-0"
                        title="Cerrar"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Área con scroll */}
                <div className="flex-1 overflow-y-auto overscroll-contain p-4 sm:p-6 bg-gray-50 flex flex-col gap-5 sm:gap-6 pb-8 sm:pb-6">
                    {materiasCursando.length === 0 ? (
                        <div className="text-center py-12 flex flex-col items-center justify-center text-gray-400 h-full">
                            <AlertTriangle className="w-16 h-16 mb-4 text-amber-400" />
                            <h3 className="text-lg font-bold text-gray-600">Sin Materias en Curso</h3>
                            <p className="max-w-md mt-2 px-4 sm:px-0 text-sm sm:text-base">No tienes materias marcadas como "cursando" actualmente (color azul). Marca algunas materias en la malla para simular sus costos de matrícula.</p>
                        </div>
                    ) : (
                        <>
                            {/* Panel de Configuración del Perfil */}
                            <div className="bg-white p-4 sm:p-5 rounded-xl border border-gray-200 shadow-sm shrink-0">
                                <h3 className="font-bold text-gray-800 mb-3 sm:mb-4 border-b pb-2">Configuración del Estudiante</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <label className="flex flex-col gap-1.5 focus-within:text-green-600 transition-colors">
                                        <span className="text-xs font-semibold uppercase tracking-wide">Carrera:</span>
                                        <CustomSelect
                                            value={perfil.carrera}
                                            onChange={(val) => setPerfil({ ...perfil, carrera: val as any })}
                                            options={[
                                                { value: 'sinDescuento', label: 'Informática / Otra' },
                                                { value: 'educacion', label: 'Educación' },
                                                { value: 'letras', label: 'Letras' },
                                                { value: 'filosofia', label: 'Filosofía' }
                                            ]}
                                        />
                                    </label>

                                    <div className="flex flex-col gap-2.5 pt-1">
                                        <CustomCheckbox
                                            checked={!perfil.esSedeGuayana}
                                            onChange={(checked) => setPerfil({ ...perfil, esSedeGuayana: !checked })}
                                            label="Sede Caracas"
                                        />

                                        <CustomCheckbox
                                            checked={perfil.esAlumnoNuevo}
                                            onChange={(checked) => setPerfil({ ...perfil, esAlumnoNuevo: checked })}
                                            label="Es Alumno Nuevo"
                                        />

                                        <CustomCheckbox
                                            checked={perfil.esIntensivo}
                                            onChange={(checked) => setPerfil({ ...perfil, esIntensivo: checked })}
                                            label="Cursos Intensivos"
                                        />

                                        <CustomCheckbox
                                            checked={perfil.aplicaRetraso}
                                            onChange={(checked) => setPerfil({ ...perfil, aplicaRetraso: checked })}
                                            label="Aplica Retraso Mensual"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Panel Principal Desglose */}
                            {desglose && (
                                <div className="bg-white rounded-xl border border-green-200 overflow-hidden shadow-sm shrink-0">
                                    <div className="bg-green-50 p-4 border-b border-green-100 flex flex-col sm:flex-row gap-4 items-center justify-between shrink-0">
                                        <div className="flex items-center gap-3 w-full sm:w-auto justify-center sm:justify-start">
                                            <div className="bg-white p-2 rounded-lg shadow-sm font-bold text-gray-700 text-center flex-1 sm:flex-none min-w-20">
                                                <div className="text-xl leading-none text-green-600">{materiasCursando.length}</div>
                                                <div className="text-[10px] uppercase tracking-wider text-gray-400 mt-1">Materias</div>
                                            </div>
                                            <div className="bg-white p-2 rounded-lg shadow-sm font-bold text-gray-700 text-center flex-1 sm:flex-none min-w-20">
                                                <div className="text-xl leading-none text-blue-600">{totalUc}</div>
                                                <div className="text-[10px] uppercase tracking-wider text-gray-400 mt-1">Total UC</div>
                                            </div>
                                        </div>

                                        <div className="text-center sm:text-right w-full sm:w-auto flex-1 bg-white sm:bg-transparent p-3 sm:p-0 rounded-lg shadow-sm sm:shadow-none border border-green-100 sm:border-none">
                                            <div className="text-xs text-green-600 font-bold uppercase tracking-wider mb-1">Total Semestre</div>
                                            <div className="text-3xl font-black text-gray-800">${desglose.totalFinal.toFixed(2)}</div>
                                        </div>
                                    </div>

                                    <div className="p-4 sm:p-5 grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                                        {/* Columna 1: Desglose */}
                                        <div className="flex flex-col">
                                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Desglose General</h4>
                                            <ul className="space-y-3 text-sm">
                                                <li className="flex justify-between items-center text-gray-700">
                                                    <span>Materias y Recargos:</span>
                                                    <span className="font-semibold">${desglose.costoMaterias.toFixed(2)}</span>
                                                </li>
                                                <li className="flex justify-between items-center text-gray-700">
                                                    <span>Inscripción y Confirmación:</span>
                                                    <span className="font-semibold">${(desglose.derechoInscripcion + desglose.derechoConfirmacion).toFixed(2)}</span>
                                                </li>
                                                {(desglose.descuentoSede + desglose.descuentoCarrera) > 0 && (
                                                    <li className="flex justify-between items-center text-green-600">
                                                        <span>Descuentos (Becas/Sede):</span>
                                                        <span className="font-bold">-${(desglose.descuentoSede + desglose.descuentoCarrera).toFixed(2)}</span>
                                                    </li>
                                                )}
                                                {(desglose.recargosTaxonomia + desglose.recargoIntensivo) > 0 && (
                                                    <li className="flex justify-between items-center text-red-500">
                                                        <span>Recargos Adicionales:</span>
                                                        <span className="font-bold">+${(desglose.recargosTaxonomia + desglose.recargoIntensivo).toFixed(2)}</span>
                                                    </li>
                                                )}
                                                <li className="flex justify-between items-center text-gray-800 font-bold pt-2 border-t mt-2">
                                                    <span className="uppercase text-xs tracking-wider">Costo Neto:</span>
                                                    <span className="text-base">${desglose.totalFinal.toFixed(2)}</span>
                                                </li>
                                            </ul>
                                        </div>

                                        {/* Columna 2: Pagos */}
                                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex flex-col">
                                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1">
                                                <Info className="w-3 h-3 shrink-0" /> Cronograma (5 Cuotas)
                                            </h4>
                                            <ul className="space-y-2 text-sm font-medium">
                                                {desglose.pagosMensuales.map((pago: number, idx: number) => (
                                                    <li key={idx} className={`flex justify-between items-center p-2 rounded ${idx === 0 || idx === 3 ? 'bg-blue-50 text-blue-800' : 'text-gray-600 hover:bg-gray-100'}`}>
                                                        <span className="flex items-center gap-2">
                                                            {idx + 1}° Pago
                                                            {idx === 0 && <span className="text-[10px] bg-blue-100 px-1.5 py-0.5 rounded text-blue-700 hidden sm:inline">Incluye Inscrip.</span>}
                                                            {idx === 3 && <span className="text-[10px] bg-blue-100 px-1.5 py-0.5 rounded text-blue-700 hidden sm:inline">Incluye Confirm.</span>}
                                                        </span>
                                                        <span className="font-bold shrink-0">${pago.toFixed(2)}</span>
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
