<script lang="ts">
  import { urlsStore } from '$/util/state';
  import { Button } from '$/components/ui/button';
  import ExternalLinkIcon from '~icons/material-symbols/open-in-new';

  const playgroundUrl = $derived($urlsStore.mermaidChart({ medium: 'interactive_mode' }).playground);
</script>

<div class="flex h-full flex-col items-center justify-center gap-6 p-8 text-center">
  <div class="flex flex-col gap-2">
    <h1 class="text-3xl font-bold text-accent">Interactive Playground</h1>
    <p class="max-w-md text-muted-foreground">
      The Interactive Playground is a powerful visual editor provided by Mermaid Chart. 
      It allows you to drag, drop, and style your diagrams directly in the preview.
    </p>
  </div>
  
  <div class="relative aspect-video w-full max-w-4xl overflow-hidden rounded-xl border-2 border-border bg-muted/50 shadow-2xl">
     <!-- Attempting to embed the playground. Note: Might be blocked by CSP/X-Frame-Options of the target site -->
     <iframe 
        src={playgroundUrl} 
        title="Mermaid Chart Playground" 
        class="h-full w-full border-none"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
     ></iframe>
     
     <div class="absolute inset-0 flex items-center justify-center bg-background/80 opacity-0 transition-opacity hover:opacity-100">
        <Button href={playgroundUrl} target="_blank" variant="accent" size="lg">
            <ExternalLinkIcon class="mr-2" />
            Open in Full Screen
        </Button>
     </div>
  </div>

  <p class="text-xs text-muted-foreground">
    Note: Interactive mode requires a Mermaid Chart account. Your current diagram will be synced.
  </p>
</div>
