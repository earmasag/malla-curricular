# Malla Curricular Interactiva 🎓

Una herramienta de planificación académica visual e interactiva construida para facilitar el seguimiento y la proyección de la carrera universitaria. Diseñada para estudiantes, esta aplicación permite llevar un control preciso de las materias aprobadas, explorar rutas de estudio perzonalizadas y generar caminos óptimos hacia la graduación basados en restricciones reales.

## ✨ Características Principales

*   **Visor de Malla Dinámico:** Visualiza el pensum de tu carrera en formato de nodos interactivos distribuidos por semestre.
*   **Gestión de Progreso:** Marca las materias con estados dinámicos (Aprobada, Cursando, Disponible o Bloqueada).
*   **Seguimiento de Creditos (UCs):** El sistema rastrea de forma inteligente tus Unidades de Crédito acumuladas tomando en cuenta el grafo de requisitos.
*   **Visualización de Prelaciones:** Entiende qué materias componen los cuellos de botella mediante el dibujado dinámico de líneas conectando prerrequisitos usando `react-xarrows`.
*   **Constructor de Rutas Personalizadas:** Un modo "Sandbox" para planificar libremente próximos semestres, añadir materias temporalmente para ver cuántas UCs suman, y guardar tu propia ruta estimada a futuro en `LocalStorage`.
*   **Generador de Ruta Óptima Asistido (Kahn's Algorithm):** Utilizando teoría de grafos, la aplicación puede calcular y dibujar de forma automática el mejor camino hacia tu graduación, optimizado según restricciones personalizables (Límites de UC y Límite de Materias por semestre).

## 🛠️ Stack Tecnológico

La aplicación está construida utilizando el moderno ecosistema de React (Frontend):

*   **Core:** React 18, TypeScript, Vite
*   **Estilos y UI:** Tailwind CSS (Vanilla + Utilitarios Modernos)
*   **Visualización de Nodos y Canvas:** 
    *   `react-zoom-pan-pinch` para la navegación interactiva (Paneo y Escalado estilo Google Maps).
    *   `react-xarrows` para enrutar flechas ortogonales uniendo los prerrequisitos y correquisitos entre las cartas de las materias.
*   **Almacenamiento Local:** Interfaz abstracta sobre `window.localStorage` para persistencia del progreso estudiantil y de múltiples simulaciones temporales (rutas personalizadas). 

## 🚀 Corriendo el proyecto localmente

Asegúrate de tener Node.js instalado en tu sistema.

1.  Clona el repositorio.
2.  Instala las dependencias:
    ```bash
    npm install
    ```
3.  Arranca el servidor local de desarrollo:
    ```bash
    npm run dev
    ```
4.  La aplicación estará disponible típicamente en `http://localhost:5173`. Para compilarla hacia producción (estáticos puros) usa `npm run build`.

## ✉️ Feedback y Contribuciones

Este es un proyecto open-source y parte de un portafolio personal. Toda retroalimentación es altamente valorada. 
Si encuentras bugs algorítmicos (especialmente en la lógica condicional del DAG y la estructura de Kahn), o quieres sugerir modificaciones sobre la interfaz:

* Deja un [Issue estructurado en el repositorio](https://github.com/earmasag/malla-curricular/issues).
