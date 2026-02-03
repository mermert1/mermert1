<script lang="ts">
  import { stateStore, updateCode } from '$/util/state';
  import { Button } from '$/components/ui/button';
  import { Input } from '$/components/ui/input';
  import View from '$/components/View.svelte';
  import { PanZoomState } from '$/util/panZoom';

  const panZoomState = new PanZoomState();
  
  let selectedElement = $state<{ id: string; type: 'node' | 'edge'; label: string } | null>(null);

  function handleSvgClick(event: MouseEvent) {
    const target = event.target as SVGElement;
    // Walk up the DOM to find a node or edge
    let current: SVGElement | null = target;
    while (current && current.tagName !== 'svg') {
      if (current.classList.contains('node') || current.classList.contains('edge')) {
        const id = current.id || 'unknown';
        const labelElement = current.querySelector('.label') || current.querySelector('text');
        const label = labelElement?.textContent?.trim() || '';
        
        selectedElement = {
          id,
          type: current.classList.contains('node') ? 'node' : 'edge',
          label
        };
        return;
      }
      current = current.parentElement as SVGElement | null;
    }
    selectedElement = null;
  }

  function updateLabel(newLabel: string) {
    if (!selectedElement) return;
    
    // Simplistic label update - in a real app, we'd need a robust Mermaid parser/patcher
    // For now, we'll try a regex replacement of the label in the code
    const oldCode = $stateStore.code;
    const escapedLabel = selectedElement.label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    
    // This is VERY naive and just for demonstration. 
    // A production version requires a proper AST manipulation.
    const newCode = oldCode.replace(new RegExp(escapedLabel, 'g'), newLabel);
    
    updateCode(newCode);
    selectedElement.label = newLabel;
  }
</script>

<div class="flex h-full overflow-hidden">
  <!-- Visual Preview Area -->
  <div class="relative flex-1 bg-muted/20" onclick={handleSvgClick} role="presentation">
    <View {panZoomState} shouldShowGrid={$stateStore.grid} />
    {#if !selectedElement}
      <div class="pointer-events-none absolute inset-0 flex items-center justify-center bg-background/10">
        <p class="rounded-full bg-background/80 px-4 py-2 text-sm font-medium shadow-sm backdrop-blur-sm">
          Click on any element to edit
        </p>
      </div>
    {/if}
  </div>

  <!-- Properties Panel -->
  <aside class="w-80 border-l bg-background p-6 shadow-xl">
    <div class="flex h-full flex-col gap-6">
      <div class="flex items-center justify-between">
        <h2 class="text-xl font-bold">Properties</h2>
        {#if selectedElement}
          <Button variant="ghost" size="sm" onclick={() => selectedElement = null}>Clear</Button>
        {/if}
      </div>

      {#if selectedElement}
        <div class="rounded-xl border border-border bg-card p-4 shadow-sm">
          <div class="mb-4">
            <h3 class="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {selectedElement.type}: {selectedElement.id}
            </h3>
          </div>
          
          <div class="flex flex-col gap-4">
            <div class="grid w-full items-center gap-1.5">
              <label for="label-edit" class="text-sm font-medium leading-none">Label Text</label>
              <Input 
                id="label-edit" 
                bind:value={selectedElement.label} 
                oninput={(e) => updateLabel((e.target as HTMLInputElement).value)}
              />
            </div>
            
            <div class="grid w-full items-center gap-1.5">
              <span class="text-sm font-medium leading-none">Styles (Coming Soon)</span>
              <div class="flex gap-2">
                 <div class="size-6 rounded-full border border-border bg-[#ff0000] cursor-not-allowed"></div>
                 <div class="size-6 rounded-full border border-border bg-[#00ff00] cursor-not-allowed"></div>
                 <div class="size-6 rounded-full border border-border bg-[#0000ff] cursor-not-allowed"></div>
              </div>
            </div>
          </div>
        </div>
      {:else}
        <div class="flex flex-1 flex-col items-center justify-center text-center text-muted-foreground">
           <p class="text-sm">Select an element in the diagram to modify its properties.</p>
        </div>
      {/if}

      <div class="mt-auto rounded-lg bg-accent/10 p-4 text-xs">
        <p class="font-bold text-accent">Interactive Mode</p>
        <p class="mt-1 leading-relaxed opacity-70">
          This mode allows you to visually tweak your Mermaid charts. 
          Changes are reflected in the underlying code automatically.
        </p>
      </div>
    </div>
  </aside>
</div>
