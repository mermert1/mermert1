<script lang="ts">
  import { base } from '$app/paths';
  import { Button } from '$/components/ui/button';
  import { onMount } from 'svelte';

  // Simple SEO
  const title = 'Graphi - Diagramming for everyone';
  const description =
    'Create beautiful diagrams with valid Markdown and Mermaid logic. The editor for professionals.';

  let isElectron = false;

  onMount(() => {
    // Check if running in Electron
    if (
      typeof navigator !== 'undefined' &&
      navigator.userAgent.toLowerCase().includes(' electron/')
    ) {
      isElectron = true;
    }
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
        href="{base}/edit/"
        size="lg"
        class="rounded-full px-8 py-6 text-lg shadow-lg transition-all hover:scale-105 hover:shadow-xl">
        Go to Editor
      </Button>
    </div>

    {#if !isElectron}
      <!-- Desktop Download Section -->
      <div
        class="mt-12 flex animate-in flex-col items-center gap-6 delay-150 duration-700 slide-in-from-bottom-5 fade-in">
        <div class="relative">
          <h2 class="text-2xl font-bold tracking-tight">Get Graphi for Desktop</h2>
          <div
            class="absolute -inset-1 -z-10 rounded-lg bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 opacity-50 blur-xl">
          </div>
        </div>

        <div class="flex flex-wrap justify-center gap-4">
          <!-- Windows Download -->
          <Button
            href="https://github.com/mermert1/mermert1/releases/latest/download/Graphi-Desktop-Windows.zip"
            target="_blank"
            variant="secondary"
            size="lg"
            class="flex min-w-[200px] items-center gap-2 border-2 border-primary/20 bg-background/50 backdrop-blur transition-all hover:border-primary/50 hover:bg-primary/10">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
            <div class="flex flex-col items-start leading-none">
              <span class="font-bold">Windows</span>
              <span class="text-xs font-normal text-muted-foreground">Download .zip</span>
            </div>
          </Button>

          <!-- macOS Download -->
          <Button
            href="https://github.com/mermert1/mermert1/releases/latest/download/Graphi-Desktop-macOS.zip"
            target="_blank"
            variant="secondary"
            class="flex min-w-[200px] items-center gap-2 border-2 border-primary/20 bg-background/50 backdrop-blur transition-all hover:border-primary/50 hover:bg-primary/10">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"><path d="M12 2a10 10 0 1 0 10 10H12V2z" /></svg>
            <div class="flex flex-col items-start leading-none">
              <span class="font-bold">macOS</span>
              <span class="text-xs font-normal text-muted-foreground">Download .zip</span>
            </div>
          </Button>

          <!-- Linux Download -->
          <Button
            href="https://github.com/mermert1/mermert1/releases/latest/download/Graphi-Desktop-Linux.zip"
            target="_blank"
            variant="secondary"
            class="flex min-w-[200px] items-center gap-2 border-2 border-primary/20 bg-background/50 backdrop-blur transition-all hover:border-primary/50 hover:bg-primary/10">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              ><rect x="2" y="3" width="20" height="14" rx="2" ry="2" /><line
                x1="8"
                y1="21"
                x2="16"
                y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg>
            <div class="flex flex-col items-start leading-none">
              <span class="font-bold">Linux</span>
              <span class="text-xs font-normal text-muted-foreground">Download .zip</span>
            </div>
          </Button>
        </div>
        <p class="w-full max-w-sm text-sm text-muted-foreground">
          Working offline? Download the desktop app to use Graphi without an internet connection.
        </p>
      </div>
    {/if}

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
