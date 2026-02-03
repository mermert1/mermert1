<script lang="ts">
  import { fileList, readFile, type FileEntry } from '$lib/util/fileSystem';
  import { updateCodeStore } from '$lib/util/state';
  import FolderIcon from '~icons/material-symbols/folder-open-rounded';
  import CodeIcon from '~icons/material-symbols/code-rounded';
  import ChevronRight from '~icons/material-symbols/chevron-right-rounded';
  
  let { isMobile = false } = $props();
  
  let expandedPaths = $state(new Set<string>());

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
</script>

<div class="flex h-full flex-col overflow-y-auto bg-card p-4 text-card-foreground shadow-inner dark:bg-card">
  <div class="mb-4 flex items-center gap-2 border-b border-border pb-2">
      <FolderIcon class="text-primary size-5" />
      <h3 class="font-semibold text-primary">Explorer</h3>
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
            <button 
                class="flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-sm transition-colors hover:bg-primary hover:text-primary-foreground"
                onclick={() => loadFile(entry)}
            >
                <div class="size-4 shrink-0"></div> 
                <CodeIcon class="size-4 opacity-70"/>
                <span class="truncate">{entry.name}</span>
            </button>
        {/if}
    </div>
{/snippet}
