import React from 'react';
import { Calculator, Info, AlertTriangle, Check } from 'lucide-react';
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

interface FacturaRowProps {
    concepto: string;
    pu: string;
    cant: string;
    subtotal: string;
    variant?: 'default' | 'recargo' | 'descuento';
    prefix?: '+' | '-';
}

const FacturaRow: React.FC<FacturaRowProps> = ({
    concepto,
    pu,
    cant,
    subtotal,
    variant = 'default',
    prefix
}) => {
    let rowBg = 'bg-white text-gray-700';
    let conceptoClass = 'text-xs sm:text-sm font-medium';
    let puClass = 'text-xs sm:text-sm text-gray-500';
    let cantClass = 'text-xs sm:text-sm text-gray-500';
    let subtotalClass = 'text-xs sm:text-sm font-semibold';

    if (variant === 'recargo') {
        rowBg = 'bg-theme-50/40 text-theme-800';
        puClass = 'text-xs sm:text-sm text-theme-600/80';
        cantClass = 'text-xs sm:text-sm text-theme-600/80';
        subtotalClass = 'text-xs sm:text-sm font-semibold';
    } else if (variant === 'descuento') {
        rowBg = 'bg-gray-50 text-gray-600';
        conceptoClass = 'text-xs sm:text-sm italic';
        subtotalClass = 'text-xs sm:text-sm font-medium';
    }

    const formatValue = (val: string) => prefix ? `${prefix}${val}` : val;

    return (
        <li className={`flex justify-between items-center px-3 py-2 ${rowBg}`}>
            <span className={`flex-1 min-w-0 pr-2 ${conceptoClass}`}>{concepto}</span>
            <span className={`w-16 sm:w-20 text-right ${puClass} whitespace-nowrap shrink-0`}>{formatValue(pu)}</span>
            <span className={`w-20 sm:w-24 text-right ${cantClass} whitespace-nowrap shrink-0`}>{cant}</span>
            <span className={`w-20 sm:w-24 text-right ${subtotalClass} whitespace-nowrap shrink-0`}>{formatValue(subtotal)}</span>
        </li>
    );
};

