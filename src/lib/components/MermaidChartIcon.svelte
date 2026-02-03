<script lang="ts">
  import { base } from '$app/paths';
  import type { ClassValue } from 'svelte/elements';

  let { class: className }: { class?: ClassValue } = $props();
</script>

<img class={['size-4', className]} src="{base}/mermaidchart-logo.svg" alt="Mermaid Chart" />
