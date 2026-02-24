<script lang="ts">
  import { base } from '$app/paths';
  import { Button } from '$/components/ui/button';
  import { onMount } from 'svelte';
  import { Share2, Zap, ArrowRight, MousePointer2, Settings, Download, Monitor, Activity, CheckCircle2, Menu, X, Github, Twitter, Linkedin, Sun, Moon } from 'lucide-svelte';
  import { mode, setMode } from 'mode-watcher';

  const title = 'Graphi - Diagramming for everyone';
  const description = 'Create beautiful diagrams with valid Markdown and Mermaid logic. The editor for professionals.';

  let isElectron = false;
  let isMobileMenuOpen = false;

  onMount(() => {
    if (typeof navigator !== 'undefined' && navigator.userAgent.toLowerCase().includes(' electron/')) {
      isElectron = true;
    }
  });

  function toggleMobileMenu() {
    isMobileMenuOpen = !isMobileMenuOpen;
  }
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="description" content={description} />
  <style>
    @keyframes dash {
      to {
        stroke-dashoffset: -8;
      }
    }
  </style>
</svelte:head>

<div class="min-h-screen font-sans selection:bg-indigo-100 selection:text-indigo-900 bg-background text-foreground transition-colors duration-300">
  <!-- Navbar -->
  <nav class="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-border shadow-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16 items-center">
        <!-- Logo -->
        <div class="flex-shrink-0 flex items-center gap-2 cursor-pointer">
          <div class="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center transform rotate-3 hover:rotate-6 transition-transform">
            <Share2 class="text-white w-5 h-5" />
          </div>
          <span class="font-bold text-xl tracking-tight text-gray-900">Graphi</span>
        </div>

        <!-- Desktop Navigation -->
        <div class="hidden md:flex items-center space-x-6">
          <a href="#features" class="text-muted-foreground hover:text-primary font-medium transition-colors">Features</a>
          <a href="#downloads" class="text-muted-foreground hover:text-primary font-medium transition-colors">Downloads</a>
          <div class="h-6 w-px bg-border"></div>
          
          <!-- Theme Toggle -->
          <Button 
            variant="ghost" 
            size="icon" 
            onclick={() => setMode($mode === 'dark' ? 'light' : 'dark')}
            class="text-muted-foreground hover:text-foreground transition-colors"
          >
            {#if $mode === 'dark'}
                <Sun class="w-5 h-5" />
            {:else}
                <Moon class="w-5 h-5" />
            {/if}
          </Button>

          <a href="https://github.com/mermert1/mermert1" target="_blank" class="text-foreground font-medium hover:text-primary transition-colors flex items-center gap-2">
            <Github class="w-4 h-4"/> GitHub
          </a>
          <Button href="{base}/edit/" class="bg-primary text-primary-foreground px-5 py-2.5 rounded-full font-medium hover:opacity-90 transition-all shadow-sm hover:shadow-md h-auto">
            Open Editor
          </Button>
        </div>

        <!-- Mobile Menu Button -->
        <div class="md:hidden flex items-center">
          <button on:click={toggleMobileMenu} class="text-gray-600 hover:text-gray-900 focus:outline-none p-2">
            {#if isMobileMenuOpen}
              <X class="w-6 h-6" />
            {:else}
              <Menu class="w-6 h-6" />
            {/if}
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Menu -->
    {#if isMobileMenuOpen}
      <div class="md:hidden bg-white border-b border-gray-100 absolute w-full shadow-lg">
        <div class="px-4 pt-2 pb-4 space-y-1">
          <a href="#features" on:click={toggleMobileMenu} class="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-md">Features</a>
          <a href="#downloads" on:click={toggleMobileMenu} class="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-md">Downloads</a>
          <div class="border-t border-gray-100 my-2 pt-2">
            <a href="https://github.com/mermert1/mermert1" target="_blank" class="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-md flex items-center gap-2">
               <Github class="w-4 h-4"/> GitHub
            </a>
            <Button href="{base}/edit/" class="w-full mt-2 bg-indigo-600 text-white px-3 py-2 text-base font-medium text-center rounded-md hover:bg-indigo-700 h-auto">
              Open Editor
            </Button>
          </div>
        </div>
      </div>
    {/if}
  </nav>

  <main>
    <!-- Hero Section -->
    <section class="relative overflow-hidden bg-background pt-16 pb-32">
      <div class="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] opacity-10 pointer-events-none">
        <div class="absolute inset-0 bg-[linear-gradient(to_right,theme(colors.muted.foreground/0.1)_1px,transparent_1px),linear-gradient(to_bottom,theme(colors.muted.foreground/0.1)_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      </div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-sm font-medium mb-8">
          <Zap class="w-4 h-4" />
          <span>Graphi brings code-to-diagrams alive.</span>
        </div>

        <h1 class="text-5xl md:text-7xl font-extrabold text-foreground tracking-tight mb-6 leading-tight">
          Diagrams for <span class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">everyone.</span><br />
          Simple, fast, code-driven.
        </h1>

        <p class="mt-4 max-w-2xl mx-auto text-xl text-muted-foreground mb-10">
          The intuitive diagramming tool built on Mermaid.js. Create Flowcharts, Architecture diagrams, and Mindmaps instantly – directly in your browser.
        </p>

        <div class="flex flex-col sm:flex-row justify-center gap-4 mb-16">
          <a href="{base}/edit/" class="bg-indigo-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-indigo-700 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 flex items-center justify-center gap-2">
            Open Web Editor
            <ArrowRight class="w-5 h-5" />
          </a>
          <a href="#downloads" class="bg-background text-foreground border border-border px-8 py-4 rounded-full font-semibold text-lg hover:bg-muted transition-all flex items-center justify-center gap-2">
            Download Desktop App
          </a>
        </div>

        <!-- Hero Mockup Canvas -->
        <div class="relative mx-auto max-w-5xl animate-in slide-in-from-bottom-5 duration-700">
          <div class="rounded-2xl border border-gray-200 bg-white/50 backdrop-blur-sm shadow-2xl overflow-hidden">
            <div class="h-12 border-b border-gray-200 bg-gray-50/80 flex items-center px-4 gap-4">
              <div class="flex gap-1.5">
                <div class="w-3 h-3 rounded-full bg-red-400"></div>
                <div class="w-3 h-3 rounded-full bg-amber-400"></div>
                <div class="w-3 h-3 rounded-full bg-green-400"></div>
              </div>
              <div class="flex-1 flex justify-center">
                <div class="bg-white px-3 py-1 rounded-md border border-gray-200 text-xs text-gray-500 font-medium flex items-center gap-2">
                  <span>architecture.mermaid</span>
                </div>
              </div>
              <div class="flex -space-x-2">
                  <div class="w-8 h-8 rounded-full bg-indigo-100 border-2 border-white flex items-center justify-center text-xs font-bold text-indigo-600">G</div>
              </div>
            </div>

            <!-- Display Diagram Logic -->
            <div class="h-[400px] md:h-[500px] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] relative overflow-hidden flex items-center justify-center">
                <!-- Visual Mockup similar to the template, but simplified for Svelte -->
                <div class="absolute top-1/4 left-1/4 transform -translate-x-1/2 -translate-y-1/2 bg-white border-2 border-indigo-400 rounded-lg p-4 shadow-sm w-48 z-10 text-left">
                  <div class="text-sm font-bold text-gray-800 mb-1">Graphi Client</div>
                  <div class="text-xs text-gray-500">SvelteKit Frontend</div>
                </div>

                <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-indigo-600 text-white border-2 border-indigo-700 rounded-lg p-4 shadow-md w-56 z-10 text-left">
                  <div class="text-sm font-bold mb-1 flex items-center gap-2">
                    <Zap class="w-4 h-4 text-amber-300" /> Mermaid.js
                  </div>
                  <div class="text-xs text-indigo-100">Local Markdown Renderer</div>
                </div>

                <div class="absolute top-3/4 left-3/4 transform -translate-x-1/2 -translate-y-1/2 bg-white border-2 border-emerald-400 rounded-lg p-4 shadow-sm w-48 z-10 text-left">
                  <div class="text-sm font-bold text-gray-800 mb-1">Local Storage</div>
                  <div class="text-xs text-gray-500">File System Access API</div>
                </div>

                <svg class="absolute inset-0 w-full h-full pointer-events-none" style="z-index: 0;">
                  <!-- Top left to Center -->
                  <path d="M 25% 25% C 35% 25%, 35% 50%, 50% 50%" fill="none" stroke="#9ca3af" stroke-width="2" stroke-dasharray="4 4" class="animate-[dash_2s_linear_infinite]" />
                  <circle cx="50%" cy="50%" r="4" fill="#4f46e5" />
                  <!-- Center to Bottom Right -->
                  <path d="M 50% 50% C 65% 50%, 65% 75%, 75% 75%" fill="none" stroke="#9ca3af" stroke-width="2" />
                  <polygon points="75%,75% 73%,71% 77%,71%" fill="#9ca3af" transform="translate(-10, 0) rotate(45, 75%, 75%)" />
                </svg>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Actual Features Section -->
    <section id="features" class="py-24 bg-muted/30 border-t border-border">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center max-w-3xl mx-auto mb-16">
          <h2 class="text-indigo-600 dark:text-indigo-400 font-semibold tracking-wide uppercase text-sm mb-3">Why Graphi?</h2>
          <h3 class="text-3xl md:text-4xl font-bold text-foreground mb-4">Everything you need, driven by code</h3>
          <p class="text-lg text-muted-foreground">Graphi brings the power of Mermaid.js into a modern, lightning-fast editor interface. Say goodbye to drag-and-drop fatigue.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div class="bg-card p-8 rounded-2xl shadow-sm border border-border hover:shadow-md transition-shadow">
            <div class="w-12 h-12 bg-indigo-50 dark:bg-indigo-950/30 rounded-xl flex items-center justify-center mb-6">
              <Activity class="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h4 class="text-xl font-bold text-foreground mb-3">Live Preview Rendering</h4>
            <p class="text-muted-foreground leading-relaxed">Type your diagram logic in the Monaco editor and watch it render instantly in the preview panel.</p>
          </div>
          
          <div class="bg-card p-8 rounded-2xl shadow-sm border border-border hover:shadow-md transition-shadow">
            <div class="w-12 h-12 bg-indigo-50 dark:bg-indigo-950/30 rounded-xl flex items-center justify-center mb-6">
              <Download class="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h4 class="text-xl font-bold text-foreground mb-3">Seamless Exports</h4>
            <p class="text-muted-foreground leading-relaxed">Export your rendered diagrams cleanly to SVG or PNG to include them easily in your documentation.</p>
          </div>
          
          <div class="bg-card p-8 rounded-2xl shadow-sm border border-border hover:shadow-md transition-shadow">
            <div class="w-12 h-12 bg-indigo-50 dark:bg-indigo-950/30 rounded-xl flex items-center justify-center mb-6">
              <Settings class="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h4 class="text-xl font-bold text-foreground mb-3">Advanced Configuration</h4>
            <p class="text-muted-foreground leading-relaxed">Dive into the JSON configuration pane to precisely control Mermaid themes, layouts, and strictness.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Desktop Downloads Section -->
    {#if !isElectron}
      <section id="downloads" class="py-24 bg-background border-t border-border">
        <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-12">
            <h2 class="text-3xl font-bold text-foreground mb-4">Get Graphi for Desktop</h2>
            <p class="text-lg text-muted-foreground max-w-2xl mx-auto">Working offline? Download the desktop app to use Graphi without an internet connection, directly on your machine.</p>
            </div>

            <div class="bg-indigo-600 rounded-3xl p-10 text-center text-white relative overflow-hidden shadow-2xl">
            <div class="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
            <div class="absolute bottom-0 left-0 w-48 h-48 bg-black opacity-10 rounded-full blur-2xl transform -translate-x-1/2 translate-y-1/2"></div>

            <div class="relative z-10 flex flex-col md:flex-row justify-center gap-6">
                <!-- Windows -->
                <a href="https://github.com/mermert1/mermert1/releases/latest/download/Graphi-Desktop-Win-Installer.exe" target="_blank"
                class="flex-1 bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-sm p-6 rounded-2xl transition-all flex flex-col items-center gap-4 group">
                    <Monitor class="w-10 h-10 text-indigo-200 group-hover:text-white transition-colors" />
                    <div>
                    <h4 class="font-bold text-xl mb-1">Windows</h4>
                    <p class="text-indigo-200 text-sm">Download .exe Setup</p>
                    </div>
                </a>

                <!-- macOS -->
                <a href="https://github.com/mermert1/mermert1/releases/latest/download/Graphi-Desktop-macOS.dmg" target="_blank"
                class="flex-1 bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-sm p-6 rounded-2xl transition-all flex flex-col items-center gap-4 group">
                    <svg class="w-10 h-10 text-indigo-200 group-hover:text-white transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a10 10 0 1 0 10 10H12V2z" /></svg>
                    <div>
                    <h4 class="font-bold text-xl mb-1">macOS</h4>
                    <p class="text-indigo-200 text-sm">Download .dmg</p>
                    </div>
                </a>

                <!-- Linux -->
                <a href="https://github.com/mermert1/mermert1/releases/latest/download/Graphi-Desktop-Linux.AppImage" target="_blank"
                class="flex-1 bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-sm p-6 rounded-2xl transition-all flex flex-col items-center gap-4 group">
                    <svg class="w-10 h-10 text-indigo-200 group-hover:text-white transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg>
                    <div>
                    <h4 class="font-bold text-xl mb-1">Linux</h4>
                    <p class="text-indigo-200 text-sm">Download .AppImage</p>
                    </div>
                </a>
            </div>
            </div>
        </div>
      </section>
    {/if}

    <section class="py-20 bg-muted/30 border-t border-border">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-3xl md:text-5xl font-bold text-foreground mb-6">Ready to visualize your ideas?</h2>
        <p class="text-xl text-muted-foreground mb-10">Jump straight into the editor. No account required.</p>
        <div class="flex flex-col sm:flex-row justify-center items-center gap-4">
          <a href="{base}/edit/" class="w-full sm:w-auto bg-indigo-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-indigo-700 transition-colors shadow-md">
            Open Editor Now
          </a>
        </div>
        <div class="mt-8 flex items-center justify-center gap-2 text-sm text-gray-500">
          <CheckCircle2 class="w-4 h-4 text-emerald-500" /> Free and open-source forever.
        </div>
      </div>
    </section>
  </main>

  <!-- Footer -->
  <footer class="bg-background border-t border-border pt-16 pb-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex flex-col md:flex-row items-center justify-between gap-6 mb-8 text-center md:text-left">
         <div class="flex items-center gap-2">
            <div class="w-6 h-6 bg-indigo-600 rounded flex items-center justify-center transform rotate-3">
              <Share2 class="text-white w-3 h-3" />
            </div>
            <span class="font-bold text-xl text-foreground">Graphi</span>
          </div>
          
          <div class="flex gap-4">
            <a href="https://github.com/mermert1/mermert1" target="_blank" class="text-muted-foreground hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-2 transition-colors">
              <Github class="w-5 h-5" /> Code on GitHub
            </a>
          </div>
      </div>

      <div class="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <p class="text-gray-400 text-sm">
          © {new Date().getFullYear()} Graphi. Built with SvelteKit & Mermaid.js.
        </p>
      </div>
    </div>
  </footer>
</div>
