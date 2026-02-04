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

<div
  class="flex h-6 w-full items-center justify-between border-t bg-primary px-2 text-xs text-primary-foreground select-none">
  <div class="flex items-center gap-2">
    <div class="flex cursor-pointer items-center gap-1 px-1 hover:bg-primary/90">
      <Toggle
        bind:pressed={$inputStateStore.rough}
        size="sm"
        title="Hand-Drawn"
        class="h-5 w-5 p-0 hover:bg-primary-foreground/20 hover:text-primary-foreground data-[state=on]:bg-primary-foreground data-[state=on]:text-primary">
        <RoughIcon class="size-3" />
      </Toggle>
    </div>
    <div class="flex cursor-pointer items-center gap-1 px-1 hover:bg-primary/90">
      <Toggle
        bind:pressed={$inputStateStore.grid}
        size="sm"
        title="Background Grid"
        class="h-5 w-5 p-0 hover:bg-primary-foreground/20 hover:text-primary-foreground data-[state=on]:bg-primary-foreground data-[state=on]:text-primary">
        <BackgroundIcon class="size-3" />
      </Toggle>
    </div>
  </div>

  <div class="flex items-center gap-2">
    <Button
      variant="ghost"
      size="icon"
      class="h-5 w-5 hover:bg-primary-foreground/20 hover:text-primary-foreground"
      title="Privacy & Security">
      <Privacy />
    </Button>

    <Button
      variant="ghost"
      size="icon"
      data-testid={TID.themeToggleButton}
      title="Switch to {$mode === 'dark' ? 'light' : 'dark'} theme"
      class="h-5 w-5 hover:bg-primary-foreground/20 hover:text-primary-foreground"
      onclick={() => setMode($mode === 'dark' ? 'light' : 'dark')}>
      <ThemeIcon />
    </Button>

    <div
      class="flex h-full cursor-pointer items-center gap-1 px-2 hover:bg-primary-foreground/20"
      title="Mermaid Version">
      <span class="opacity-80">v{version}</span>
    </div>
  </div>
</div>
