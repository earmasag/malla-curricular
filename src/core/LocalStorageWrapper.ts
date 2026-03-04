import type { IStorageWrapper } from './IStorageWrapper';

export class LocalStorageWrapper implements IStorageWrapper {
    private static instance: LocalStorageWrapper;

    private constructor() {
        // Constructor privado para el patrón Singleton
    }

    public static getInstance(): LocalStorageWrapper {
        if (!LocalStorageWrapper.instance) {
            LocalStorageWrapper.instance = new LocalStorageWrapper();
        }
        return LocalStorageWrapper.instance;
    }

    public get<T>(key: string): T | null {
        try {
            const item = localStorage.getItem(key);
            if (item) {
                return JSON.parse(item) as T;
            }
            return null;
        } catch (error) {
            console.error(`Error parsing JSON from localStorage for key "${key}":`, error);
            return null; // En caso de JSON corrupto, retornamos nulo para evitar crasheos
        }
    }

    public set<T>(key: string, value: T): void {
        try {
            const serializedValue = JSON.stringify(value);
            localStorage.setItem(key, serializedValue);
        } catch (error) {
            console.error(`Error saving to localStorage for key "${key}":`, error);
        }
    }

    public remove(key: string): void {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.error(`Error removing item from localStorage for key "${key}":`, error);
        }
    }

    public clear(): void {
        try {
            localStorage.clear();
        } catch (error) {
            console.error("Error clearing localStorage:", error);
        }
    }
}
