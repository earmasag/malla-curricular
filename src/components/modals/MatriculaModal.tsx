import React from 'react';
import { Calculator, Info, AlertTriangle, AlertCircle, Check } from 'lucide-react';
import type { MateriaMatricula } from '../../services/MatriculaService';
import type { Sede, TipoCooperacion } from '../../types/matricula';
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
    const { perfil, desglose, tasaBCV, updatePerfil, handleCoberturaChange, coberturaDisplayValue, recargosPorTaxonomia } = useMatriculaModal(materiasCursando, isOpen);

    if (!isOpen) return null;

    const totalUc = materiasCursando.reduce((sum, m) => sum + m.unidadesCredito, 0);

    return (
        <div className="fixed inset-0 z-60 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4 sm:p-4 animate-fade-in text-sm sm:text-base">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90dvh] sm:max-h-[90vh] flex flex-col overflow-hidden animate-slide-up mb-2 sm:mb-0 mt-8 sm:mt-0 relative">

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
                            {/* Panel Superior (Grid 2 columnas) */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 shrink-0">
                                
                                {/* Lista de Materias Cursando (Primero) */}
                                <div className="bg-white p-3 sm:p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col">
                                    <h3 className="font-bold text-gray-800 mb-2 sm:mb-3 border-b pb-2 text-sm">Materias a Cursar</h3>
                                    <div className="flex flex-col gap-1.5 max-h-40 sm:max-h-56 overflow-y-auto pr-1">
                                        {materiasCursando.map(materia => (
                                            <div key={materia.codigoMateria} className="flex justify-between items-center text-sm p-2 rounded-md hover:bg-theme-50 border border-gray-100 transition-colors">
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-gray-700 leading-tight">{materia.nombre}</span>
                                                    <span className="text-xs text-gray-500 font-mono mt-0.5">{materia.codigoMateria}</span>
                                                </div>
                                                <div className="bg-theme-100 text-theme-800 font-bold px-2 py-1 rounded text-xs border border-theme-200 shrink-0 ml-2">
                                                    {materia.unidadesCredito} UC
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Panel de Configuración del Perfil (Segundo) */}
                                <div className="bg-white p-3 sm:p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col">
                                    <h3 className="font-bold text-gray-800 mb-2 sm:mb-3 border-b pb-2 text-sm">Configuración del Estudiante</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1">
                                        <label className="flex flex-col gap-1 focus-within:text-theme-600 transition-colors">
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

                                        <label className="flex flex-col gap-1 focus-within:text-theme-600 transition-colors">
                                            <span className="text-xs font-semibold uppercase tracking-wide">Sede:</span>
                                            <CustomSelect
                                                value={perfil.sede}
                                                onChange={(val) => updatePerfil('sede', val as Sede)}
                                                options={[
                                                    { value: 'ccs', label: 'Caracas' },
                                                    { value: 'g', label: 'Guayana' },
                                                    { value: 'tq', label: 'Los Teques' }
                                                ]}
                                            />
                                        </label>

                                        <label className="flex flex-col gap-1 focus-within:text-theme-600 transition-colors sm:col-span-2">
                                            <span className="text-xs font-semibold uppercase tracking-wide">Cooperación Económica:</span>
                                            <CustomSelect
                                                value={perfil.cooperacion}
                                                onChange={(val) => updatePerfil('cooperacion', val as TipoCooperacion)}
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
                                             <label className="flex flex-col gap-1 focus-within:text-theme-600 transition-colors sm:col-span-2 relative">
                                                <div className="flex justify-between items-end">
                                                    <span className="text-xs font-semibold uppercase tracking-wide">Cobertura (%):</span>
                                                </div>
                                                <div className="relative">
                                                    <input 
                                                        type="number"
                                                        min="0"
                                                        max="100"
                                                        className="w-full pl-3 pr-8 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-theme-50 focus:border-theme-400 hover:border-theme-300 shadow-sm transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                                        value={coberturaDisplayValue}
                                                        onChange={(e) => handleCoberturaChange(e.target.value)}
                                                        placeholder="Ej: 60"
                                                    />
                                                    <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none">
                                                        {perfil.coberturaPct > 0 && perfil.coberturaPct <= 100 ? (
                                                            <Check className="w-4 h-4 text-theme-500" strokeWidth={3} />
                                                        ) : (
                                                            <span className="text-gray-400 font-bold text-sm">%</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </label>
                                        )}

                                        <div className="flex flex-row flex-wrap justify-start gap-4 pt-1 sm:col-span-2">
                                            <div className="w-auto scale-90 origin-center">
                                                <CustomCheckbox
                                                    checked={perfil.esAlumnoNuevo}
                                                    onChange={(checked) => updatePerfil('esAlumnoNuevo', checked)}
                                                    label="Alumno Nuevo"
                                                />
                                            </div>
                                            <div className="w-auto scale-90 origin-center">
                                                <CustomCheckbox
                                                    checked={perfil.aplicaRetraso}
                                                    onChange={(checked) => updatePerfil('aplicaRetraso', checked)}
                                                    label="Retraso Mensual"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Panel Principal Desglose */}
                            {desglose && (
                                <div className="bg-white rounded-xl border border-theme-200 overflow-hidden shadow-sm shrink-0">
                                    <div className="bg-theme-50 p-4 border-b border-theme-100 flex flex-col sm:flex-row gap-4 items-center justify-between shrink-0">
                                        <div className="flex items-center gap-3 w-full sm:w-auto justify-center sm:justify-start">
                                            <div className="bg-white p-2 rounded-lg shadow-sm font-bold text-gray-700 text-center flex-1 sm:flex-none min-w-20">
                                                <div className="text-xl leading-none text-theme-600">{materiasCursando.length}</div>
                                                <div className="text-xs uppercase tracking-wider text-gray-400 mt-1">Materias</div>
                                            </div>
                                            <div className="bg-white p-2 rounded-lg shadow-sm font-bold text-gray-700 text-center flex-1 sm:flex-none min-w-20">
                                                <div className="text-xl leading-none text-theme-600">{totalUc}</div>
                                                <div className="text-xs uppercase tracking-wider text-gray-400 mt-1">Total UC</div>
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
                                        <div className="flex flex-col w-full">
                                            
                                            <div className="bg-white border border-gray-200 rounded-lg overflow-x-auto text-sm shadow-sm">
                                                <table className="w-full text-left">
                                                    <thead className="bg-gray-50 border-b border-gray-200 text-xs text-gray-500 uppercase tracking-wider">
                                                        <tr>
                                                            <th className="px-2 py-2 font-semibold">Concepto</th>
                                                            <th className="px-2 py-2 font-semibold text-right">P.U.</th>
                                                            <th className="px-2 py-2 font-semibold text-right">Cant.</th>
                                                            <th className="px-2 py-2 font-semibold text-right">Subtotal</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-gray-100">
                                                        <tr>
                                                            <td className="px-2 py-2.5 text-gray-700 font-medium text-xs sm:text-sm">Matrícula Base</td>
                                                            <td className="px-2 py-2.5 text-gray-500 text-right text-xs sm:text-sm whitespace-nowrap">${desglose.valorUC.toFixed(2)}</td>
                                                            <td className="px-2 py-2.5 text-gray-500 text-right text-xs sm:text-sm whitespace-nowrap">{desglose.ucbase} UC</td>
                                                            <td className="px-2 py-2.5 font-semibold text-right text-gray-700 whitespace-nowrap text-xs sm:text-sm">${(desglose.valorUC * desglose.ucbase).toFixed(2)}</td>
                                                        </tr>
                                                        {Object.entries(recargosPorTaxonomia).map(([tax, data]) => {
                                                            const costoExtraPorUC = desglose.valorUC * data.porcentaje;
                                                            const totalExtra = costoExtraPorUC * data.ucBase;
                                                            return (
                                                                <tr key={tax}>
                                                                    <td className="px-2 py-2.5 text-theme-600 font-medium text-xs sm:text-sm">Recargo {tax}</td>
                                                                    <td className="px-2 py-2.5 text-theme-500/80 text-right text-xs sm:text-sm whitespace-nowrap">+${costoExtraPorUC.toFixed(2)}</td>
                                                                    <td className="px-2 py-2.5 text-theme-500/80 text-right text-xs sm:text-sm whitespace-nowrap">{data.ucBase} UC</td>
                                                                    <td className="px-2 py-2.5 text-theme-600 font-semibold text-right whitespace-nowrap text-xs sm:text-sm">+${totalExtra.toFixed(2)}</td>
                                                                </tr>
                                                            );
                                                        })}
                                                        {/* Descuentos si aplican */}
                                                        {(() => {
                                                            const descInst = desglose.uctotal * (desglose.valorUC - desglose.vrealUC);
                                                            const descBeca = (desglose.uctotal - desglose.cooperacion.ucpagar) * desglose.vrealUC;
                                                            const totalDesc = descInst + descBeca;
                                                            
                                                            if (totalDesc === 0) return null;

                                                            return (
                                                                <>
                                                                    {descInst > 0 && (
                                                                        <tr className="bg-emerald-50/30">
                                                                            <td className="px-2 py-2 text-emerald-700 text-xs sm:text-sm">Sede/Carrera</td>
                                                                            <td className="px-2 py-2 text-emerald-600/80 text-right text-xs sm:text-sm whitespace-nowrap">-${(desglose.valorUC - desglose.vrealUC).toFixed(2)}</td>
                                                                            <td className="px-2 py-2 text-emerald-600/80 text-right text-xs sm:text-sm whitespace-nowrap">{desglose.uctotal} UC</td>
                                                                            <td className="px-2 py-2 text-emerald-700 font-medium text-right whitespace-nowrap text-xs sm:text-sm">-${descInst.toFixed(2)}</td>
                                                                        </tr>
                                                                    )}
                                                                    {descBeca > 0 && (
                                                                        <tr className="bg-emerald-50/30">
                                                                            <td className="px-2 py-2 text-emerald-700 text-xs sm:text-sm">Exoneración Coop.</td>
                                                                            <td className="px-2 py-2 text-emerald-600/80 text-right text-xs sm:text-sm whitespace-nowrap">-${desglose.vrealUC.toFixed(2)}</td>
                                                                            <td className="px-2 py-2 text-emerald-600/80 text-right text-xs sm:text-sm whitespace-nowrap">{(desglose.uctotal - desglose.cooperacion.ucpagar).toFixed(2)} UC</td>
                                                                            <td className="px-2 py-2 text-emerald-700 font-medium text-right whitespace-nowrap text-xs sm:text-sm">-${descBeca.toFixed(2)}</td>
                                                                        </tr>
                                                                    )}
                                                                    <tr className="bg-emerald-50/60 border-t border-emerald-100/50">
                                                                        <td colSpan={3} className="px-2 py-2 text-right font-bold text-emerald-800 text-xs uppercase tracking-wide">Total Descuentos:</td>
                                                                        <td className="px-2 py-2 font-bold text-emerald-700 text-right whitespace-nowrap text-xs sm:text-sm">-${totalDesc.toFixed(2)}</td>
                                                                    </tr>
                                                                </>
                                                            );
                                                        })()}
                                                    </tbody>
                                                    <tfoot className="bg-gray-50 border-t border-gray-200">
                                                        <tr>
                                                            <td colSpan={3} className="px-2 py-3 text-right font-bold text-gray-700 uppercase text-xs tracking-wider">Total a Pagar (Neto):</td>
                                                            <td className="px-2 py-3 font-black text-base sm:text-lg text-theme-600 text-right whitespace-nowrap">${desglose.mensualidadUSD.toFixed(2)}</td>
                                                        </tr>
                                                    </tfoot>
                                                </table>
                                            </div>
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
                                                                <span className="text-xs bg-theme-200 px-1.5 py-0.5 rounded text-theme-800 hidden sm:inline">{pago.descripcion}</span>
                                                            </span>
                                                            <span className="font-bold shrink-0">${pago.montoUSD.toFixed(2)}</span>
                                                        </div>
                                                        <div className="text-right text-xs text-gray-500 mt-0.5 opacity-80">
                                                             Bs. {pago.montoBs.toFixed(2)}
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                            <div className="text-xs text-center text-gray-400 mt-4 italic">
                                                Tasa BCV Estimada: Bs. {tasaBCV}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="mt-2 text-xs text-amber-700 bg-amber-50/80 p-3 sm:p-4 rounded-xl border border-amber-200/60 flex gap-3 items-start">
                                <Info className="w-5 h-5 shrink-0 text-amber-500 mt-0.5" />
                                <p>
                                    <strong>Nota importante:</strong> Este es un cálculo referencial y estimado para facilitar la planificación. 
                                    Los montos y condiciones definitivas deben ser verificados directamente con la 
                                    administración de la universidad; no debe confiarse a cabalidad en esta herramienta como presupuesto oficial.
                                </p>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};
