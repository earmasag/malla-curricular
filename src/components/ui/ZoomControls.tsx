import React from 'react';

export interface ZoomControlsProps {
    zoomIn: () => void;
    zoomOut: () => void;
    resetTransform: () => void;
    isCompact?: boolean;
}

export const ZoomControls: React.FC<ZoomControlsProps> = ({ zoomIn, zoomOut, resetTransform, isCompact }) => {
    const btnClass = isCompact 
        ? "flex cursor-pointer items-center justify-center w-9 h-9 bg-white/90 backdrop-blur text-gray-700 hover:text-theme-500 hover:bg-white rounded-full shadow-lg border border-gray-200 transition-all hover:scale-110"
        : "flex cursor-pointer items-center justify-center w-12 h-12 bg-white/90 backdrop-blur text-gray-700 hover:text-theme-500 hover:bg-white rounded-full shadow-lg border border-gray-200 transition-all hover:scale-110";

    return (
        <div className="absolute bottom-4 right-4 md:bottom-8 md:right-8 z-50 hidden lg:flex flex-col gap-2 md:gap-3 pointer-events-auto">
            <button
                onClick={() => zoomIn()}
                className={btnClass}
                title="Acercar"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2.5}
                    stroke="currentColor"
                    className="w-5 h-5 md:w-6 md:h-6"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
            </button>
            <button
                onClick={() => zoomOut()}
                className={btnClass}
                title="Alejar"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2.5}
                    stroke="currentColor"
                    className="w-5 h-5 md:w-6 md:h-6"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
                </svg>
            </button>
            {!isCompact && (
                <button
                    onClick={() => resetTransform()}
                    className={btnClass}
                    title="Restablecer vista"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2.5}
                        stroke="currentColor"
                        className="w-6 h-6"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
                        />
                    </svg>
                </button>
            )}
        </div>
    );
};
