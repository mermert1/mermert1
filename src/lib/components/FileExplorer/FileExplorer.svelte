<script lang="ts">
  import { fileList, readFile, refreshDirectory, openDirectory, removeRoot, renameEntry, type FileEntry } from '$lib/util/fileSystem';
  import { fileMetadataStore, expansionStore } from '$lib/util/fileMetadata';
  import { updateCodeStore } from '$lib/util/state';
  import FolderIcon from '~icons/material-symbols/folder-open-rounded';
  import CodeIcon from '~icons/material-symbols/code-rounded';
  import ChevronRight from '~icons/material-symbols/chevron-right-rounded';
  import RefreshIcon from '~icons/material-symbols/refresh-rounded';
  import SettingsIcon from '~icons/material-symbols/settings-outline-rounded';
  import AddFolderIcon from '~icons/material-symbols/create-new-folder-outline-rounded';
  import CloseIcon from '~icons/material-symbols/close-rounded';
  import EditIcon from '~icons/material-symbols/edit-outline-rounded';
  import DatabaseIcon from '~icons/material-symbols/database';
  import CloudIcon from '~icons/material-symbols/cloud';
  import LockIcon from '~icons/material-symbols/lock-outline';
  import ProcessIcon from '~icons/material-symbols/settings-backup-restore-rounded';
  import * as Popover from '$/components/ui/popover';
  import { Button } from '$/components/ui/button';
  import { Input } from '$/components/ui/input';
  import { toast } from 'svelte-sonner';
  
  let { isMobile = false } = $props();
  
  let editingPath = $state<string | null>(null);
  let editValue = $state("");

  const iconMap: Record<string, any> = {
    'Default': CodeIcon,
    'Database': DatabaseIcon,
    'Cloud': CloudIcon,
    'Lock': LockIcon,
    'Process': ProcessIcon
  };

  const iconOptions = Object.entries(iconMap).map(([name, icon]) => ({ name, icon }));

  function toggleExpand(path: string) {
    const current = $expansionStore[path];
    expansionStore.set({ ...$expansionStore, [path]: !current });
  }

  async function loadFile(entry: FileEntry) {
    if (entry.kind !== 'file') return;
    try {
      const content = await readFile(entry.handle as FileSystemFileHandle);
      updateCodeStore({ code: content });
    } catch (err) {
      console.error('Failed to read file', err);
      toast.error('Failed to read file. You might need to re-authorize the folder.');
    }
  }

  async function handleRefresh() {
    await refreshDirectory();
    toast.success('Explorer refreshed');
  }

  function startRename(entry: FileEntry) {
    editingPath = entry.path;
    editValue = entry.name;
  }

  async function submitRename(entry: FileEntry) {
    if (!editValue || editValue === entry.name) {
      editingPath = null;
      return;
    }
    try {
      await renameEntry(entry, editValue);
      toast.success('Renamed successfully');
    } catch (err) {
      toast.error('Rename failed. Experimental API might not be supported in this browser.');
    } finally {
      editingPath = null;
    }
  }

  function stripExtension(name: string) {
    return name.replace(/\.(mmd|mermaid|txt|json|dia|md)$/i, '');
  }

  async function reauthorize(entry: FileEntry) {
      try {
          // @ts-ignore
          const permission = await entry.handle.requestPermission({ mode: 'readwrite' });
          if (permission === 'granted') {
              await refreshDirectory();
          }
      } catch (err) {
          console.error('Re-auth failed', err);
      }
  }
</script>

