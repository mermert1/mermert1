<script lang="ts">
  import { Button } from '$/components/ui/button';
  import LightbulbIcon from '~icons/material-symbols/lightbulb';
  import EditIcon from '~icons/material-symbols/edit';
  import SaveIcon from '~icons/material-symbols/save';
  import ExplorerIcon from '~icons/material-symbols/folder-open';
  import RocketIcon from '~icons/material-symbols/rocket-launch';
</script>

<div class="flex h-full flex-col gap-6 overflow-y-auto p-6 text-sm leading-relaxed">
  <div class="flex items-center gap-3 border-b pb-4">
    <RocketIcon class="size-6 text-primary" />
    <h2 class="text-xl font-bold tracking-tight italic">Getting Started with Graphi</h2>
  </div>

  <section class="space-y-4">
    <div class="flex items-center gap-2 font-bold tracking-wider text-primary uppercase">
      <EditIcon class="size-4" />
      <h3>The Editor</h3>
    </div>
    <p class="text-muted-foreground">
      Type your Mermaid code in the <strong>Code</strong> tab. Use the <strong>Config</strong> tab to
      tweak the diagram's appearance. Changes are rendered instantly on the right.
    </p>
  </section>

  <section class="space-y-4">
    <div class="flex items-center gap-2 font-bold tracking-wider text-primary uppercase">
      <ExplorerIcon class="size-4" />
      <h3>File Management</h3>
    </div>
    <p class="text-muted-foreground">
      Open local folders to edit your project's diagrams directly. Graphi tracks <strong
        >unsaved changes</strong> with a bright dot (●) indicator.
    </p>
  </section>

  <section class="space-y-4">
    <div class="flex items-center gap-2 font-bold tracking-wider text-primary uppercase">
      <SaveIcon class="size-4" />
      <h3>Saving & Autosave</h3>
    </div>
    <div class="rounded-lg border border-border bg-muted/50 p-4">
      <ul class="list-disc space-y-2 pl-4 text-muted-foreground">
        <li><strong>Autosave:</strong> Every 60 seconds (requires initial permission).</li>
        <li><strong>Manual Save:</strong> Use the Save button in the header or the Explorer.</li>
        <li><strong>Indicator:</strong> Look for the ● dot to see what's changed.</li>
      </ul>
    </div>
  </section>

  <section class="space-y-4">
    <div class="flex items-center gap-2 font-bold tracking-wider text-primary uppercase">
      <LightbulbIcon class="size-4" />
      <h3>Pro Tips</h3>
    </div>
    <div class="grid grid-cols-1 gap-3">
      <div class="rounded-md border p-3 transition-colors hover:bg-muted/30">
        <span class="font-bold text-accent">Sidebar:</span> Use the left bar to switch between Explorer,
        Templates, and History.
      </div>
      <div class="rounded-md border p-3 transition-colors hover:bg-muted/30">
        <span class="font-bold text-accent">Icons:</span> Customize your file icons in the Explorer settings
        menu.
      </div>
    </div>
  </section>

  <div class="mt-auto border-t pt-6 text-center">
    <p class="mb-4 text-xs text-muted-foreground italic">
      Need more help? Check the documentation for advanced Mermaid snippets.
    </p>
    <Button variant="outline" class="w-full" href="https://mermaid.js.org/intro/" target="_blank">
      Mermaid Docs
    </Button>
  </div>
</div>
