import { browser } from '$app/environment';
import { writable } from 'svelte/store';

export interface FileMetadata {
    icon?: string;
}

const STORAGE_KEY = 'mermert-file-metadata';
const EXPANSION_KEY = 'mermert-explorer-expansion';
const UI_KEY = 'mermert-ui-state';

function createPersistedStore<T>(key: string, defaultValue: T) {
    const initialValue = browser ? JSON.parse(localStorage.getItem(key) || JSON.stringify(defaultValue)) : defaultValue;
    const { subscribe, update, set } = writable<T>(initialValue);

    return {
        subscribe,
        update,
        set: (value: T) => {
            if (browser) {
                localStorage.setItem(key, JSON.stringify(value));
            }
            set(value);
        }
    };
}

export const fileMetadataStore = (() => {
    const store = createPersistedStore<Record<string, FileMetadata>>(STORAGE_KEY, {});
    return {
        ...store,
        setIcon: (path: string, icon: string) => {
            store.update(metadata => {
                const newMetadata = { ...metadata, [path]: { ...metadata[path], icon } };
                if (browser) {
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(newMetadata));
                }
                return newMetadata;
            });
        }
    };
})();

export const expansionStore = createPersistedStore<Record<string, boolean>>(EXPANSION_KEY, {});
export const explorerVisible = createPersistedStore<boolean>(UI_KEY, true);
