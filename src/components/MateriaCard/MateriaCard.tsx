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
}

export default function MateriaCard({ materia, onClick }: MateriaCardProps) {
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
        areaFormacion
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
            onClick={onClick}
            className={`relative w-48 h-20 rounded-br-[20px] shadow-sm border-[3px] ${opacityClass} transition-all duration-300 ${onClick ? 'cursor-pointer hover:scale-105 active:scale-95' : ''}`}
            style={{ backgroundColor: currentHexColor, borderColor: currentHexColor }}
        >

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
                    style={{ fontFamily: "'Oswald', sans-serif", letterSpacing: "-0.5px" }}
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

            {/* Sello de Aprobado (Círculo verde hueco superpuesto) */}
            {isAprobada && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30 overflow-hidden rounded-br-[18px]">
                    <div className="size-18 rounded-full border-8 border-green-500 opacity-40"></div>
                </div>
            )}

        </div>
    );
}
