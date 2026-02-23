export default function MateriaCard() {
    return (
        <div className="relative w-55 h-25 p-6 bg-blue-100 rounded-br-3xl shadow-md border border-blue-300">
            
            <div className=" absolute w-5 h-9 left-0 bottom-0 bg-[#4B4B4B] [clip-path:polygon(50%_0%,100%_30%,100%_100%,0%_100%,0%_30%)] flex items-center justify-center">
        
                {/* The text inside. I added mt-4 (margin-top) to push it down into the square part of the house */}
                <p className="text-white font-extrabold mt-3">
                P
                </p>
            </div>

            <div className="absolute bottom-0 left-0 w-auto mr-8 ml-5 flex bg-gray-100 ">
                <div className="flex items-center justify-center w-6 h-6 bg-white border-solid border-2 border-l-tranparent ">
                   1
                </div>
                <div className="flex items-center justify-center w-6 h-6 bg-white border-solid border-2">
                    2
                </div>
                <div className="flex items-center justify-center w-6 h-6 bg-white border-solid border-2">
                    3
                </div>
                <div className="flex items-center justify-center w-6 h-6 bg-white border-solid border-2">
                    4
                </div>
                <div className="flex items-center justify-center w-6 h-6 bg-white border-solid border-2">
                    5
                </div>
                <div className="flex items-center justify-center w-10 h-6 bg-white border-solid border-2">
                    TX-9
                </div>

            </div>

            <div className="absolute flec items-center justify-center right-0 bottom-0 size-10 bg-red-400 rounded-full flex  ">
                #
            </div>

        </div>
    );
}
