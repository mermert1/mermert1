<script lang="ts">
  import { Button } from '$/components/ui/button';
  import { onMount } from 'svelte';

  // Simple SEO
  const title = 'Graphi - Diagramming for everyone';
  const description =
    'Create beautiful diagrams with valid Markdown and Mermaid logic. The editor for professionals.';

  onMount(() => {
    // Optional: add some entry animation logic here if needed
  });
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="description" content={description} />
</svelte:head>

<div
  class="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background p-4 text-center">
  <!-- Background Effects -->
  <div
    class="absolute inset-0 -z-10 h-full w-full bg-background bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
  </div>
  <div
    class="absolute top-0 right-0 left-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary/20 opacity-20 blur-[100px]">
  </div>

  <!-- Content -->
  <div
    class="z-10 flex max-w-2xl animate-in flex-col items-center gap-8 duration-500 fade-in zoom-in">
    <div class="space-y-4">
      <h1 class="text-6xl font-extrabold tracking-tighter sm:text-7xl">
        <span class="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"
          >Graphi</span>
      </h1>
      <p class="text-xl font-light text-muted-foreground md:text-2xl">
        Visualize your ideas. Simple. Powerful. Open.
      </p>
    </div>

    <div class="mt-8 flex flex-col gap-4 sm:flex-row">
      <Button
        href="/edit"
        size="lg"
        class="rounded-full px-8 py-6 text-lg shadow-lg transition-all hover:scale-105 hover:shadow-xl">
        Go to Editor
      </Button>
      <Button
        href="https://github.com/mermaid-js/mermaid-live-editor"
        variant="outline"
        size="lg"
        target="_blank"
        class="rounded-full px-8 py-6 text-lg">
        GitHub
      </Button>
    </div>

    <div
      class="mt-16 grid w-full grid-cols-1 gap-8 text-center text-sm text-muted-foreground sm:grid-cols-3">
      <div class="flex flex-col items-center gap-2">
        <div class="rounded-full bg-primary/10 p-3">
          <span class="text-2xl">🚀</span>
        </div>
        <h3 class="font-semibold text-foreground">Fast & Fluid</h3>
        <p>Real-time rendering with instant feedback.</p>
      </div>
      <div class="flex flex-col items-center gap-2">
        <div class="rounded-full bg-primary/10 p-3">
          <span class="text-2xl">🔒</span>
        </div>
        <h3 class="font-semibold text-foreground">Secure</h3>
        <p>Local-first storage. Your data stays yours.</p>
      </div>
      <div class="flex flex-col items-center gap-2">
        <div class="rounded-full bg-primary/10 p-3">
          <span class="text-2xl">🎨</span>
        </div>
        <h3 class="font-semibold text-foreground">Beautiful</h3>
        <p>Stunning themes and export options.</p>
      </div>
    </div>
  </div>

  <footer class="absolute bottom-4 text-xs text-muted-foreground/50">
    © {new Date().getFullYear()} Graphi. Built with Svelte & Mermaid.
  </footer>
</div>
