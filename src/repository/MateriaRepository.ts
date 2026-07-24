import type { ProgresoMalla, SavedRoute } from "../types/materia";
import type { IStorageWrapper } from "../core/IStorageWrapper";
import { LocalStorageWrapper } from "../core/LocalStorageWrapper";

export class MateriaRepository {
    private storage: IStorageWrapper;
    private activePlanId: string;

    // Inyectamos el storage wrapper, por defecto usamos el Singleton de localStorage
    constructor(activePlanId: string, storageWrapper: IStorageWrapper = LocalStorageWrapper.getInstance()) {
        this.activePlanId = activePlanId;
        this.storage = storageWrapper;
    }

    private get storageKey() { return `malla-progreso-${this.activePlanId}`; }
    private get customRouteDraftKey() { return `malla-custom-route-draft-${this.activePlanId}`; }
    private get savedRoutesKey() { return `malla-saved-routes-${this.activePlanId}`; }
    private get pensumAnteriorKey() { return `malla-pensum-anterior-${this.activePlanId}`; }

    /**
     * Recupera el progreso de estudio previamente guardado.
     * Retorna un objeto vacío si no existe progreso persistido o si hubo un error.
     */
    public getStudentProgress(): ProgresoMalla {
        // Fallback for legacy key if migrating for the first time
        const legacyProgress = this.storage.get<ProgresoMalla>('malla-progreso');
        const progress = this.storage.get<ProgresoMalla>(this.storageKey);
        
        const activeProgress = progress || (this.activePlanId === "202415" ? legacyProgress : null);

        if (activeProgress && typeof activeProgress === 'object' && Object.keys(activeProgress).length > 0) {
            return activeProgress;
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
        this.storage.remove(this.pensumAnteriorKey);
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

    // --- Pensum Anterior --- //
    
    public getPensumAnterior(): Record<string, boolean> {
        const data = this.storage.get<Record<string, boolean>>(this.pensumAnteriorKey);
        if (data && typeof data === 'object') {
            return data;
        }
        return {};
    }

    public savePensumAnterior(data: Record<string, boolean>): void {
        this.storage.set(this.pensumAnteriorKey, data);
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
