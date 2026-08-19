import { memo, useRef, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Check, Pencil } from 'lucide-react';
import type { MateriaNode } from '../../types/materia';
import { useCarrera } from '../../contexts/CarreraContext';

export interface MateriaCardProps {
    materia: MateriaNode;
    onClick?: () => void;
    onRightClick?: () => void;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
    isHovered?: boolean;
}

const MateriaCardContent = ({ materia, onClick, onRightClick, onMouseEnter, onMouseLeave, isHovered }: MateriaCardProps) => {
    const { areasColorMap } = useCarrera();
    const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const wasLongPress = useRef(false);
    const wasDragging = useRef(false);
    const touchStartPos = useRef<{ x: number, y: number } | null>(null);
    const {
        nombre,
        codigoMateria,
        unidadesCredito,
        horasTeoricas,
        horasPracticas,
        horasLaboratorio,
        horasAutonomas,
        horasTotales,
        taxonomia,
        modalidad,
        estado,
        areaFormacion,
        ucRequeridas
    } = materia;

    // Estado lógico
    const isBloqueada = estado === "bloqueada";
    const isAprobada = estado === "aprobada";
    const isCursando = estado === "cursando";

    // Obtenemos el color desde nuestro Diccionario usando la llave `areaFormacion`
    const colorArea = areasColorMap[areaFormacion] || "#bfdbfe";

    // Colores del borde y acento basados puramente en su estado
    const currentHexColor = colorArea;

    // --- Tooltip Prolongado para el Listón ---
    const [tooltipState, setTooltipState] = useState<{ show: boolean, rect: DOMRect | null }>({ show: false, rect: null });
    const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const cardRef = useRef<HTMLDivElement>(null);

    const handleMouseEnterCard = () => {
        if (onMouseEnter) onMouseEnter();
        
        // Solo para dispositivos con hover. Mostramos la leyenda tras un hover prolongado.
        if (window.matchMedia('(hover: hover)').matches) {
            if (cardRef.current) {
                const currentRect = cardRef.current.getBoundingClientRect();
                hoverTimer.current = setTimeout(() => {
                    setTooltipState({ show: true, rect: currentRect });
                }, 1000); // 1000ms para un hover "prolongado"
            }
        }
    };

    const handleMouseLeaveCard = () => {
        if (onMouseLeave) onMouseLeave();
        
        if (hoverTimer.current) {
            clearTimeout(hoverTimer.current);
            hoverTimer.current = null;
        }
        setTooltipState({ show: false, rect: null });
    };

    useEffect(() => {
        const handleScroll = () => {
            if (tooltipState.show) {
                setTooltipState({ show: false, rect: null });
            }
        };
        if (tooltipState.show) {
            window.addEventListener('scroll', handleScroll, true);
        }
        return () => window.removeEventListener('scroll', handleScroll, true);
    }, [tooltipState.show]);

    // --- Interacción Táctil: mostrar prelaciones al tocar (equivalente al hover de desktop) ---
    const handleTouchStart = (e: React.TouchEvent) => {
        wasLongPress.current = false;
        wasDragging.current = false;
        touchStartPos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        
        if (onMouseEnter) onMouseEnter();
        if (onRightClick) {
            longPressTimer.current = setTimeout(() => {
                wasLongPress.current = true;
                onRightClick();
                // Opcional: proveer feedback táctil si el dispositivo lo soporta
                if (window.navigator && window.navigator.vibrate) {
                    window.navigator.vibrate(50);
                }
            }, 450); // Reducido a 450ms para que se sienta más responsivo
        }
    };

    const handleTouchEnd = () => {
        touchStartPos.current = null;
        if (onMouseLeave) onMouseLeave();
        if (longPressTimer.current) {
            clearTimeout(longPressTimer.current);
            longPressTimer.current = null;
        }
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!touchStartPos.current) return;
        
        const deltaX = Math.abs(e.touches[0].clientX - touchStartPos.current.x);
        const deltaY = Math.abs(e.touches[0].clientY - touchStartPos.current.y);
        
        // Si el usuario mueve el dedo más de 10px, asumimos que está haciendo scroll y cancelamos el long press
        if (deltaX > 10 || deltaY > 10) {
            wasDragging.current = true;
            handleTouchEnd();
        }
    };

    const handleClick = (e: React.MouseEvent) => {
        if (wasLongPress.current || wasDragging.current) {
            e.preventDefault();
            e.stopPropagation();
            // Reseteamos los flags después de prevenir el click
            setTimeout(() => { 
                wasLongPress.current = false; 
                wasDragging.current = false;
            }, 50);
            return;
        }
        if (onClick) onClick();
    };

    const handleContextMenu = (e: React.MouseEvent) => {
        e.preventDefault(); // Deshabilitar el menú contextual nativo
        // Si ya se disparó por el temporizador de touch (mobile), ignoramos el evento nativo
        if (wasLongPress.current) return;
        if (onRightClick) onRightClick();
    };

    // Si está bloqueada, le aplicamos una grilla con CSS lineal
    const gridStyle = isBloqueada ? {
        backgroundImage: 'linear-gradient(to right, #9ca3af 1px, transparent 1px), linear-gradient(to bottom, #9ca3af 1px, transparent 1px)',
        backgroundSize: '10px 10px',
        backgroundColor: '#f3f4f6' // Cambiamos el fondo a un gris un poco más oscuro (gray-100) para que contraste mejor
    } : {};

    // Clases complementarias
    const textClass = isBloqueada ? "text-gray-500" : "text-black";
    const opacityClass = isBloqueada ? "opacity-50" : "opacity-100";

    return (
        <div
            ref={cardRef}
            id={codigoMateria}
            onClick={handleClick}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onTouchMove={handleTouchMove}
            onContextMenu={handleContextMenu}
            onMouseEnter={handleMouseEnterCard}
            onMouseLeave={handleMouseLeaveCard}
            className={`materia-card relative w-48 h-20 rounded-br-[20px] my-1 border-[3px] select-none ${opacityClass} transition-all duration-300 transform-gpu ${onClick ? 'cursor-pointer [@media(hover:hover)]:hover:scale-105 active:scale-95' : ''} ${isHovered ? 'ring-4 ring-offset-2 ring-theme-500 z-50' : 'z-10'} ${isCursando ? 'shadow-[0_0_15px_rgba(59,130,246,0.6)] ring-2 ring-blue-400 ring-offset-1' : 'shadow-sm'}`}
            style={{
                backgroundColor: currentHexColor,
                borderColor: currentHexColor,
                WebkitTouchCallout: 'none' // Deshabilitar el popup contextual nativo de iOS al mantener presionado
            }}
        >

            {/* Listón de Aprobado o Cursando en la esquina superior derecha */}
            {(isAprobada || isCursando) && (
                <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[inherit] z-30">
                    <div className="absolute top-0 right-0 w-16 h-16 pointer-events-none">
                        <div className={`absolute top-5 -right-5 w-28 text-white flex justify-center items-center transform rotate-45 py-0.75shadow-sm ${isAprobada ? 'bg-emerald-500' : 'bg-blue-500'}`}>
                            {isAprobada ? (
                                <Check className="w-4 h-4" strokeWidth={4} />
                            ) : (
                                <Pencil className="w-3.5 h-3.5" strokeWidth={3} />
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Indicador de Unidades de Crédito Requeridas On Hover */}
            {isHovered && ucRequeridas > 0 && (
                <div className="absolute right-full top-1/2 -translate-y-1/2 mr-1 flex items-center justify-end h-full max-h-7.5 z-50 pointer-events-none">
                    <div className="relative flex items-center">
                        {/* Texto re-posicionado arriba de la flecha con menor tamaño */}
                        <span
                            className="absolute bottom-1 w-full text-center font-bold text-[12px] whitespace-nowrap text-black"
                            style={{ fontFamily: "'Oswald', sans-serif" }}
                        >
                            {ucRequeridas} UC
                        </span>
                        {/* Cuerpo de la flecha */}
                        <div
                            className="h-0.75 w-6"
                            style={{ backgroundColor: currentHexColor }}
                        />
                        {/* Punta de la flecha usando bordes CSS transparentes */}
                        <div
                            className="w-0 h-0"
                            style={{
                                borderTop: '5px solid transparent',
                                borderBottom: '5px solid transparent',
                                borderLeft: `6px solid ${currentHexColor}`
                            }}
                        />
                    </div>
                </div>
            )}


            {/* Cuadro principal blanco o con grilla */}
            <div
                className={`absolute left-5 right-1 top-0 bottom-0 flex flex-col bg-white items-start justify-start pr-0 rounded-br-[18px]`}
                style={gridStyle}
            >
                <p
                    className={`absolute top-2 left-2 right-0 text-left ${textClass} font-bold text-[12px] uppercase leading-tight line-clamp-3 wrap-break-words`}
                    style={{ fontFamily: "'Oswald', sans-serif", letterSpacing: "0.5px", lineHeight: "1.1" }}
                >
                    {nombre}
                </p>
                <p
                    className={`absolute bottom-5 left-2 right-0 text-left text-gray-700 font-bold text-[11px] uppercase`}
                    style={{ fontFamily: "'Oswald', sans-serif", letterSpacing: "0.5px" }}
                >
                    {codigoMateria}
                </p>
            </div>

            {/* Símbolo de Modalidad */}
            <div className="absolute w-5 h-7 left-0 bottom-0 z-10 leading-none overflow-hidden">
                <div className="absolute inset-0 bg-white [clip-path:polygon(50%_0%,100%_30%,100%_100%,0%_100%,0%_30%)]"></div>
                <div className={`absolute top-0.5 left-0 right-0 -bottom-0.5 ${isBloqueada ? 'bg-gray-400' : 'bg-[#4B4B4B]'} [clip-path:polygon(50%_0%,100%_30%,100%_100%,0%_100%,0%_30%)] flex items-center justify-center`}>
                    <p className="text-white font-bold text-[10px] pt-1" style={{ fontFamily: "'Oswald', sans-serif" }}>
                        {modalidad}
                    </p>
                </div>
            </div>

            {/* Fila de horas */}
            <div
                className={`absolute bottom-0 left-5 flex z-10 border-t-2 border-b-0 mask-[linear-gradient(to_right,transparent_0%,black_5%,black_95%,transparent_100%)]`}
                style={{ borderColor: currentHexColor, fontFamily: "'Oswald', sans-serif" }}
            >
                <div className={`flex items-center justify-center w-5 h-4 bg-white border-r-2 text-[12px] font-semibold ${textClass}`} style={{ borderColor: currentHexColor }}>
                    {horasTeoricas}
                </div>
                <div className={`flex items-center justify-center w-5 h-4 bg-white border-r-2 text-[12px] font-semibold ${textClass}`} style={{ borderColor: currentHexColor }}>
                    {horasPracticas}
                </div>
                <div className={`flex items-center justify-center w-5 h-4 bg-white border-r-2 text-[12px] font-semibold ${textClass}`} style={{ borderColor: currentHexColor }}>
                    {horasLaboratorio}
                </div>
                <div className={`flex items-center justify-center w-5 h-4 bg-white border-r-2 text-[12px] font-semibold ${textClass}`} style={{ borderColor: currentHexColor }}>
                    {horasAutonomas}
                </div>
                <div className={`flex items-center justify-center w-5 h-4 bg-white border-r-2 text-[12px] font-semibold ${textClass}`} style={{ borderColor: currentHexColor }}>
                    {horasTotales}
                </div>
                <div className={`flex items-center justify-center w-10 h-4 bg-white text-[12px] font-semibold ${textClass}`}>
                    {taxonomia}
                </div>
            </div>

            {/* Círculo de Créditos */}
            <div
                className={`absolute flex items-center justify-center right-0 bottom-0 size-7 rounded-full z-20 ${textClass} font-bold text-[14px] border-2`}
                style={{ backgroundColor: currentHexColor, borderColor: currentHexColor, fontFamily: "'Oswald', sans-serif" }}
            >
                {unidadesCredito}
            </div>

            {/* Premium Tooltip Portal (Mini Leyenda) */}
            {tooltipState.show && tooltipState.rect && createPortal(
                <div
                    className="fixed z-99999 pointer-events-none animate-fade-in-up"
                    style={{
                        top: tooltipState.rect.top - 8,
                        left: tooltipState.rect.left + (tooltipState.rect.width / 2),
                        transform: 'translate(-50%, -100%)'
                    }}
                >
                    <div className="relative flex flex-col items-center">
                        {/* Tooltip body */}
                        <div className="bg-white/60 backdrop-blur-2xl border border-white/60 shadow-2xl transform-gpu text-slate-800 p-2.5 rounded-2xl flex flex-col gap-2 min-w-max">
                            <h4 className="text-[10px] uppercase text-slate-500 font-bold tracking-wider text-center leading-none">Listones de Estado</h4>
                            <div className="flex flex-col gap-1.5">
                                <div className="flex items-center gap-2 text-xs font-medium">
                                    <div className="bg-emerald-500 rounded p-0.5 shadow-inner"><Check className="w-3.5 h-3.5 text-white" strokeWidth={3.5} /></div>
                                    <span>Aprobada</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs font-medium">
                                    <div className="bg-blue-500 rounded p-0.5 shadow-inner"><Pencil className="w-3.5 h-3.5 text-white" strokeWidth={3} /></div>
                                    <span>Cursando</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>,
                document.body
            )}

        </div>
    );
};

export default memo(MateriaCardContent, (prevProps, nextProps) => {
    // Solo re-renderizar si cambia el estado (aprobada/bloqueada) O el estado de hover de ESTA materia.
    // Ignoramos la recreación de funciones (onClick, etc) provenientes del padre para aprovechar al 100% el memo.
    return (
        prevProps.materia.estado === nextProps.materia.estado &&
        prevProps.isHovered === nextProps.isHovered &&
        prevProps.materia.codigoMateria === nextProps.materia.codigoMateria
    );
});