<div class="flex h-full flex-col bg-card text-card-foreground shadow-inner dark:bg-card border-r border-border">
  <div class="flex items-center justify-between border-b border-border p-3">
      <div class="flex items-center gap-2">
        <FolderIcon class="text-primary size-5" />
        <h3 class="text-sm font-bold uppercase tracking-wider text-muted-foreground">Explorer</h3>
      </div>
      <div class="flex gap-1">
        <Button variant="ghost" size="icon" class="size-7" onclick={openDirectory} title="Add Folder">
          <AddFolderIcon class="size-4" />
        </Button>
        <Button variant="ghost" size="icon" class="size-7" onclick={handleRefresh} title="Refresh">
          <RefreshIcon class="size-4" />
        </Button>
      </div>
  </div>

  <div class="flex-1 overflow-y-auto p-2">
    <div class="flex flex-col gap-1">
      {#each $fileList as entry (entry.path)}
        {@render fileItem(entry, 0)}
      {/each}
      {#if $fileList.length === 0}
          <div class="py-8 text-center text-sm text-muted-foreground px-4">
              <p class="mb-4">No folders open.</p>
              <Button variant="outline" size="sm" class="w-full" onclick={openDirectory}>
                Open Folder
              </Button>
          </div>
      {/if}
    </div>
  </div>
</div>

{#snippet fileItem(entry: FileEntry, depth: number)}
    <div class="flex flex-col">
        {#if entry.kind === 'directory'}
            <div 
                class="group flex w-full items-center gap-1 rounded px-2 py-1 text-left text-sm transition-colors hover:bg-muted/50"
                style="padding-left: {depth * 12 + 8}px"
            >
                <button 
                  class="flex flex-1 items-center gap-1 overflow-hidden"
                  onclick={() => entry.name.includes('Click to re-authorize') ? reauthorize(entry) : toggleExpand(entry.path)}
                >
                  <span class="text-muted-foreground transition-transform duration-200" class:rotate-90={$expansionStore[entry.path]}>
                      <ChevronRight class="size-4" />
                  </span>
                  <FolderIcon class="size-4 shrink-0 text-primary opacity-80" />
                  <span class="truncate font-semibold">{entry.name}</span>
                </button>
                
                {#if depth === 0}
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    class="size-6 opacity-0 group-hover:opacity-100" 
                    onclick={(e) => { e.stopPropagation(); removeRoot(entry.rootName); }}
                    title="Close Folder"
                  >
                    <CloseIcon class="size-3" />
                  </Button>
                {/if}
            </div>
            {#if $expansionStore[entry.path] && entry.children}
                <div class="flex flex-col">
                    {#each entry.children as child (child.path)}
                        {@render fileItem(child, depth + 1)}
                    {/each}
                </div>
            {/if}
        {:else}
            <div 
              class="group flex w-full items-center gap-2 rounded px-2 py-0.5 transition-colors hover:bg-muted/50"
              style="padding-left: {depth * 12 + 24}px"
              class:bg-muted={editingPath === entry.path}
            >
                {#if editingPath === entry.path}
                  <Input 
                    bind:value={editValue} 
                    class="h-6 py-0 text-xs" 
                    autofocus 
                    onkeydown={(e) => e.key === 'Enter' && submitRename(entry)}
                    onblur={() => submitRename(entry)}
                  />
                {:else}
                  <button 
                      class="flex flex-1 items-center gap-2 min-w-0"
                      onclick={() => loadFile(entry)}
                      ondblclick={() => startRename(entry)}
                  >
                      <div class="size-4 shrink-0 flex items-center justify-center">
                          {#if $fileMetadataStore[entry.path]?.icon}
                             {@const IconComp = iconMap[$fileMetadataStore[entry.path].icon] || CodeIcon}
                             <IconComp class="size-4 text-accent opacity-100"/>
                          {:else}
                             <CodeIcon class="size-4 opacity-70"/>
                          {/if}
                      </div> 
                      <span class="truncate text-sm">{stripExtension(entry.name)}</span>
                  </button>
                  
                  <div class="flex items-center gap-0 opacity-0 group-hover:opacity-100">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      class="size-6"
                      onclick={() => startRename(entry)}
                      title="Rename"
                    >
                      <EditIcon class="size-3" />
                    </Button>

                    <Popover.Root>
                      <Popover.Trigger>
                        <Button variant="ghost" size="icon" class="size-6">
                          <SettingsIcon class="size-3" />
                        </Button>
                      </Popover.Trigger>
                      <Popover.Content class="w-40 p-2" side="right" align="start">
                        <div class="flex flex-col gap-1">
                          <p class="mb-1 px-2 text-[10px] font-bold uppercase text-muted-foreground">Select Icon</p>
                          {#each iconOptions as opt}
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              class="justify-start gap-2 h-8"
                              onclick={() => {
                                fileMetadataStore.setIcon(entry.path, opt.name);
                              }}
                            >
                              <opt.icon class="size-3" />
                              <span class="text-xs">{opt.name}</span>
                            </Button>
                          {/each}
                        </div>
                      </Popover.Content>
                    </Popover.Root>
                  </div>
                {/if}
            </div>
        {/if}
    </div>
{/snippet}
