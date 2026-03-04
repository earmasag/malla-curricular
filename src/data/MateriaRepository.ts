import type { ProgresoMalla } from "../types/materia";
import type { IStorageWrapper } from "../core/IStorageWrapper";
import { LocalStorageWrapper } from "../core/LocalStorageWrapper";

export class MateriaRepository {
    private readonly storageKey = 'malla-progreso'; // Manteniendo compatibilidad con datos previos
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
    public clearProgress(): void {
        this.storage.remove(this.storageKey);
    }
}
