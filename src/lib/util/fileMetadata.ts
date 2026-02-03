import { browser } from '$app/environment';
import { writable } from 'svelte/store';

export interface FileMetadata {
    icon?: string;
}

const STORAGE_KEY = 'mermert-file-metadata';

function createMetadataStore() {
    const initialValue = browser ? JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') : {};
    const { subscribe, update } = writable<Record<string, FileMetadata>>(initialValue);

    return {
        subscribe,
        setIcon: (path: string, icon: string) => {
            update(metadata => {
                const newMetadata = { ...metadata, [path]: { ...metadata[path], icon } };
                if (browser) {
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(newMetadata));
                }
                return newMetadata;
            });
        }
    };
}

export const fileMetadataStore = createMetadataStore();