export const MatriculaModal: React.FC<MatriculaModalProps> = ({ isOpen, onClose, materiasCursando }) => {
    const { perfil, desglose, updatePerfil, handleCoberturaChange, coberturaDisplayValue, recargosPorTaxonomia } = useMatriculaModal(materiasCursando, isOpen);

    if (!isOpen) return null;

    const totalUc = materiasCursando.reduce((sum, m) => sum + m.unidadesCredito, 0);

    const fmtUSD = (n: number) => n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const fmtBs  = (n: number) => n.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

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
                                            <div className="text-3xl font-black text-gray-800">${fmtUSD(desglose.totalSemestreUSD)}</div>
                                            <div className="text-xs text-gray-500 font-medium mt-1">Bs. {fmtBs(desglose.totalSemestreBs)}</div>
                                        </div>
                                    </div>

                                    {desglose.cooperacion.materiasConRecargo.length > 0 && (
                                        <div className="bg-blue-50/60 px-4 py-3 border-b border-blue-100 flex items-start gap-2.5 text-blue-800 text-sm">
                                            <Info className="w-4 h-4 shrink-0 mt-0.5 text-blue-400" />
                                            <div className="flex flex-col gap-1">
                                                <p className="text-blue-700">
                                                    Nota: Las siguientes materias tienen un recargo por taxonomía que <span className="font-semibold">no está cubierto por tu cooperación económica</span>:
                                                </p>
                                                <ul className="flex flex-col gap-0.5 mt-0.5">
                                                    {desglose.cooperacion.materiasConRecargo.map((m, i) => (
                                                        <li key={i} className="flex flex-wrap gap-x-1.5 items-center text-blue-600 text-xs">
                                                            <span className="font-medium text-blue-700">{m.nombre}</span>
                                                            <span className="bg-blue-100 text-blue-600 rounded px-1.5 py-0.5 font-mono">{m.taxonomia}</span>
                                                            <span className="text-blue-500">→ {(m.porcentaje * 100).toFixed(0)}% recargo sobre {m.ucBase} UC</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    )}

                                    <div className="p-4 sm:p-5 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                                        {/* Columna 1: Desglose */}
                                        <div className="flex flex-col gap-2 h-full">
                                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                                                <Info className="w-3 h-3 shrink-0" /> Factura Proforma (Mensualidad)
                                            </h4>
                                            <div className="bg-gray-50 border border-gray-200 rounded-lg overflow-hidden flex flex-col flex-1">
                                                {/* Cabecera de columnas */}
                                                <div className="flex justify-between items-center px-3 py-2 bg-gray-100/80 border-b border-gray-200 text-xs text-gray-500 uppercase tracking-wider font-semibold">
                                                    <span className="flex-1 min-w-0 pr-2">Concepto</span>
                                                    <span className="w-16 sm:w-20 text-right shrink-0">P.U.</span>
                                                    <span className="w-20 sm:w-24 text-right shrink-0">Cant.</span>
                                                    <span className="w-20 sm:w-24 text-right shrink-0">Subtotal</span>
                                                </div>
                                                <ul className="divide-y divide-gray-200 text-sm font-medium flex-1">
                                                    {/* Matrícula Base */}
                                                    <FacturaRow
                                                        concepto="Matrícula Base"
                                                        pu={`$${fmtUSD(desglose.valorUC)}`}
                                                        cant={`${desglose.ucBase} UC`}
                                                        subtotal={`$${fmtUSD(desglose.valorUC * desglose.ucBase)}`}
                                                    />

                                                    {/* Recargos por Taxonomía */}
                                                    {Object.entries(recargosPorTaxonomia).map(([tax, data]) => {
                                                        const costoExtraPorUC = desglose.valorUC * data.porcentaje;
                                                        const totalExtra = costoExtraPorUC * data.ucBase;
                                                        return (
                                                            <FacturaRow
                                                                key={tax}
                                                                variant="recargo"
                                                                prefix="+"
                                                                concepto={`Recargo ${tax}`}
                                                                pu={`$${fmtUSD(costoExtraPorUC)}`}
                                                                cant={`${data.ucBase} UC`}
                                                                subtotal={`$${fmtUSD(totalExtra)}`}
                                                            />
                                                        );
                                                    })}

                                                    {/* Descuentos */}
                                                    {(() => {
                                                        // El descuento total es la diferencia entre
                                                        // el monto bruto (sin descuentos ni beca) y la mensualidad neta.
                                                        const ucPagarBruto = desglose.cooperacion.ucPagar;
                                                        const montoBruto   = ucPagarBruto * desglose.valorUC;
                                                        const totalDesc    = montoBruto - desglose.mensualidadUSD;

                                                        if (totalDesc <= 0) return null;

                                                        const pctDesc = (desglose.descuentoCarreraPct || 0) + (desglose.descuentoSedePct || 0);
                                                        return (
                                                            <>
                                                                {pctDesc > 0 && (
                                                                    <FacturaRow
                                                                        variant="descuento"
                                                                        prefix="-"
                                                                        concepto="Dto. Sede/Carrera"
                                                                        pu={`${(pctDesc * 100).toFixed(0)}%`}
                                                                        cant={`${ucPagarBruto.toFixed(2)} UC`}
                                                                        subtotal={`$${fmtUSD(totalDesc)}`}
                                                                    />
                                                                )}
                                                                <li className="flex justify-between items-center px-3 py-2 bg-gray-100/70 border-t border-gray-200 text-gray-700">
                                                                    <span className="flex-1 text-right text-xs font-bold uppercase tracking-wide pr-2">Total Descuentos:</span>
                                                                    <span className="w-20 sm:w-24 text-right text-xs sm:text-sm font-bold whitespace-nowrap shrink-0">-${fmtUSD(totalDesc)}</span>
                                                                </li>
                                                            </>
                                                        );
                                                    })()}
                                                </ul>
                                                {/* Total a Pagar */}
                                                <div className="flex justify-between items-center px-3 py-2.5 bg-theme-50 border-t-2 border-theme-200 mt-auto">
                                                    <span className="flex-1 text-right text-xs font-bold text-theme-700 uppercase tracking-wider pr-2">Total a Pagar (Neto):</span>
                                                    <span className="font-black text-base sm:text-lg text-theme-600 whitespace-nowrap">${fmtUSD(desglose.mensualidadUSD)}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Columna 2: Pagos */}
                                        <div className="flex flex-col gap-2 h-full">
                                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                                                <Info className="w-3 h-3 shrink-0" /> Cronograma (5 Cuotas)
                                            </h4>
                                            <div className="bg-gray-50 border border-gray-200 rounded-lg overflow-hidden flex flex-col flex-1">
                                                <ul className="divide-y divide-gray-200 text-sm font-medium flex-1 flex flex-col justify-between">
                                                    {desglose.pagosMensuales.map((pago, idx) => (
                                                        <li key={idx} className={`flex justify-between items-center px-3 py-2 flex-1 ${idx === 0 || idx === 3 ? 'bg-theme-50 text-theme-800' : 'bg-white text-gray-600'}`}>
                                                            <span className="flex items-center gap-2">
                                                                <span className="font-semibold text-xs sm:text-sm">{pago.numero}° Pago</span>
                                                                <span className={`text-xs px-1.5 py-0.5 rounded font-normal hidden sm:inline ${idx === 0 || idx === 3 ? 'bg-theme-100 text-theme-700' : 'bg-gray-100 text-gray-500'}`}>{pago.descripcion}</span>
                                                            </span>
                                                            <span className="flex flex-col items-end shrink-0">
                                                                <span className="font-bold text-xs sm:text-sm">${fmtUSD(pago.montoUSD)}</span>
                                                                <span className="text-xs text-gray-400 font-normal">Bs. {fmtBs(pago.montoBs)}</span>
                                                            </span>
                                                        </li>
                                                    ))}
                                                </ul>
                                                <div className="text-xs text-center text-gray-400 py-1.5 border-t border-gray-200 italic bg-white mt-auto">
                                                    Tasa BCV Estimada: Bs. {desglose.tasaBCV}
                                                </div>
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
