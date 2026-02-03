  import { fileList, readFile, refreshDirectory, type FileEntry } from '$lib/util/fileSystem';
  import { fileMetadataStore } from '$lib/util/fileMetadata';
  import { updateCodeStore } from '$lib/util/state';
  import FolderIcon from '~icons/material-symbols/folder-open-rounded';
  import CodeIcon from '~icons/material-symbols/code-rounded';
  import ChevronRight from '~icons/material-symbols/chevron-right-rounded';
  import RefreshIcon from '~icons/material-symbols/refresh-rounded';
  import SettingsIcon from '~icons/material-symbols/settings-outline-rounded';
  import * as Popover from '$/components/ui/popover';
  import { Button } from '$/components/ui/button';
  
  let { isMobile = false } = $props();
  
  let expandedPaths = $state(new Set<string>());

  const iconOptions = [
    { name: 'Default', icon: CodeIcon },
    { name: 'Database', icon: () => import('~icons/material-symbols/database') },
    { name: 'Cloud', icon: () => import('~icons/material-symbols/cloud') },
    { name: 'Lock', icon: () => import('~icons/material-symbols/lock-outline') },
    { name: 'Process', icon: () => import('~icons/material-symbols/settings-backup-restore-rounded') }
  ];

  function toggleExpand(path: string) {
    if (expandedPaths.has(path)) {
      expandedPaths.delete(path);
    } else {
      expandedPaths.add(path);
    }
    expandedPaths = new Set(expandedPaths); 
  }

  async function loadFile(entry: FileEntry) {
    if (entry.kind !== 'file') return;
    try {
      const content = await readFile(entry.handle as FileSystemFileHandle);
      updateCodeStore({ code: content });
    } catch (err) {
      console.error('Failed to read file', err);
    }
  }

  async function handleRefresh() {
    await refreshDirectory();
  }

<div class="flex h-full flex-col overflow-y-auto bg-card p-4 text-card-foreground shadow-inner dark:bg-card">
  <div class="mb-4 flex items-center justify-between border-b border-border pb-2">
      <div class="flex items-center gap-2">
        <FolderIcon class="text-primary size-5" />
        <h3 class="font-semibold text-primary">Explorer</h3>
      </div>
      <Button variant="ghost" size="icon" class="size-8" onclick={handleRefresh} title="Refresh">
        <RefreshIcon class="size-4" />
      </Button>
  </div>
  <div class="flex flex-col gap-1">
    {#each $fileList as entry (entry.path)}
      {@render fileItem(entry)}
    {/each}
    {#if $fileList.length === 0}
        <div class="py-4 text-center text-sm text-muted-foreground italic">
            No folder opened. 
            <br>
            Use the folder icon in the navbar.
        </div>
    {/if}
  </div>
</div>

{#snippet fileItem(entry: FileEntry)}
    <div class="ml-2 flex flex-col">
        {#if entry.kind === 'directory'}
            <button 
                class="group flex w-full items-center gap-1 rounded px-2 py-1.5 text-left text-sm transition-colors hover:bg-muted"
                onclick={() => toggleExpand(entry.path)}
            >
                <span class="text-muted-foreground transition-transform duration-200" class:rotate-90={expandedPaths.has(entry.path)}>
                    <ChevronRight class="size-4" />
                </span>
                <FolderIcon class="size-4 text-primary opacity-80 group-hover:opacity-100"/>
                <span class="truncate font-medium">{entry.name}</span>
            </button>
            {#if expandedPaths.has(entry.path) && entry.children}
                <div class="ml-2 border-l border-border pl-2">
                    {#each entry.children as child (child.path)}
                        {@render fileItem(child)}
                    {/each}
                </div>
            {/if}
        {:else}
            <div class="group flex w-full items-center gap-2 rounded px-2 py-1 transition-colors hover:bg-muted">
                <button 
                    class="flex flex-1 items-center gap-2 text-left text-sm"
                    onclick={() => loadFile(entry)}
                >
                    <div class="size-4 shrink-0">
                        {#if $fileMetadataStore[entry.path]?.icon}
                           <!-- This would need a smarter icon renderer, but for now we'll just show the default if custom is set -->
                           <CodeIcon class="size-4 text-accent opacity-100"/>
                        {:else}
                           <CodeIcon class="size-4 opacity-70"/>
                        {/if}
                    </div> 
                    <span class="truncate">{entry.name}</span>
                </button>
                
                <Popover.Root>
                  <Popover.Trigger>
                    <Button variant="ghost" size="icon" class="size-6 opacity-0 group-hover:opacity-100">
                      <SettingsIcon class="size-3" />
                    </Button>
                  </Popover.Trigger>
                  <Popover.Content class="w-40 p-2">
                    <div class="flex flex-col gap-1">
                      <p class="mb-1 px-2 text-[10px] font-bold uppercase text-muted-foreground">Select Icon</p>
                      {#each iconOptions as opt}
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          class="justify-start gap-2 h-8"
                          onclick={() => fileMetadataStore.setIcon(entry.path, opt.name)}
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
{/snippet}
