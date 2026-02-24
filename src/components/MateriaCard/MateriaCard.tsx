export interface MateriaCardProps {
    nombreMateria: string;
    codigoMateria: string;
    creditos: number;
    hrTeoria: number;
    hrPrac: number;
    hrLab: number;
    hrInd: number
    totalHoras: number;
    tax: string;
    area: string;
    modalidad: string;


}

export default function MateriaCard({ nombreMateria, codigoMateria, creditos, hrTeoria, hrPrac, hrLab, hrInd, totalHoras, tax, area, modalidad }: MateriaCardProps) {
    return (
        // w-72 (288px) y h-24 (96px) son medidas estándar de Tailwind. 
        // w-55 y h-25 no existen, por lo que el navegador no sabía qué tamaño darle.
        <div className="relative w-62 h-28 bg-blue-100 rounded-br-[25px] shadow-md border-4 border-blue-100">

            {/* Al usar left-6 y right-0, el cuadro blanco ocupa exactamente el resto del ancho, sin desbordarse.
                También le ponemos el mismo rounded-br para que no sobreponga el borde curvo. */}
            <div className="absolute left-6 right-0 top-0 bottom-0 flex flex-col bg-white items-start px-2 rounded-br-[24px]">
                {/* Cambiamos truncate por line-clamp-2 y leading-tight para permitir 2 líneas de texto compacto */}
                <p className="absolute top-1 text-black font-black text-[16px] w-[220px] leading-tight line-clamp-2 wrap-break-words">{nombreMateria}</p>
                <p className="text-black bottom-8 absolute font-black text-[16px] mt-1">{codigoMateria}</p>
            </div>

            {/* Símbolo de Modalidad (Casa pequeña) con borde blanco solo en techo */}
            <div className="absolute w-6 h-9 left-0 bottom-0 z-10 leading-none overflow-hidden">
                {/* Silueta blanca de fondo (funciona como el borde del techo) */}
                <div className="absolute inset-0 bg-white [clip-path:polygon(50%_0%,100%_30%,100%_100%,0%_100%,0%_30%)]"></div>

                {/* Interior gris oscuro. Al sumarle 4px por debajo y top-[4px], recuperamos la forma pero la parte extra la cortamos con overflow-hidden del padre */}
                <div className="absolute top-[3px] left-0 right-0 bottom-[-3px] bg-[#4B4B4B] [clip-path:polygon(50%_0%,100%_30%,100%_100%,0%_100%,0%_30%)] flex items-center justify-center">
                    <p className="text-white font-bold text-[16px] pt-1.5">
                        {modalidad}
                    </p>
                </div>
            </div>

            {/* Fila de horas. Con mask-image creamos un desvanecimiento real en los extremos izquierdo y derecho */}
            <div className="absolute bottom-0 left-6 flex z-10 border-[3px] border-b-0 border-blue-100 mask-[linear-gradient(to_right,transparent_0%,black_15%,black_85%,transparent_100%)]">
                <div className="flex items-center justify-center w-6 h-[22px] bg-white border-r-[3px] border-blue-100 text-[16px] font-semibold">
                    {hrTeoria}
                </div>
                <div className="flex items-center justify-center w-6 h-[22px] bg-white border-r-[3px] border-blue-100 text-[16px] font-semibold">
                    {hrPrac}
                </div>
                <div className="flex items-center justify-center w-6 h-[22px] bg-white border-r-[3px] border-blue-100 text-[16px] font-semibold">
                    {hrLab}
                </div>
                <div className="flex items-center justify-center w-6 h-[22px] bg-white border-r-[3px] border-blue-100 text-[16px] font-semibold">
                    {hrInd}
                </div>
                <div className="flex items-center justify-center w-6 h-[22px] bg-white border-r-[3px] border-blue-100 text-[16px] font-semibold">
                    {totalHoras}
                </div>
                <div className="flex items-center justify-center w-12 h-[22px] bg-white border-blue-100 text-[16px] font-semibold">
                    {tax}
                </div>
            </div>

            {/* Círculo Rojo (Créditos). z-20 para que quede por encima de todo */}
            <div className="absolute flex items-center justify-center right-0 bottom-0 size-10 bg-blue-100 rounded-full z-20 text-black font-bold border-2 border-blue-100">
                {creditos}
            </div>

        </div>
    );
}
