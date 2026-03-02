import { memo } from 'react';
import type { MateriaNode } from '../../types/materia';
import areasColorData from '../../data/areas_color.json';

// Lo cargamos en memoria FUERA del componente. Así esta operación (O(N) a O(1)) 
// sucede una sola vez cuando la app arranca, y no cada vez que se repinta una tarjeta.
const areasColorMap: Record<string, string> = areasColorData.reduce((acc, curr) => {
    acc[curr.areaFormacion] = curr.colorCodigo;
    return acc;
}, {} as Record<string, string>);

export interface MateriaCardProps {
    materia: MateriaNode;
    onClick?: () => void;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
    isHovered?: boolean;
}

const MateriaCardContent = ({ materia, onClick, onMouseEnter, onMouseLeave, isHovered }: MateriaCardProps) => {
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

    // Obtenemos el color desde nuestro Diccionario usando la llave `areaFormacion`
    const colorArea = areasColorMap[areaFormacion] || "#bfdbfe";

    // Colores del borde y acento basados puramente en su estado
    const currentHexColor = colorArea;

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
            id={codigoMateria}
            onClick={onClick}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            className={`relative w-48 h-20 rounded-br-[20px] shadow-sm border-[3px] ${opacityClass} transition-all duration-300 ${onClick ? 'cursor-pointer hover:scale-105 active:scale-95' : ''} ${isHovered ? 'ring-4 ring-offset-2 ring-blue-400 z-50' : 'z-10'}`}
            style={{ backgroundColor: currentHexColor, borderColor: currentHexColor }}
        >

            {/* Listón de Aprobado en la esquina superior derecha */}
            {isAprobada && (
                <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[inherit] z-30">
                    <div className="absolute top-0 right-0 w-16 h-16 pointer-events-none">
                        <div className="absolute top-5 -right-5 w-28 bg-emerald-500 text-white text-center transform rotate-45 py-0.5 shadow-sm">
                            <span className="font-bold text-sm">✓</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Indicador de Unidades de Crédito Requeridas On Hover */}
            {isHovered && ucRequeridas > 0 && (
                <div className="absolute right-full top-1/2 -translate-y-1/2 mr-1 flex items-center justify-end h-full max-h-[30px] z-50 pointer-events-none">
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
                            className="h-[3px] w-6"
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
                <div className={`absolute top-[2px] left-0 right-0 bottom-[-2px] ${isBloqueada ? 'bg-gray-400' : 'bg-[#4B4B4B]'} [clip-path:polygon(50%_0%,100%_30%,100%_100%,0%_100%,0%_30%)] flex items-center justify-center`}>
                    <p className="text-white font-bold text-[10px] pt-1" style={{ fontFamily: "'Oswald', sans-serif" }}>
                        {modalidad}
                    </p>
                </div>
            </div>

            {/* Fila de horas */}
            <div
                className={`absolute bottom-0 left-5 flex z-10 border-2 border-b-0 mask-[linear-gradient(to_right,transparent_0%,black_15%,black_85%,transparent_100%)]`}
                style={{ borderColor: currentHexColor, fontFamily: "'Oswald', sans-serif" }}
            >
                <div className={`flex items-center justify-center w-5 h-[16px] bg-white border-r-2 text-[12px] font-semibold ${textClass}`} style={{ borderColor: currentHexColor }}>
                    {horasTeoricas}
                </div>
                <div className={`flex items-center justify-center w-5 h-[16px] bg-white border-r-2 text-[12px] font-semibold ${textClass}`} style={{ borderColor: currentHexColor }}>
                    {horasPracticas}
                </div>
                <div className={`flex items-center justify-center w-5 h-[16px] bg-white border-r-2 text-[12px] font-semibold ${textClass}`} style={{ borderColor: currentHexColor }}>
                    {horasLaboratorio}
                </div>
                <div className={`flex items-center justify-center w-5 h-[16px] bg-white border-r-2 text-[12px] font-semibold ${textClass}`} style={{ borderColor: currentHexColor }}>
                    {horasAutonomas}
                </div>
                <div className={`flex items-center justify-center w-5 h-[16px] bg-white border-r-2 text-[12px] font-semibold ${textClass}`} style={{ borderColor: currentHexColor }}>
                    {horasTotales}
                </div>
                <div className={`flex items-center justify-center w-10 h-[16px] bg-white text-[12px] font-semibold ${textClass}`}>
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
