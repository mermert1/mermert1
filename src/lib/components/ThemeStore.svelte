<script lang="ts">
  import {
    builtInThemes,
    customThemes,
    activeThemeId,
    setActiveTheme,
    addCustomTheme,
    removeCustomTheme,
    applyThemeToConfig
  } from '$/util/themeStore';
  import { stateStore, updateCodeStore } from '$/util/state';
  import type { DiagramTheme } from '$/util/themeStore';
  import { Button } from '$/components/ui/button';
  import { toast } from 'svelte-sonner';
  import TrashIcon from '~icons/material-symbols/delete-outline';
  import CheckIcon from '~icons/material-symbols/check';
  import PaletteIcon from '~icons/material-symbols/palette';
  import HelpIcon from '~icons/material-symbols/info-outline';
  import ResetIcon from '~icons/material-symbols/restart-alt';
  import * as Popover from '$/components/ui/popover';
  import { mode } from 'mode-watcher';

  const themes = $derived([...builtInThemes, ...$customThemes]);
  let showAddForm = $state(false);
  let activeCategory = $state<'light' | 'dark' | 'custom'>('light');

  // New theme form
  let newName = $state('');
  let newDescription = $state('');
  let newPrimaryColor = $state('#6366f1');
  let newBgColor = $state('#ffffff');
  let newLineColor = $state('#333333');

  function selectTheme(id: string) {
    setActiveTheme(id);
    const theme = themes.find((t) => t.id === id);
    if (theme) {
      const currentConfig = $stateStore.mermaid;
      const newConfig = applyThemeToConfig(currentConfig, theme);
      updateCodeStore({ mermaid: newConfig });
    }
  }

  function deleteTheme(id: string) {
    if (confirm('Delete this theme?')) {
        removeCustomTheme(id);
        toast.info('Theme removed');
    }
  }

  function handleAddTheme() {
    if (!newName.trim()) return;

    addCustomTheme({
      name: newName,
      description: newDescription || 'Custom theme',
      type: 'light', // Default, maybe add toggle later
      mermaidThemeVariables: {
        theme: 'base',
        primaryColor: newPrimaryColor,
        primaryTextColor: '#ffffff',
        primaryBorderColor: newPrimaryColor,
        lineColor: newLineColor,
        secondaryColor: newBgColor,
        tertiaryColor: newBgColor
      }
    });

    toast.success(`Theme "${newName}" created!`);
    newName = '';
    newDescription = '';
    showAddForm = false;
    activeCategory = 'custom';
  }

  function resetTheme() {
    const isDark = $mode === 'dark';
    const targetId = isDark ? 'dark' : 'default';
    
    setActiveTheme(targetId);
    updateCodeStore({ 
      mermaid: JSON.stringify({ theme: isDark ? 'dark' : 'default' }, null, 2) 
    });
    
    toast.success('Theme reset to default');
  }
  
  // Helpers for extracting colors for the preview
  function getColors(theme: DiagramTheme) {
      const vars = theme.mermaidThemeVariables || {};
      return {
          primary: vars.primaryColor || '#666',
          text: vars.primaryTextColor || (theme.type === 'dark' ? '#fff' : '#333'),
          line: vars.lineColor || '#999',
          bg: vars.secondaryColor || (theme.type === 'dark' ? '#1f2937' : '#fff')
      };
  }

  // Filter themes based on tab
  const filteredThemes = $derived(
      themes.filter(t => {
          if (activeCategory === 'custom') return !t.isBuiltIn;
          return t.isBuiltIn && t.type === activeCategory;
      })
  );
</script>

