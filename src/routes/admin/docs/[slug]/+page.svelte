<script lang="ts">
    import { onMount } from 'svelte';
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';
    import { getFileContent, commitFile } from '$lib/github/api';
    import matter from 'gray-matter';

    let title = '';
    let category = 'docs';
    let contentBody = '';
    
    let originalSha = '';
    let originalPath = '';
    
    let isLoading = true;
    let isSaving = false;
    let error = '';

    const slug = $page.params.slug;
    const isNew = slug === 'new-document';

    onMount(async () => {
        if (!isNew) {
            originalPath = `src/content/docs/${slug}.md`;
            
            // Get SHA from URL query if we came from list view
            const urlSha = $page.url.searchParams.get('sha');
            if (urlSha) originalSha = urlSha;

            try {
                const { content: rawFileContent, sha } = await getFileContent(originalPath);
                originalSha = sha;
                
                // Parse frontmatter
                const parsed = matter(rawFileContent);
                contentBody = parsed.content || '';
                title = parsed.data.title || slug.replace(/-/g, ' ');
                category = parsed.data.category || 'docs';
            } catch (e) {
                error = 'Failed to load document. It may have been deleted or moved on GitHub.';
                console.error(e);
            }
        }
        isLoading = false;
    });

    async function handleSave() {
        if (!title.trim()) {
            error = 'Title is required';
            return;
        }

        isSaving = true;
        error = '';

        try {
            // Reconstruct markdown with frontmatter
            const dateStr = new Date().toISOString().split('T')[0];
            const frontmatterObj = {
                title,
                category,
                date: dateStr
            };
            
            const rawOutput = matter.stringify(contentBody, frontmatterObj);

            // Determine filename (use existing path if editing, generate new if creating)
            let targetPath = originalPath;
            let commitMessage = `content: update ${title}`;
            
            if (isNew) {
                // Generate safe slug from title
                const newSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
                targetPath = `src/content/docs/${dateStr}-${newSlug}.md`;
                commitMessage = `content: create ${title}`;
            }

            await commitFile(targetPath, rawOutput, commitMessage, isNew ? undefined : originalSha);

            // Success! Return to list
            goto('/admin/docs');
            
        } catch (e) {
            error = e instanceof Error ? e.message : 'Failed to save to GitHub';
            console.error(e);
        } finally {
            isSaving = false;
        }
    }
</script>

<div class="max-w-5xl mx-auto pb-24">
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div class="flex items-center gap-3">
            <a href="/admin/docs" class="p-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md transition-colors">
                <i class="fas fa-arrow-left"></i>
            </a>
            <h1 class="text-2xl font-bold">{isNew ? 'Create Document' : 'Edit Document'}</h1>
            {#if !isNew && !isLoading}
                <span class="px-2.5 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full border border-primary/20 bg-glow-primary">{slug}.md</span>
            {/if}
        </div>
        
        <div class="flex items-center gap-3">
            <button 
                class="px-4 py-2 border border-border bg-card text-foreground font-medium rounded-md hover:bg-muted transition-colors"
                on:click={() => goto('/admin/docs')}
                disabled={isSaving}
            >
                Cancel
            </button>
            <button 
                class="px-6 py-2 bg-primary text-primary-foreground font-medium rounded-md hover:bg-primary/90 transition-colors shadow-lg hover:shadow-xl hover:shadow-primary/20 flex items-center gap-2"
                on:click={handleSave}
                disabled={isLoading || isSaving}
            >
                {#if isSaving}
                    <i class="fas fa-spinner fa-spin"></i> Committing to Git...
                {:else}
                    <i class="fas fa-cloud-upload-alt"></i> Save & Publish
                {/if}
            </button>
        </div>
    </div>

    {#if error}
        <div class="mb-6 p-4 border border-destructive/20 bg-destructive/10 text-destructive rounded-lg flex items-center gap-2">
            <i class="fas fa-exclamation-triangle"></i> {error}
        </div>
    {/if}

    {#if isLoading}
        <div class="flex justify-center items-center h-64 border border-border rounded-xl bg-card">
            <i class="fas fa-circle-notch fa-spin text-4xl text-primary"></i>
        </div>
    {:else}
        <!-- Editor Layout -->
        <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
            
            <!-- Main Editor Area -->
            <div class="lg:col-span-3 space-y-6">
                <div class="bg-card border border-border rounded-xl p-6 shadow-sm">
                    <label for="title" class="block text-sm font-medium text-muted-foreground mb-2">Document Title</label>
                    <input 
                        id="title"
                        type="text" 
                        bind:value={title}
                        placeholder="e.g., Getting Started with Graphi"
                        class="w-full text-2xl font-bold bg-transparent border-b-2 border-border focus:border-primary px-0 py-2 outline-none transition-colors placeholder:font-normal placeholder:text-muted/50"
                    />
                </div>
                
                <div class="bg-card border border-border rounded-xl shadow-sm flex flex-col" style="height: calc(100vh - 350px); min-height: 500px;">
                    <div class="p-3 border-b border-border bg-muted/20 flex items-center gap-2 text-sm text-muted-foreground">
                        <i class="fab fa-markdown"></i> Markdown Content 
                        <span class="ml-auto text-xs opacity-60">Supports standard GitHub Flavored Markdown</span>
                    </div>
                    <textarea 
                        bind:value={contentBody}
                        placeholder="Write your document content here using Markdown..."
                        class="flex-1 w-full bg-transparent p-6 outline-none resize-none font-mono text-sm leading-relaxed"
                    ></textarea>
                </div>
            </div>

            <!-- Settings Sidebar -->
            <div class="lg:col-span-1 space-y-6">
                <!-- Document Meta -->
                <div class="bg-card border border-border rounded-xl p-5 shadow-sm">
                    <h3 class="font-semibold mb-4 pb-2 border-b border-border flex items-center gap-2">
                        <i class="fas fa-sliders-h text-muted-foreground"></i> Metadata
                    </h3>
                    
                    <div class="space-y-4">
                        <div>
                            <label for="category" class="block text-sm font-medium text-muted-foreground mb-1">Category</label>
                            <select 
                                id="category" 
                                bind:value={category}
                                class="w-full bg-background border border-border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
                            >
                                <option value="docs">Documentation</option>
                                <option value="changelogs">Changelog</option>
                            </select>
                        </div>
                        
                        {#if !isNew}
                            <div class="pt-4 mt-4 border-t border-border">
                                <p class="text-xs text-muted-foreground mb-1">Git SHA</p>
                                <p class="text-xs font-mono truncate text-foreground" title={originalSha}>{originalSha.substring(0, 10)}...</p>
                            </div>
                        {/if}
                    </div>
                </div>

                <!-- Info Card -->
                <div class="bg-primary/5 border border-primary/20 rounded-xl p-5">
                    <h4 class="text-sm font-semibold text-primary mb-2 flex items-center gap-2">
                        <i class="fas fa-info-circle"></i> Direct to Git
                    </h4>
                    <p class="text-xs text-muted-foreground leading-relaxed">
                        When you click Save, this interface uses your GitHub authorization to instantly create a commit on the <code>main</code> branch.
                        GitHub actions will automatically rebuild the site immediately after.
                    </p>
                </div>
            </div>
            
        </div>
    {/if}
</div>
