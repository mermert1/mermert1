<script lang="ts" module>
  import { version } from 'mermaid/package.json';
</script>

<script lang="ts">
  import Privacy from '$/components/Privacy.svelte';
  import ThemeIcon from '$/components/ThemeIcon.svelte';
  import { Button } from '$/components/ui/button';
  import { Toggle } from '$/components/ui/toggle';
  import { TID } from '$/constants';
  import { defaultState, inputStateStore } from '$/util/state';
  import { mode, setMode } from 'mode-watcher';
  import RoughIcon from '~icons/material-symbols/draw';
  import BackgroundIcon from '~icons/material-symbols/grid-4x4';

  if ($inputStateStore.grid === undefined) {
    // Handle cases where old states were saved without grid option
    $inputStateStore.grid = defaultState.grid;
  }
</script>

<footer
  class="flex h-8 w-full shrink-0 items-center justify-between border-t border-primary/20 bg-primary px-4 text-[10px] font-bold uppercase tracking-wider text-primary-foreground select-none z-50 transition-colors">
  
  <div class="flex items-center gap-4">
    <label class="flex cursor-pointer items-center gap-1.5 hover:text-white/80 transition-opacity">
      <Toggle
        bind:pressed={$inputStateStore.rough}
        size="sm"
        title="Hand-Drawn"
        class="h-5 w-5 p-0 hover:bg-primary-foreground/20 hover:text-primary-foreground data-[state=on]:bg-primary-foreground data-[state=on]:text-primary rounded-sm">
        <RoughIcon class="size-3.5" />
      </Toggle>
      Hand-Drawn
    </label>
    
    <label class="flex cursor-pointer items-center gap-1.5 hover:text-white/80 transition-opacity">
      <Toggle
        bind:pressed={$inputStateStore.grid}
        size="sm"
        title="Background Grid"
        class="h-5 w-5 p-0 hover:bg-primary-foreground/20 hover:text-primary-foreground data-[state=on]:bg-primary-foreground data-[state=on]:text-primary rounded-sm">
        <BackgroundIcon class="size-3.5" />
      </Toggle>
      Grid
    </label>

    <div class="h-3 w-[1px] bg-white/30"></div>

    <div class="flex items-center gap-1.5 opacity-90 transition-all">
      <div class="size-1.5 rounded-full bg-green-400 animate-pulse"></div>
      Auto-Sync Active
    </div>
  </div>

  <div class="hidden sm:block absolute left-1/2 -translate-x-1/2 opacity-90 font-medium">
    Graphi Live Editor <span class="opacity-50 mx-1">•</span> Developed by Batu Atakan Erol
  </div>

  <div class="flex items-center gap-4">
    <div class="flex items-center gap-1 hover:text-white/80 transition-colors cursor-pointer" title="Privacy & Security">
      <Privacy />
      <span class="hidden md:inline">Privacy</span>
    </div>
    
    <div class="h-3 w-[1px] bg-white/30 hidden md:block"></div>

    <button
      class="flex items-center gap-1.5 hover:text-white/80 transition-colors cursor-pointer outline-none"
      data-testid={TID.themeToggleButton}
      title="Switch to {$mode === 'dark' ? 'light' : 'dark'} theme"
      onclick={() => setMode($mode === 'dark' ? 'light' : 'dark')}>
      <ThemeIcon />
      <span class="hidden sm:inline">{$mode === 'dark' ? 'Dark' : 'Light'} Mode</span>
    </button>

    <div class="h-3 w-[1px] bg-white/30"></div>
    
    <div
      class="flex h-full items-center font-mono opacity-80"
      title="Mermaid Version">
      v{version}
    </div>
  </div>
</footer>
