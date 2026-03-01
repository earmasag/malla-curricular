import type { Meta, StoryObj } from '@storybook/react';
import MateriaCard from './MateriaCard';

// 1. Configuración principal de Storybook para este componente
const meta = {
  title: 'Componentes/MateriaCard',
  component: MateriaCard,
  tags: ['autodocs'],
  // Esto es un "truco" para que Storybook envuelva tu tarjeta en un contenedor 
  // centrado, para que se vea mejor aislada y no pegada a la esquina superior.
  decorators: [
    (Story) => (
      <div className="flex items-center justify-center min-h-[400px] p-8 bg-gray-600">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof MateriaCard>;

export default meta;
type Story = StoryObj<typeof meta>;

// 2. Creación de la historia base (como se verá por defecto)
export const VistaPorDefecto: Story = {
  args: {
    materia: {
      codigoMateria: 'MAT-101',
      nombre: 'Matemática Discreta',
      horasTeoricas: 2,
      horasPracticas: 2,
      horasLaboratorio: 0,
      horasPresenciales: 4,
      horasAutonomas: 3,
      horasTotales: 7,
      unidadesCredito: 4,
      tipo: 'CR',
      modalidad: 'P',
      taxonomia: 'TX-9',
      areaFormacion: 'Ciencias Básicas',
      estado: 'disponible',
      semestre: 2,
      ucRequeridas: 0
    }
  },
};
