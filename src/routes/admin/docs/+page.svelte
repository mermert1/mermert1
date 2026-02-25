<script lang="ts">
    import { onMount } from 'svelte';
    import { getDirectoryContents, deleteFile } from '$lib/github/api';
    import { goto } from '$app/navigation';

    let files: any[] = [];
    let isLoading = true;
    let error = '';

    const DOCS_PATH = 'src/content/docs';

    onMount(async () => {
        try {
            const contents = await getDirectoryContents(DOCS_PATH);
            // Filter only markdown files
            files = contents.filter((f: any) => f.name.endsWith('.md'))
                            .sort((a, b) => b.name.localeCompare(a.name)); // Newest first via date in filename
        } catch (e) {
            error = 'Failed to load documents from GitHub.';
            console.error(e);
        } finally {
            isLoading = false;
        }
    });

    function createNew() {
        // Just route to a non-existent slug to trigger create mode
        goto('/admin/docs/new-document');
    }

    async function handleDelete(file: any) {
        if (!confirm(`Are you sure you want to permanently delete ${file.name}? This will commit a deletion to the repository.`)) {
            return;
        }

        try {
            await deleteFile(file.path, `chore(cms): delete ${file.name}`, file.sha);
            // Refresh list
            files = files.filter(f => f.sha !== file.sha);
        } catch (e) {
            alert('Failed to delete file. Check console.');
            console.error(e);
        }
    }
</script>

<div class="max-w-5xl mx-auto">
    <div class="flex items-center justify-between mb-8">
        <div>
            <h1 class="text-3xl font-bold mb-2">Documentation</h1>
            <p class="text-muted-foreground">Manage your markdown documentation files directly on GitHub.</p>
        </div>
        <button 
            class="px-4 py-2 bg-primary text-primary-foreground font-medium rounded-md hover:bg-primary/90 transition-colors flex items-center gap-2 shadow-sm"
            on:click={createNew}
        >
            <i class="fas fa-plus"></i> New Document
        </button>
    </div>

    {#if error}
        <div class="mb-6 p-4 border border-destructive/20 bg-destructive/10 text-destructive rounded-lg flex items-center gap-2">
            <i class="fas fa-exclamation-triangle"></i> {error}
        </div>
    {/if}

    <div class="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        {#if isLoading}
            <div class="p-12 flex justify-center text-muted-foreground">
                <i class="fas fa-circle-notch fa-spin text-3xl"></i>
            </div>
        {:else if files.length === 0}
            <div class="p-12 text-center text-muted-foreground flex flex-col items-center">
                <i class="fas fa-folder-open text-4xl mb-4 opacity-50"></i>
                <p>No documents found in `src/content/docs`.</p>
            </div>
        {:else}
            <div class="grid grid-cols-1 divide-y divide-border">
                <!-- Header row -->
                <div class="grid grid-cols-12 gap-4 p-4 bg-muted/30 text-xs font-semibold uppercase text-muted-foreground tracking-wider">
                    <div class="col-span-8">Filename</div>
                    <div class="col-span-2 text-right">Size</div>
                    <div class="col-span-2 text-right">Actions</div>
                </div>
                
                <!-- Data rows -->
                {#each files as file}
                    <div class="grid grid-cols-12 gap-4 p-4 items-center hover:bg-muted/20 transition-colors group">
                        <div class="col-span-8 flex items-center gap-3">
                            <i class="fab fa-markdown text-primary/70 text-xl"></i>
                            <a 
                                href="/admin/docs/{file.name.replace('.md', '')}?sha={file.sha}" 
                                class="font-medium text-foreground hover:text-primary transition-colors focus:outline-none focus:underline"
                            >
                                {file.name}
                            </a>
                        </div>
                        <div class="col-span-2 text-right text-sm text-muted-foreground">
                            {(file.size / 1024).toFixed(1)} KB
                        </div>
                        <div class="col-span-2 flex justify-end gap-2 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
                            <a 
                                href="/admin/docs/{file.name.replace('.md', '')}?sha={file.sha}"
                                class="p-2 text-muted-foreground hover:text-primary bg-background border border-border rounded transition-colors shadow-sm"
                                title="Edit"
                            >
                                <i class="fas fa-pen"></i>
                            </a>
                            <button 
                                class="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 border border-transparent rounded transition-colors"
                                on:click={() => handleDelete(file)}
                                title="Delete"
                            >
                                <i class="fas fa-trash-alt"></i>
                            </button>
                        </div>
                    </div>
                {/each}
            </div>
        {/if}
    </div>
</div>
