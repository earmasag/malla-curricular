import { useToast as useToastContext } from '../contexts/ToastContext';

// Re-exportamos el hook para centralizar las importaciones desde un solo lugar ('hooks')
export const useToast = () => useToastContext();
