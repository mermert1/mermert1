<script lang="ts">
  import type { PageData } from './$types';
  
  export let data: PageData;
</script>

<div class="container mx-auto max-w-4xl py-12 px-4">
  <div class="mb-10">
    <h1 class="text-4xl font-bold tracking-tight mb-4">Documentation</h1>
    <p class="text-xl text-muted-foreground">Learn how to use Graphi to create beautiful diagrams.</p>
  </div>

  <div class="grid gap-4">
    {#each data.docs as doc (doc.slug)}
      <a href="/docs/{doc.slug}" class="block p-6 bg-card border border-border rounded-xl hover:border-primary/50 transition-colors shadow-sm glow-hover">
        <h2 class="text-2xl font-semibold mb-2">{doc.title}</h2>
        <time class="text-sm text-muted-foreground">
          {new Date(doc.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
        </time>
      </a>
    {/each}
    {#if data.docs.length === 0}
      <div class="text-center py-12 text-muted-foreground border border-dashed rounded-xl">
        No documentation found. Sign in to the CMS to create an entry!
      </div>
    {/if}
  </div>
</div>
