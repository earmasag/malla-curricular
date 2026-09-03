import React from 'react';
import { motion } from 'framer-motion';

export interface AnimatedModalWrapperProps {
    children: React.ReactNode;
    /** Clases opcionales para el contenedor interno del modal (para sobreescribir max-width, bg, etc) */
    className?: string;
    /** Clases opcionales para el contenedor del fondo (backdrop) y alineación */
    containerClassName?: string;
}

export const AnimatedModalWrapper: React.FC<AnimatedModalWrapperProps> = ({ 
    children, 
    className = "bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden",
    containerClassName = "fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
}) => {
    return (
        <motion.div 
            className={containerClassName}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ willChange: 'opacity' }}
        >
            <motion.div
                className={className}
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                transition={{ 
                    duration: 0.3, 
                    ease: [0.16, 1, 0.3, 1] // Custom spring-like cubic ease
                }}
                style={{ willChange: 'transform, opacity' }}
            >
                {children}
            </motion.div>
        </motion.div>
    );
};

