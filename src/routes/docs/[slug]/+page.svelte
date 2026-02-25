<script lang="ts">
  import type { PageData } from './$types';
  
  export let data: PageData;
  const doc = data.doc;
</script>

<div class="container mx-auto max-w-3xl py-12 px-4">
  <div class="mb-8">
    <a href="/docs" class="text-sm text-primary hover:underline mb-4 inline-block">&larr; Back to Documentation</a>
    <h1 class="text-4xl font-bold tracking-tight mb-2">{doc.frontmatter.title}</h1>
    <time class="text-sm text-muted-foreground">
      Published {new Date(doc.frontmatter.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
    </time>
  </div>
  
  <article class="prose prose-slate dark:prose-invert max-w-none prose-headings:font-bold prose-a:text-primary">
    <!-- svelte-ignore svelte_no_at_html_tags -->
    {@html doc.html}
  </article>
</div>
