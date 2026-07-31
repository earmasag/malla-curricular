export interface Carrera {
  id: string;
  nombre: string;
}

export const CARRERAS_DISPONIBLES: Carrera[] = [
  { id: 'ingenieria_informatica', nombre: 'Ingeniería en Informática' }
];

export const loadCarreraData = async (carreraId: string) => {
  if (carreraId === 'ingenieria_informatica') {
    const [
      plan_estudio,
      plan_estudio_nuevo,
      areas_color,
      semestres,
      ajustes_pensum_viejo,
      matricula
    ] = await Promise.all([
      import('./ingenieria_informatica/plan_estudio.json').then(m => m.default),
      import('./ingenieria_informatica/plan_estudio_nuevo.json').then(m => m.default),
      import('./ingenieria_informatica/areas_color.json').then(m => m.default),
      import('./ingenieria_informatica/semestres.json').then(m => m.default),
      import('./ingenieria_informatica/ajustes_pensum_viejo.json').then(m => m.default),
      import('./matricula.json').then(m => m.default)
    ]);

    return {
      plan_estudio,
      plan_estudio_nuevo,
      areas_color,
      semestres,
      ajustes_pensum_viejo,
      matricula
    };
  }
  throw new Error(`Carrera no encontrada: ${carreraId}`);
};
