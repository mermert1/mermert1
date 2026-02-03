import { writable } from 'svelte/store';

export interface FileEntry {
  name: string;
  kind: 'file' | 'directory';
  handle: FileSystemFileHandle | FileSystemDirectoryHandle;
  children?: FileEntry[];
  path: string; // Relative path for display/logic
}

export const currentDirHandle = writable<FileSystemDirectoryHandle | null>(null);
export const fileList = writable<FileEntry[]>([]);

export async function openDirectory(): Promise<void> {
  try {
    const handle = await window.showDirectoryPicker();
    currentDirHandle.set(handle);
    const entries = await readDirectory(handle);
    fileList.set(entries);
  } catch (error) {
    if ((error as Error).name !== 'AbortError') {
      console.error('Error opening directory:', error);
    }
  }
}

async function readDirectory(
  dirHandle: FileSystemDirectoryHandle,
  path = ''
): Promise<FileEntry[]> {
  const entries: FileEntry[] = [];

  // @ts-ignore - TypeScript might not have full File System Access API types by default in all envs yet
  for await (const entry of dirHandle.values()) {
    const entryPath = path ? `${path}/${entry.name}` : entry.name;

    if (entry.kind === 'file') {
      // Filter for mermaid supported files
      if (/\.(mmd|mermaid|txt|json|dia)$/i.test(entry.name)) {
        entries.push({
          name: entry.name,
          kind: 'file',
          handle: entry as FileSystemFileHandle,
          path: entryPath
        });
      }
    } else if (entry.kind === 'directory') {
      entries.push({
        name: entry.name,
        kind: 'directory',
        handle: entry as FileSystemDirectoryHandle,
        path: entryPath,
        children: await readDirectory(entry as FileSystemDirectoryHandle, entryPath)
      });
    }
  }

  // Sort: Directories first, then files
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
