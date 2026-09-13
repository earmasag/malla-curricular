import { useState, useEffect } from 'react';

/**
 * Hook para garantizar que la pantalla de carga se muestre durante un tiempo
 * mínimo estético (ej. 800ms-1000ms), evitando parpadeos invisibles cuando
 * los datos locales cargan en milisegundos.
 */
export const useMinLoading = (isLoading: boolean, minTimeMs: number = 900): boolean => {
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMinTimeElapsed(true);
    }, minTimeMs);

    return () => clearTimeout(timer);
  }, [minTimeMs]);

  return isLoading || !minTimeElapsed;
};
