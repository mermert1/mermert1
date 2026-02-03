import { get, writable } from 'svelte/store';
import { getHandles, removeHandle, saveHandle } from './idb';

export interface FileEntry {
  name: string;
  kind: 'file' | 'directory';
  handle: FileSystemFileHandle | FileSystemDirectoryHandle;
  children?: FileEntry[];
  path: string; // Absolute-ish path (root_name/path)
  rootName: string; // The name of the root folder
}

export const rootHandles = writable<Record<string, FileSystemDirectoryHandle>>({});
export const fileList = writable<FileEntry[]>([]);

export async function openDirectory(): Promise<void> {
  try {
    const handle = await window.showDirectoryPicker();
    await addRoot(handle);
  } catch (error) {
    if ((error as Error).name !== 'AbortError') {
      console.error('Error opening directory:', error);
    }
  }
}

export async function addRoot(handle: FileSystemDirectoryHandle) {
  rootHandles.update(roots => {
    roots[handle.name] = handle;
    return roots;
  });
  await saveHandle(handle.name, handle);
  await refreshDirectory();
}

export async function removeRoot(name: string) {
  rootHandles.update(roots => {
    delete roots[name];
    return roots;
  });
  await removeHandle(name);
  await refreshDirectory();
}

export async function loadRoots() {
  const handles = await getHandles();
  // We need to request permission for each handle because they are persisted
  const validHandles: Record<string, FileSystemDirectoryHandle> = {};

  for (const [name, handle] of Object.entries(handles)) {
    if (handle.kind === 'directory') {
      validHandles[name] = handle as FileSystemDirectoryHandle;
    }
  }

  rootHandles.set(validHandles);
  await refreshDirectory();
}

export async function refreshDirectory(): Promise<void> {
  const roots = get(rootHandles);
  const allEntries: FileEntry[] = [];

  for (const [name, handle] of Object.entries(roots)) {
    // Check permission - on load it might be 'prompt'
    const permission = await handle.queryPermission({ mode: 'readwrite' });
    if (permission === 'granted') {
      const entries = await readDirectory(handle, name, name);
      allEntries.push({
        name,
        kind: 'directory',
        handle,
        path: name,
        rootName: name,
        children: entries
      });
    } else {
      // We'll show a "needs permission" item in the UI later
      allEntries.push({
        name: `${name} (Click to re-authorize)`,
        kind: 'directory',
        handle,
        path: name,
        rootName: name,
        children: []
      });
    }
  }
  fileList.set(allEntries);
}

async function readDirectory(
  dirHandle: FileSystemDirectoryHandle,
  rootName: string,
  path = ''
): Promise<FileEntry[]> {
  const entries: FileEntry[] = [];

  try {
    // @ts-ignore
    for await (const entry of dirHandle.values()) {
      const entryPath = `${path}/${entry.name}`;

      if (entry.kind === 'file') {
        if (/\.(mmd|mermaid|txt|json|dia|md)$/i.test(entry.name)) {
          entries.push({
            name: entry.name,
            kind: 'file',
            handle: entry as FileSystemFileHandle,
            path: entryPath,
            rootName
          });
        }
      } else if (entry.kind === 'directory') {
        entries.push({
          name: entry.name,
          kind: 'directory',
          handle: entry as FileSystemDirectoryHandle,
          path: entryPath,
          rootName,
          children: await readDirectory(entry as FileSystemDirectoryHandle, rootName, entryPath)
        });
      }
    }
  } catch (err) {
    console.error(`Error reading directory ${path}:`, err);
  }

  return entries.sort((a, b) => {
    if (a.kind === b.kind) return a.name.localeCompare(b.name);
    return a.kind === 'directory' ? -1 : 1;
  });
}

export async function readFile(fileHandle: FileSystemFileHandle): Promise<string> {
  const file = await fileHandle.getFile();
  return await file.text();
}

export async function saveFile(content: string, suggestedName = 'diagram.dia'): Promise<void> {
  try {
    const handle = await window.showSaveFilePicker({
      suggestedName,
      types: [{
        description: 'Mermaid Diagram',
        accept: { 'text/vnd.mermaid': ['.dia'] },
      }],
    });
    const writable = await handle.createWritable();
    await writable.write(content);
    await writable.close();
  } catch (error) {
    if ((error as Error).name !== 'AbortError') {
      console.error('Error saving file:', error);
      throw error;
    }
  }
}

export async function renameEntry(entry: FileEntry, newName: string) {
  // Note: FileSystemHandle.rename is a newer/experimental API.
  // If it's not available, we have to copy and delete.
  try {
    if ('rename' in entry.handle) {
      // @ts-ignore
      await entry.handle.rename(newName);
    } else {
      console.warn('rename API not available, copy/delete fallback needed');
      // TODO: fallback implementation if needed
      throw new Error('Rename API not available');
    }
    await refreshDirectory();
  } catch (err) {
    console.error('Rename failed', err);
    throw err;
  }
}
