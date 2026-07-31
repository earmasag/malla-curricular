import React from 'react';
import { Calculator, Info, AlertTriangle, AlertCircle, Check } from 'lucide-react';
import type { MateriaMatricula } from '../../services/MatriculaService';
import { CustomSelect } from '../ui/CustomSelect';
import { CustomCheckbox } from '../ui/CustomCheckbox';
import { ModalHeader } from './shared/ModalHeader';
import { useMatriculaModal } from '../../hooks/ui/useMatriculaModal';

export interface MatriculaModalProps {
    isOpen: boolean;
    onClose: () => void;
    materiasCursando: MateriaMatricula[];
}

export const MatriculaModal: React.FC<MatriculaModalProps> = ({ isOpen, onClose, materiasCursando }) => {
    const { perfil, desglose, tasaBCV, updatePerfil, handleCoberturaChange, coberturaDisplayValue } = useMatriculaModal(materiasCursando, isOpen);

    if (!isOpen) return null;

    const totalUc = materiasCursando.reduce((sum, m) => sum + m.unidadesCredito, 0);

    return (
        <div className="fixed inset-0 z-60 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4 sm:p-4 animate-fade-in text-sm sm:text-base">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90dvh] sm:max-h-[90vh] flex flex-col overflow-hidden animate-slide-up mb-2 sm:mb-0 mt-8 sm:mt-0 relative">

                {/* Indicador visual móvil */}
                <div className="w-full flex justify-center pt-2 pb-2 sm:hidden absolute top-0 left-0 z-10 pointer-events-none">
                    <div className="w-12 h-1.5 bg-white/30 rounded-full"></div>
                </div>

                <ModalHeader 
                    title="Cálculo de Matrícula" 
                    icon={<Calculator />} 
                    onClose={onClose} 
                />

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
                                    <label className="flex flex-col gap-1.5 focus-within:text-theme-600 transition-colors">
                                        <span className="text-xs font-semibold uppercase tracking-wide">Carrera:</span>
                                        <CustomSelect
                                            value={perfil.carrera}
                                            onChange={(val) => updatePerfil('carrera', val as string)}
                                            options={[
                                                { value: 'sinDescuento', label: 'Informática / Otra' },
                                                { value: 'educacion', label: 'Educación' },
                                                { value: 'letras', label: 'Letras' },
                                                { value: 'filosofia', label: 'Filosofía' }
                                            ]}
                                        />
                                    </label>

                                    <label className="flex flex-col gap-1.5 focus-within:text-theme-600 transition-colors">
                                        <span className="text-xs font-semibold uppercase tracking-wide">Sede:</span>
                                        <CustomSelect
                                            value={perfil.sede}
                                            onChange={(val) => updatePerfil('sede', val as any)}
                                            options={[
                                                { value: 'ccs', label: 'Caracas' },
                                                { value: 'g', label: 'Guayana' },
                                                { value: 'tq', label: 'Los Teques' }
                                            ]}
                                        />
                                    </label>

                                    <label className="flex flex-col gap-1.5 focus-within:text-theme-600 transition-colors md:col-span-2">
                                        <span className="text-xs font-semibold uppercase tracking-wide">Cooperación Económica:</span>
                                        <CustomSelect
                                            value={perfil.cooperacion}
                                            onChange={(val) => updatePerfil('cooperacion', val as any)}
                                            options={[
                                                { value: 'ninguna', label: 'Ninguna' },
                                                { value: 'beca', label: 'Beca' },
                                                { value: 'prop', label: 'Proporcional' },
                                                { value: 'fab', label: 'F.A.B.' },
                                                { value: 'baup', label: 'Beca A Un Pana (BAUP)' }
                                            ]}
                                        />
                                    </label>

                                    {perfil.cooperacion !== 'ninguna' && (
                                         <label className="flex flex-col gap-1.5 focus-within:text-theme-600 transition-colors md:col-span-2 relative">
                                            <div className="flex justify-between items-end">
                                                <span className="text-xs font-semibold uppercase tracking-wide">Porcentaje de Cobertura (%):</span>
                                                <span className="text-[10px] text-gray-400 font-medium tracking-wide">MÍN: 0% - MÁX: 100%</span>
                                            </div>
                                            <div className="relative">
                                                <input 
                                                    type="number"
                                                    min="0"
                                                    max="100"
                                                    className="w-full pl-4 pr-10 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl focus:outline-none focus:ring-4 focus:ring-theme-50 focus:border-theme-400 hover:border-theme-300 shadow-sm transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                                    value={coberturaDisplayValue}
                                                    onChange={(e) => handleCoberturaChange(e.target.value)}
                                                    placeholder="Ej: 60"
                                                />
                                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                                    {perfil.coberturaPct > 0 && perfil.coberturaPct <= 100 ? (
                                                        <Check className="w-5 h-5 text-theme-500" strokeWidth={3} />
                                                    ) : (
                                                        <span className="text-gray-400 font-bold">%</span>
                                                    )}
                                                </div>
                                            </div>
                                        </label>
                                    )}

                                    <div className="flex flex-row flex-wrap justify-center gap-6 pt-2 md:col-span-2">
                                        <div className="w-auto">
                                            <CustomCheckbox
                                                checked={perfil.esAlumnoNuevo}
                                                onChange={(checked) => updatePerfil('esAlumnoNuevo', checked)}
                                                label="Es Alumno Nuevo"
                                            />
                                        </div>
                                        <div className="w-auto">
                                            <CustomCheckbox
                                                checked={perfil.aplicaRetraso}
                                                onChange={(checked) => updatePerfil('aplicaRetraso', checked)}
                                                label="Aplica Retraso Mensual"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Lista de Materias Cursando */}
                            <div className="bg-white p-4 sm:p-5 rounded-xl border border-gray-200 shadow-sm shrink-0">
                                <h3 className="font-bold text-gray-800 mb-3 sm:mb-4 border-b pb-2">Materias a Cursar</h3>
                                <div className="flex flex-col gap-2 max-h-48 overflow-y-auto pr-1">
                                    {materiasCursando.map(materia => (
                                        <div key={materia.codigoMateria} className="flex justify-between items-center text-sm p-2 sm:p-3 rounded-lg hover:bg-theme-50 border border-gray-100 transition-colors">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-gray-700">{materia.nombre}</span>
                                                <span className="text-xs text-gray-500 font-mono mt-0.5">{materia.codigoMateria}</span>
                                            </div>
                                            <div className="bg-theme-100 text-theme-800 font-bold px-2.5 py-1 rounded-md text-xs border border-theme-200 shrink-0 ml-3">
                                                {materia.unidadesCredito} UC
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Panel Principal Desglose */}
                            {desglose && (
                                <div className="bg-white rounded-xl border border-theme-200 overflow-hidden shadow-sm shrink-0">
                                    <div className="bg-theme-50 p-4 border-b border-theme-100 flex flex-col sm:flex-row gap-4 items-center justify-between shrink-0">
                                        <div className="flex items-center gap-3 w-full sm:w-auto justify-center sm:justify-start">
                                            <div className="bg-white p-2 rounded-lg shadow-sm font-bold text-gray-700 text-center flex-1 sm:flex-none min-w-20">
                                                <div className="text-xl leading-none text-theme-600">{materiasCursando.length}</div>
                                                <div className="text-[10px] uppercase tracking-wider text-gray-400 mt-1">Materias</div>
                                            </div>
                                            <div className="bg-white p-2 rounded-lg shadow-sm font-bold text-gray-700 text-center flex-1 sm:flex-none min-w-20">
                                                <div className="text-xl leading-none text-theme-600">{totalUc}</div>
                                                <div className="text-[10px] uppercase tracking-wider text-gray-400 mt-1">Total UC</div>
                                            </div>
                                        </div>

                                        <div className="text-center sm:text-right w-full sm:w-auto flex-1 bg-white sm:bg-transparent p-3 sm:p-0 rounded-lg shadow-sm sm:shadow-none border border-theme-100 sm:border-none">
                                            <div className="text-xs text-theme-600 font-bold uppercase tracking-wider mb-1">Total Semestre</div>
                                            <div className="text-3xl font-black text-gray-800">${desglose.totalSemestreUSD.toFixed(2)}</div>
                                            <div className="text-xs text-gray-500 font-medium mt-1">Bs. {desglose.totalSemestreBs.toFixed(2)}</div>
                                        </div>
                                    </div>

                                    {desglose.cooperacion.ucfuera > 0 && (
                                        <div className="bg-red-50 p-4 border-b border-red-100 flex flex-col gap-3 text-red-800 text-sm">
                                            <div className="flex items-start gap-2">
                                                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-500" />
                                                <p>
                                                    Tienes <strong>{desglose.cooperacion.ucfuera.toFixed(2)} UC</strong> fuera de cobertura. Estas UC se cobrarán completas sin el porcentaje de cooperación.
                                                </p>
                                            </div>
                                            <div className="ml-7 pl-3 border-l-2 border-red-200 flex flex-col gap-1">
                                                {desglose.cooperacion.excesoLimite > 0 && (
                                                    <p>
                                                        • <strong>{desglose.cooperacion.excesoLimite.toFixed(2)} UC</strong> por exceder el límite de tu beca ({desglose.cooperacion.limiteBeca} UC).
                                                    </p>
                                                )}
                                                {desglose.cooperacion.materiasConRecargo.length > 0 && (
                                                    <div>
                                                        <p>• <strong>{desglose.ucre.toFixed(2)} UC</strong> por recargos de taxonomía en las siguientes materias:</p>
                                                        <ul className="list-disc ml-5 mt-1 opacity-90">
                                                            {desglose.cooperacion.materiasConRecargo.map((m, i) => (
                                                                <li key={i}>{m.nombre} <i className="text-xs">({m.taxonomia})</i>: <strong>+{m.ucRecargo.toFixed(2)} UC</strong></li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    <div className="p-4 sm:p-5 grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                                        {/* Columna 1: Desglose */}
                                        <div className="flex flex-col">
                                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Desglose General</h4>
                                            <ul className="space-y-3 text-sm">
                                                <li className="flex justify-between items-center text-gray-700 border-b pb-2">
                                                    <span>Base / Valor UC:</span>
                                                    <span className="font-semibold text-xs text-gray-500">${desglose.valorUC} (Real: ${desglose.vrealUC})</span>
                                                </li>
                                                <li className="flex justify-between items-center text-gray-700">
                                                    <span>UC Puras:</span>
                                                    <span className="font-semibold">{desglose.ucbase} UC</span>
                                                </li>
                                                {desglose.ucre > 0 && (
                                                     <li className="flex justify-between items-center text-theme-600">
                                                        <span>Recargos Taxonomía:</span>
                                                        <span className="font-bold">+{desglose.ucre.toFixed(2)} UC</span>
                                                    </li>
                                                )}
                                                <li className="flex justify-between items-center text-gray-700 border-t pt-2 mt-2">
                                                    <span>UC a Pagar (Costo Neto):</span>
                                                    <span className="font-semibold">{desglose.cooperacion.ucpagar.toFixed(2)} UC</span>
                                                </li>
                                            </ul>
                                        </div>

                                        {/* Columna 2: Pagos */}
                                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex flex-col">
                                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1">
                                                <Info className="w-3 h-3 shrink-0" /> Cronograma (5 Cuotas)
                                            </h4>
                                            <ul className="space-y-2 text-sm font-medium">
                                                {desglose.pagosMensuales.map((pago, idx) => (
                                                    <li key={idx} className={`flex flex-col p-2 rounded ${idx === 0 || idx === 3 ? 'bg-theme-100 text-theme-800' : 'text-gray-600 hover:bg-gray-100'}`}>
                                                        <div className="flex justify-between items-center">
                                                            <span className="flex items-center gap-2">
                                                                {pago.numero}° Pago
                                                                <span className="text-[10px] bg-theme-200 px-1.5 py-0.5 rounded text-theme-800 hidden sm:inline">{pago.descripcion}</span>
                                                            </span>
                                                            <span className="font-bold shrink-0">${pago.montoUSD.toFixed(2)}</span>
                                                        </div>
                                                        <div className="text-right text-[10px] text-gray-500 mt-0.5 opacity-80">
                                                             Bs. {pago.montoBs.toFixed(2)}
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                            <div className="text-[10px] text-center text-gray-400 mt-4 italic">
                                                Tasa BCV Estimada: Bs. {tasaBCV}
                                            </div>
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
