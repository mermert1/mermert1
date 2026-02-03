<script lang="ts">
  import { stateStore, updateCode } from '$/util/state';
  import { Button } from '$/components/ui/button';
  import { Input } from '$/components/ui/input';
  import * as Card from '$/components/ui/card';
  import * as Resizable from '$/components/ui/resizable';
  import Editor from '$/components/Editor.svelte';
  import View from '$/components/View.svelte';
  import { PanZoomState } from '$/util/panZoom';

  const panZoomState = new PanZoomState();
  
  let selectedElement = $state<{ id: string; type: 'node' | 'edge' | 'label'; label: string } | null>(null);

  function handleSvgClick(event: MouseEvent) {
    const target = event.target as SVGElement;
    // Walk up the DOM to find a node, edge or label
    let current: SVGElement | null = target;
    while (current && current.tagName !== 'svg') {
      const classList = current.classList;
      if (classList.contains('node') || classList.contains('edge') || classList.contains('edgeLabel') || classList.contains('label-container')) {
        let type: 'node' | 'edge' | 'label' = 'node';
        if (classList.contains('edge')) type = 'edge';
        if (classList.contains('edgeLabel') || classList.contains('label-container')) type = 'label';

        const id = current.id || (type === 'label' ? 'edge-label' : 'unknown');
        const labelElement = current.querySelector('.label') || current.querySelector('text') || current;
        const label = labelElement?.textContent?.trim() || '';
        
        selectedElement = { id, type, label };
        return;
      }
      current = current.parentElement as SVGElement | null;
    }
    // Fallback for direct text children in some diagram types
    if (target.tagName === 'text' || target.parentElement?.classList.contains('label')) {
         selectedElement = { 
            id: 'text-element', 
            type: 'label', 
            label: target.textContent?.trim() || '' 
         };
         return;
    }
    selectedElement = null;
  }

  function updateLabel(newLabel: string) {
    if (!selectedElement) return;
    const oldCode = $stateStore.code;
    const escapedLabel = selectedElement.label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const newCode = oldCode.replace(new RegExp(escapedLabel, 'g'), newLabel);
    updateCode(newCode);
    selectedElement.label = newLabel;
  }

  function applyStyle(color: string) {
    if (!selectedElement || selectedElement.type !== 'node') return;
    const nodeName = selectedElement.id;
    const oldCode = $stateStore.code;
    
    // Check if style already exists for this node
    const styleRegex = new RegExp(`style ${nodeName} [^\\n]+`, 'g');
    let newCode: string;
    if (styleRegex.test(oldCode)) {
        newCode = oldCode.replace(styleRegex, `style ${nodeName} fill:${color}`);
    } else {
        newCode = oldCode + `\nstyle ${nodeName} fill:${color}`;
    }
    updateCode(newCode);
  }
</script>

<div class="flex h-full overflow-hidden">
  <Resizable.PaneGroup direction="horizontal">
    <!-- Column 1: Code Editor -->
    <Resizable.Pane defaultSize={25} minSize={15}>
      <div class="h-full border-r bg-background">
        <Editor isMobile={false} />
      </div>
    </Resizable.Pane>

    <Resizable.Handle />

    <!-- Column 2: Visual Preview -->
    <Resizable.Pane defaultSize={50} minSize={20}>
      <div class="relative flex h-full flex-col bg-muted/10" onclick={handleSvgClick} role="presentation">
        <div class="flex-1 overflow-hidden">
          <View {panZoomState} shouldShowGrid={$stateStore.grid} />
        </div>
      </div>
    </Resizable.Pane>

    <Resizable.Handle />

    <!-- Column 3: Properties Panel -->
    <Resizable.Pane defaultSize={25} minSize={15}>
      <aside class="h-full border-l bg-background p-6">
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
                
                {#if selectedElement.type === 'node'}
                  <div class="grid w-full items-center gap-1.5">
                    <span class="text-sm font-medium leading-none">Node Color</span>
                    <div class="flex flex-wrap gap-2 pt-1">
                       {#each ['#f9f9f9', '#ff9999', '#99ff99', '#9999ff', '#ffff99', '#ff99ff'] as color}
                         <button 
                           class="size-6 rounded-md border border-border shadow-sm transition-transform hover:scale-110" 
                           style="background-color: {color}"
                           onclick={() => applyStyle(color)}
                           title={color}
                         ></button>
                       {/each}
                    </div>
                  </div>
                {/if}
              </div>
            </div>
          {:else}
            <div class="flex flex-1 flex-col items-center justify-center text-center text-muted-foreground">
               <p class="text-sm">Select an element in the diagram to modify its properties.</p>
            </div>
          {/if}

          <div class="mt-auto rounded-lg bg-accent/5 p-4 text-xs">
            <p class="font-bold text-accent">Interactive Tips</p>
            <ul class="mt-2 flex flex-col gap-1 list-disc pl-4 opacity-70">
              <li>Click nodes to change text/color</li>
              <li>Click edge labels (text on arrows) to edit</li>
              <li>Changes sync live with the code editor</li>
            </ul>
          </div>
        </div>
      </aside>
    </Resizable.Pane>
  </Resizable.PaneGroup>
</div>
