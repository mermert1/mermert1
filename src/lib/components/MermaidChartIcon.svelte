<script lang="ts">
  import type { ClassValue } from 'svelte/elements';

  let { class: className }: { class?: ClassValue } = $props();
</script>

<img class={['size-4', className]} src="https://raw.githubusercontent.com/mermert1/mermert1/refs/heads/main/static/mermaidchart-logo.svg" alt="Mermaid Chart" />
