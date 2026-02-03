<script lang="ts">
  import { stateStore, updateCode, updateCodeStore } from '$/util/state';
  import { Button } from '$/components/ui/button';
  import { Input } from '$/components/ui/input';
  import { Switch } from '$/components/ui/switch';
  import View from '$/components/View.svelte';
  import type { PanZoomState } from '$/util/panZoom';
  import PlusIcon from '~icons/material-symbols/add-rounded';
  import EditIcon from '~icons/material-symbols/edit-square-outline';

  let { panZoomState }: { panZoomState: PanZoomState } = $props();
  
  let isInteractive = $derived($stateStore.viewMode === 'interactive');
  let selectedElement = $state<{ id: string; type: 'node' | 'edge' | 'label'; label: string } | null>(null);

  function handleSvgClick(event: MouseEvent) {
    if (!isInteractive) return;
    
    const target = event.target as SVGElement;
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
    // Fallback for direct text children
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
    const oldLabel = selectedElement.label;
    
    // More robust patching: Try to find the label specifically related to the selected ID
    // or just a broad replacement if it's unique enough.
    // For nodes in Mermaid: A[Label] or A(Label)
    let newCode = oldCode;
    const escapedOldLabel = oldLabel.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    
    // Optimization: If it's a node, try to find the ID-label association
    if (selectedElement.type === 'node' && selectedElement.id !== 'unknown') {
        const nodePattern = new RegExp(`(${selectedElement.id}\\[(.*?)\\]|${selectedElement.id}\\((.*?)\\)|${selectedElement.id}\\{(.*?)\\}|${selectedElement.id}\\[\\[(.*?)\\]\\]|${selectedElement.id}\\((.*?)\\)|${selectedElement.id}\\>(.*?)\\]|${selectedElement.id}\\((.*?)\\))`, 'g');
        if (nodePattern.test(oldCode)) {
             newCode = oldCode.replace(nodePattern, (match) => {
                 return match.replace(oldLabel, newLabel);
             });
        }
    }
    
    // Fallback if the pattern matching didn't catch it
    if (newCode === oldCode) {
        newCode = oldCode.replace(new RegExp(escapedOldLabel, 'g'), newLabel);
    }
    
    updateCode(newCode);
    selectedElement.label = newLabel;
  }

  function applyStyle(color: string) {
    if (!selectedElement || selectedElement.type !== 'node') return;
    const nodeName = selectedElement.id;
    const oldCode = $stateStore.code;
    
    const styleRegex = new RegExp(`style ${nodeName} [^\\n]+`, 'g');
    let newCode: string;
    if (styleRegex.test(oldCode)) {
        newCode = oldCode.replace(styleRegex, `style ${nodeName} fill:${color}`);
    } else {
        newCode = oldCode + `\nstyle ${nodeName} fill:${color}`;
    }
    updateCode(newCode);
  }

  function addNode() {
    const oldCode = $stateStore.code;
    const newNodeId = `Node${Math.floor(Math.random() * 1000)}`;
    const newCode = oldCode + `\n    ${newNodeId}[New Node]`;
    updateCode(newCode);
  }

  function toggleInteractive(checked: boolean) {
    updateCodeStore({ viewMode: checked ? 'interactive' : 'code' });
    if (!checked) selectedElement = null;
  }
</script>

<div class="relative flex h-full flex-col overflow-hidden">
  <!-- Interactive View Header -->
  <div class="flex items-center justify-between border-b bg-muted/30 px-4 py-2">
    <div class="flex items-center gap-2">
      <EditIcon class="text-accent" />
      <span class="text-sm font-semibold">Interactive Mode</span>
      <Switch 
        checked={isInteractive} 
        onCheckedChange={toggleInteractive} 
        size="sm"
      />
    </div>
    
    {#if isInteractive}
      <Button variant="outline" size="sm" onclick={addNode}>
        <PlusIcon class="mr-1" />
        Add Node
      </Button>
    {/if}
  </div>

  <div class="flex flex-1 overflow-hidden">
    <!-- Preview Area -->
    <div 
        class={['relative flex-1', isInteractive && 'cursor-crosshair']} 
        onclick={handleSvgClick} 
        role="presentation"
    >
      <View {panZoomState} shouldShowGrid={$stateStore.grid} />
      
      {#if isInteractive && !selectedElement}
        <div class="pointer-events-none absolute top-4 left-1/2 -translate-x-1/2 rounded-full bg-background/80 px-4 py-1 text-xs font-medium shadow-sm backdrop-blur-sm border">
          Click an element to edit
        </div>
      {/if}
    </div>

    <!-- Properties Panel (Sidebar) -->
    {#if isInteractive && selectedElement}
      <aside 
        class="w-64 border-l bg-background p-4 shadow-xl transition-all"
      >
          {#if isInteractive && selectedElement}
            <div class="rounded-xl border border-border bg-card p-4 shadow-sm">
              <div class="mb-4">
                <h3 class="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {selectedElement.type}: {selectedElement.id}
                </h3>
              </div>
              
              <div class="flex flex-col gap-4">
                <div class="space-y-1.5">
                  <label class="text-sm font-medium leading-none">Label Text</label>
                  <Input 
                    value={selectedElement.label} 
                    oninput={(e) => updateLabel((e.target as HTMLInputElement).value)}
                    placeholder="Label text..."
                  />
                </div>

                {#if selectedElement.type === 'node'}
                  <div class="space-y-1.5">
                    <span class="text-sm font-medium leading-none">Node Color</span>
                    <div class="flex flex-wrap gap-1.5 pt-1">
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
          {/if}
          <div class="mt-4 rounded-lg bg-accent/5 p-3 text-[10px] leading-tight">
            <strong>Tip:</strong> Changes are saved directly to the code on the left.
          </div>
      </aside>
    {/if}
  </div>
</div>
