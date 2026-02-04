import { browser } from '$app/environment';
import { writable } from 'svelte/store';

export interface FileMetadata {
  icon?: string;
}

const STORAGE_KEY = 'mermert-file-metadata';
const EXPANSION_KEY = 'mermert-explorer-expansion';
const UI_KEY = 'mermert-ui-state';

function createPersistedStore<T>(key: string, defaultValue: T) {
  const initialValue = browser
    ? JSON.parse(localStorage.getItem(key) || JSON.stringify(defaultValue))
    : defaultValue;
  const store = writable<T>(initialValue);

  const { subscribe, set, update } = store;

  // Persist to localStorage on every change
  if (browser) {
    subscribe((value) => {
      localStorage.setItem(key, JSON.stringify(value));
    });
  }

  return {
    subscribe,
    set,
    update
  };
}

export const fileMetadataStore = (() => {
  const store = createPersistedStore<Record<string, FileMetadata>>(STORAGE_KEY, {});
  return {
    ...store,
    setIcon: (path: string, icon: string | null) => {
      console.log(`Setting icon for ${path} to ${icon}`);
      store.update((metadata) => {
        const newMetadata = { ...metadata };
        if (!icon || icon === 'Default') {
          // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
          delete newMetadata[path];
        } else {
          // Always spread to ensure a new reference for reactivity
          newMetadata[path] = {
            ...newMetadata[path],
            icon
          };
        }
        return newMetadata;
      });
    }
  };
})();

export const expansionStore = createPersistedStore<Record<string, boolean>>(EXPANSION_KEY, {});
export const explorerVisible = createPersistedStore<boolean>(UI_KEY, true);