<div class="flex flex-col h-full bg-background/50">
  <div class="flex items-center justify-between p-4 border-b">
    <div class="flex items-center gap-2 font-bold tracking-tight">
        <PaletteIcon class="text-primary" />
        Themes
    </div>
    <div class="flex items-center gap-1">
      <Button size="sm" variant="ghost" onclick={resetTheme} title="Reset to default">
        <ResetIcon class="size-4 mr-1" /> Reset
      </Button>
      <Button size="sm" variant="ghost" onclick={() => (showAddForm = !showAddForm)}>
        {showAddForm ? 'Cancel' : '+ Create'}
      </Button>
    </div>
  </div>

  {#if showAddForm}
    <div class="p-4 bg-muted/30 border-b space-y-3 animate-in slide-in-from-top-2">
      <div class="flex items-center justify-between">
        <h4 class="text-xs font-bold uppercase tracking-wider text-muted-foreground">New Theme</h4>
        <Popover.Root>
          <Popover.Trigger>
            <Button variant="ghost" size="icon" class="size-5">
              <HelpIcon class="size-3.5" />
            </Button>
          </Popover.Trigger>
          <Popover.Content class="w-64 p-3 text-xs space-y-2">
            <p><strong>Primary:</strong> Applies to the main elements (nodes, actors, etc.)</p>
            <p><strong>Background:</strong> Changes the background color of notes and secondary elements.</p>
            <p><strong>Lines:</strong> Colors the arrows, links, and borders of the diagram.</p>
          </Popover.Content>
        </Popover.Root>
      </div>
      <input
        class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        type="text"
        placeholder="Theme Name"
        bind:value={newName}
      />
      <div class="flex gap-4 justify-between">
        <label class="flex flex-col gap-1 items-center text-xs">
          <span>Primary</span>
          <input type="color" bind:value={newPrimaryColor} class="h-6 w-12 cursor-pointer rounded border-none p-0" />
        </label>
        <label class="flex flex-col gap-1 items-center text-xs">
          <span>Background</span>
          <input type="color" bind:value={newBgColor} class="h-6 w-12 cursor-pointer rounded border-none p-0" />
        </label>
        <label class="flex flex-col gap-1 items-center text-xs">
          <span>Lines</span>
          <input type="color" bind:value={newLineColor} class="h-6 w-12 cursor-pointer rounded border-none p-0" />
        </label>
      </div>
      <Button size="sm" onclick={handleAddTheme} disabled={!newName.trim()} class="w-full">
        Save Theme
      </Button>
    </div>
  {/if}

  <!-- Tabs -->
  <div class="px-4 pt-4 pb-2">
    <div class="flex space-x-1 rounded-lg bg-muted p-1">
        <button 
            class="flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-all {activeCategory === 'light' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:bg-background/50'}"
            onclick={() => activeCategory = 'light'}
        >
            Light
        </button>
        <button 
            class="flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-all {activeCategory === 'dark' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:bg-background/50'}"
            onclick={() => activeCategory = 'dark'}
        >
            Dark
        </button>
        <button 
            class="flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-all {activeCategory === 'custom' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:bg-background/50'}"
            onclick={() => activeCategory = 'custom'}
        >
            My Themes
        </button>
    </div>
  </div>

  <div class="grid grid-cols-1 gap-3 p-4 flex-1 overflow-y-auto content-start">
    {#each filteredThemes as theme (theme.id)}
      {@const colors = getColors(theme)}
      <button
        class="group relative flex items-center gap-3 overflow-hidden rounded-xl border bg-card p-3 text-card-foreground shadow-sm transition-all hover:shadow-md hover:border-primary/50 text-left"
        class:ring-2={$activeThemeId === theme.id}
        class:ring-primary={$activeThemeId === theme.id}
        onclick={() => selectTheme(theme.id)}
      >
        <!-- Swatch Preview -->
        <div 
            class="h-12 w-12 shrink-0 rounded-lg shadow-inner border relative overflow-hidden"
            style:background={colors.bg}
        >
            <!-- Abstract Mini Diagram -->
            <div class="absolute top-2 left-2 w-3 h-3 rounded-full" style:background={colors.primary}></div>
            <div class="absolute bottom-2 right-2 w-8 h-1" style:background={colors.line}></div>
            <div class="absolute top-2 right-2 text-[10px] font-bold" style:color={colors.text}>Aa</div>
        </div>

        <div class="flex-1 min-w-0">
            <div class="flex items-center justify-between">
                <span class="font-semibold text-sm truncate">{theme.name}</span>
                {#if $activeThemeId === theme.id}
                    <CheckIcon class="size-4 text-primary" />
                {/if}
            </div>
            
            <span class="text-xs text-muted-foreground line-clamp-1">{theme.description}</span>
            
            <!-- Color Palette Dots -->
            <div class="flex items-center gap-1.5 mt-2">
                <div class="flex flex-col items-center gap-0.5" title="Primary Color">
                    <div class="w-3 h-3 rounded-full border shadow-sm" style:background={colors.primary}></div>
                </div>
                 <div class="flex flex-col items-center gap-0.5" title="Text Color">
                    <div class="w-3 h-3 rounded-full border shadow-sm" style:background={colors.text}></div>
                </div>
                 <div class="flex flex-col items-center gap-0.5" title="Line Color">
                    <div class="w-3 h-3 rounded-full border shadow-sm" style:background={colors.line}></div>
                </div>
            </div>
        </div>

        {#if !theme.isBuiltIn}
          <button
            class="absolute top-2 right-2 p-1.5 rounded-full hover:bg-destructive/10 hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
            onclick={(e) => {
              e.stopPropagation();
              deleteTheme(theme.id);
            }}
            title="Delete theme"
          >
            <TrashIcon class="size-4" />
          </button>
        {/if}
      </button>
    {/each}
    
    {#if filteredThemes.length === 0}
        <div class="text-center py-8 text-muted-foreground text-sm">
            No themes found in this category.
        </div>
    {/if}
  </div>
</div>
