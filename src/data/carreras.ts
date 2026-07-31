export interface Carrera {
  id: string;
  nombre: string;
}

export const CARRERAS_DISPONIBLES: Carrera[] = [
  { id: 'ingenieria_informatica', nombre: 'Ingeniería en Informática' },
  { id: 'ingenieria_civil', nombre: 'Ingeniería Civil' }
];

export const loadCarreraData = async (carreraId: string) => {
  if (carreraId === 'ingenieria_informatica') {
    const [
      plan_2023_module,
      plan_2027_module,
      ajustes_pensum_viejo,
      matricula
    ] = await Promise.all([
      import('./ingenieria_informatica/plan_estudio_informatica_2023.json').then(m => m.default),
      import('./ingenieria_informatica/plan_estudio_informatica_2027.json').then(m => m.default),
      import('./ingenieria_informatica/ajustes_pensum_viejo.json').then(m => m.default),
      import('./matricula.json').then(m => m.default)
    ]);

    const plan2023 = plan_2023_module.INFORMATICA;
    const plan2027 = plan_2027_module.INFORMATICA;

    return {
      plan_estudio: plan2023.materias,
      plan_estudio_nuevo: plan2027.materias,
      areas_color: plan2027.areas_color,
      semestres: plan2027.semestres,
      ajustes_pensum_viejo,
      matricula
    };
  }

  if (carreraId === 'ingenieria_civil') {
    const [
      plan_2023_module,
      plan_2027_module,
      ajustes_pensum_viejo,
      matricula
    ] = await Promise.all([
      import('./ingenieria_civil/plan_estudio_civil_2023.json').then(m => m.default),
      import('./ingenieria_civil/plan_estudio_civil_2027.json').then(m => m.default),
      import('./ingenieria_civil/ajustes_pensum_viejo.json').then(m => m.default),
      import('./matricula.json').then(m => m.default)
    ]);

    const plan2023 = plan_2023_module.CIVIL;
    const plan2027 = plan_2027_module.CIVIL;

    return {
      plan_estudio: plan2023.materias,
      plan_estudio_nuevo: plan2027.materias,
      areas_color: plan2027.areas_color,
      semestres: plan2027.semestres,
      ajustes_pensum_viejo,
      matricula
    };
  }

  throw new Error(`Carrera no encontrada: ${carreraId}`);
};
