import { toast } from 'svelte-sonner';
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
export const activeFileHandle = writable<FileSystemFileHandle | null>(null);

export async function openDirectory(): Promise<void> {
  if (!('showDirectoryPicker' in window)) {
    toast.error(
      'File System Access API is not supported in this browser. Try Chrome, Edge, or Opera.'
    );
    return;
  }
  try {
    const handle = await window.showDirectoryPicker();
    await addRoot(handle);
  } catch (error) {
    if ((error as Error).name !== 'AbortError') {
      console.error('Error opening directory:', error);
      toast.error('Failed to open directory. Check console for details.');
    }
  }
}

export async function addRoot(handle: FileSystemDirectoryHandle) {
  rootHandles.update((roots) => {
    roots[handle.name] = handle;
    return roots;
  });
  await saveHandle(handle.name, handle);
  await refreshDirectory();
}

export async function removeRoot(name: string) {
  rootHandles.update((roots) => {
    const newRoots = { ...roots };
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    delete newRoots[name];
    return newRoots;
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
        children: entries,
        handle,
        kind: 'directory',
        name,
        path: name,
        rootName: name
      });
    } else {
      // We'll show a "needs permission" item in the UI later
      allEntries.push({
        children: [],
        handle,
        kind: 'directory',
        name: `${name} (Click to re-authorize)`,
        path: name,
        rootName: name
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
    for await (const entry of dirHandle.values()) {
      const entryPath = `${path}/${entry.name}`;

      if (entry.kind === 'file') {
        if (/\.(mmd|mermaid|txt|json|dia|md)$/i.test(entry.name)) {
          entries.push({
            handle: entry as FileSystemFileHandle,
            kind: 'file',
            name: entry.name,
            path: entryPath,
            rootName
          });
        }
      } else if (entry.kind === 'directory') {
        entries.push({
          children: await readDirectory(entry as FileSystemDirectoryHandle, rootName, entryPath),
          handle: entry as FileSystemDirectoryHandle,
          kind: 'directory',
          name: entry.name,
          path: entryPath,
          rootName
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
  activeFileHandle.set(fileHandle); // Set active handle on read
  const file = await fileHandle.getFile();
  return await file.text();
}

export async function writeFile(fileHandle: FileSystemFileHandle, content: string): Promise<void> {
  try {
    const writable = await fileHandle.createWritable();
    await writable.write(content);
    await writable.close();
  } catch (error) {
    console.error('Error writing file:', error);
    throw error;
  }
}

export async function saveFile(content: string, suggestedName = 'diagram.dia'): Promise<boolean> {
  try {
    const handle = await window.showSaveFilePicker({
      suggestedName,
      types: [
        {
          description: 'Mermaid Diagram',
          accept: { 'text/vnd.mermaid': ['.dia'] }
        }
      ]
    });
    const writable = await handle.createWritable();
    await writable.write(content);
    await writable.close();
    return true;
  } catch (error) {
    if ((error as Error).name !== 'AbortError') {
      console.error('Error saving file:', error);
      throw error;
    }
  }
  return false;
}
