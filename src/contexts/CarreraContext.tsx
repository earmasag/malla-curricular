import { createContext, useContext, useState, useEffect, useMemo, type ReactNode } from 'react';
import { CARRERAS_DISPONIBLES, loadCarreraData } from '../data/carreras';

export interface CarreraData {
  plan_estudio: any;
  plan_estudio_nuevo: any;
  areas_color: any;
  semestres: any;
  ajustes_pensum_viejo: any;
  matricula: any;
}

export interface CarreraContextType {
  activeCarreraId: string | null;
  setActiveCarreraId: (id: string) => void;
  carreraData: CarreraData | null;
  areasColorMap: Record<string, string>;
  isLoading: boolean;
  error: Error | null;
}

const CarreraContext = createContext<CarreraContextType | undefined>(undefined);

export const CarreraProvider = ({ children }: { children: ReactNode }) => {
  const [activeCarreraId, setActiveCarreraId] = useState<string | null>(null);
  const [carreraData, setCarreraData] = useState<CarreraData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const areasColorMap = useMemo(() => {
    if (!carreraData?.areas_color) return {};
    return carreraData.areas_color.reduce((acc: Record<string, string>, curr: any) => {
      acc[curr.areaFormacion] = curr.colorCodigo;
      return acc;
    }, {});
  }, [carreraData?.areas_color]);

  useEffect(() => {
    const saved = localStorage.getItem('malla-active-carrera');
    if (saved && CARRERAS_DISPONIBLES.find(c => c.id === saved)) {
      setActiveCarreraId(saved);
    } else {
      setActiveCarreraId("ingenieria_informatica");
    }
  }, []);

  useEffect(() => {
    if (activeCarreraId) {
      localStorage.setItem('malla-active-carrera', activeCarreraId);
      setIsLoading(true);
      setError(null);
      loadCarreraData(activeCarreraId)
        .then(data => {
          setCarreraData(data);
          setIsLoading(false);
        })
        .catch(err => {
          console.error(err);
          setError(err);
          setIsLoading(false);
        });
    }
  }, [activeCarreraId]);

  return (
    <CarreraContext.Provider value={{ activeCarreraId, setActiveCarreraId, carreraData, areasColorMap, isLoading, error }}>
      {children}
    </CarreraContext.Provider>
  );
};

export const useCarrera = () => {
  const context = useContext(CarreraContext);
  if (!context) {
    throw new Error('useCarrera debe usarse dentro de un CarreraProvider');
  }
  return context;
};
