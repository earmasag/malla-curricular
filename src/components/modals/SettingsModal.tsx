import { MousePointer2, Settings } from 'lucide-react';
import { ModalHeader } from './shared/ModalHeader';

export interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    configuraciones: {
        zoomConRueda: boolean;
        setZoomConRueda: (val: boolean) => void;
    };
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, configuraciones }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm transition-opacity">
                <div
                className="bg-white rounded-3xl w-full max-w-sm shadow-2xl relative animate-in fade-in zoom-in-95 duration-200 overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <ModalHeader
                    title={
                        <div className="flex flex-col">
                            <span>Configuración</span>
                            <span className="text-sm font-normal text-gray-500 mt-1 leading-tight">Ajusta tu experiencia en la malla</span>
                        </div>
                    }
                    icon={<Settings />}
                    onClose={onClose}
                />

                {/* Content */}
                <div className="flex flex-col gap-6 p-6 md:p-8 bg-white">

                    {/* Setting 1: Scroll to Zoom */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-xl bg-theme-50 text-theme-600">
                                <MousePointer2 className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="font-semibold text-gray-700">Zoom con scroll</p>
                                <p className="text-xs text-gray-500 max-w-37.5">Acerca o aleja la malla usando la rueda del ratón.</p>
                            </div>
                        </div>

                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" checked={configuraciones.zoomConRueda} onChange={(e) => configuraciones.setZoomConRueda(e.target.checked)} />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-theme-500"></div>
                        </label>
                    </div>



                </div>
            </div>
        </div>
    );
};
