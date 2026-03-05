import type { ProgresoMalla, SavedRoute } from "../types/materia";
import type { IStorageWrapper } from "../core/IStorageWrapper";
import { LocalStorageWrapper } from "../core/LocalStorageWrapper";

export class MateriaRepository {
    private readonly storageKey = 'malla-progreso'; // Manteniendo compatibilidad con datos previos
    private readonly customRouteDraftKey = 'malla-custom-route-draft'; // Para el autoguardado de la ruta en edición
    private readonly savedRoutesKey = 'malla-saved-routes'; // Para las rutas terminadas y guardadas
    private storage: IStorageWrapper;

    // Inyectamos el storage wrapper, por defecto usamos el Singleton de localStorage
    constructor(storageWrapper: IStorageWrapper = LocalStorageWrapper.getInstance()) {
        this.storage = storageWrapper;
    }

    /**
     * Recupera el progreso de estudio previamente guardado.
     * Retorna un objeto vacío si no existe progreso persistido o si hubo un error.
     */
    public getStudentProgress(): ProgresoMalla {
        const progress = this.storage.get<ProgresoMalla>(this.storageKey);
        // Validamos que sea un objeto real y no un tipo primitivo que se coló
        if (progress && typeof progress === 'object' && Object.keys(progress).length > 0) {
            return progress;
        }
        return {};
    }

    /**
     * Persiste el progreso actual del estudiante en el medio de almacenamiento seleccionado.
     */
    public saveStudentProgress(progress: ProgresoMalla): void {
        this.storage.set(this.storageKey, progress);
    }

    /**
     * Elimina todos los registros de progreso del estudiante de este identificador
     */
    /**
     * Elimina todos los registros de progreso del estudiante de este identificador
     */
    public clearProgress(): void {
        this.storage.remove(this.storageKey);
    }

    /**
     * Recupera el borrador de la ruta personalizada actual.
     */
    public getDraftRoute(): string[][] {
        const route = this.storage.get<string[][]>(this.customRouteDraftKey);
        if (Array.isArray(route)) {
            return route;
        }
        return [];
    }

    /**
     * Guarda el borrador de la ruta personalizada.
     */
    public saveDraftRoute(route: string[][]): void {
        this.storage.set(this.customRouteDraftKey, route);
    }

    /**
     * Elimina el borrador de la ruta personalizada.
     */
    public clearDraftRoute(): void {
        this.storage.remove(this.customRouteDraftKey);
    }

    // --- Saved Routes Collection --- //

    /**
     * Recupera todas las rutas guardadas por el usuario.
     */
    public getSavedRoutes(): SavedRoute[] {
        const routes = this.storage.get<SavedRoute[]>(this.savedRoutesKey);
        if (Array.isArray(routes)) {
            return routes;
        }
        return [];
    }

    /**
     * Guarda una nueva ruta o actualiza una existente (por ID).
     */
    public saveRoute(routeToSave: SavedRoute): void {
        const currentRoutes = this.getSavedRoutes();
        const existingIndex = currentRoutes.findIndex(r => r.id === routeToSave.id);

        if (existingIndex >= 0) {
            currentRoutes[existingIndex] = routeToSave;
        } else {
            currentRoutes.push(routeToSave);
        }

        this.storage.set(this.savedRoutesKey, currentRoutes);
    }

    /**
     * Elimina una ruta guardada por su ID.
     */
    public deleteRoute(routeId: string): void {
        const currentRoutes = this.getSavedRoutes();
        const filteredRoutes = currentRoutes.filter(r => r.id !== routeId);
        this.storage.set(this.savedRoutesKey, filteredRoutes);
    }
}
