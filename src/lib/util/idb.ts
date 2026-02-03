import { openDB, type IDBPDatabase } from 'idb';

const DB_NAME = 'mermert-handles';
const STORE_NAME = 'roots';

export async function getDB(): Promise<IDBPDatabase> {
    return openDB(DB_NAME, 1, {
        upgrade(db) {
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME);
            }
        },
    });
}

export async function saveHandle(name: string, handle: FileSystemHandle) {
    const db = await getDB();
    await db.put(STORE_NAME, handle, name);
}

export async function getHandles(): Promise<Record<string, FileSystemHandle>> {
    const db = await getDB();
    const keys = await db.getAllKeys(STORE_NAME);
    const result: Record<string, FileSystemHandle> = {};
    for (const key of keys) {
        result[key as string] = await db.get(STORE_NAME, key);
    }
    return result;
}

export async function removeHandle(name: string) {
    const db = await getDB();
    await db.delete(STORE_NAME, name);
}

export async function clearHandles() {
    const db = await getDB();
    await db.clear(STORE_NAME);
}
