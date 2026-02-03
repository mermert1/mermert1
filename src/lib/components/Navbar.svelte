<script lang="ts" module>
  import { logEvent, plausible } from '$lib/util/stats';
  import { version } from 'mermaid/package.json';

  void logEvent('version', {
    mermaidVersion: version
  });
</script>

<script lang="ts">
  import MainMenu from '$/components/MainMenu.svelte';
  import { Button } from '$/components/ui/button';
  import { Separator } from '$/components/ui/separator';
  import type { ComponentProps, Snippet } from 'svelte';
  import CloseIcon from '~icons/material-symbols/close-rounded';
  import GithubIcon from '~icons/mdi/github';
  import { Switch } from '$/components/ui/switch';
  import { stateStore, updateCodeStore } from '$/util/state';
  import DropdownNavMenu from './DropdownNavMenu.svelte';

  interface Props {
    mobileToggle?: Snippet;
    children: Snippet;
  }

  let { children, mobileToggle }: Props = $props();

  type Links = ComponentProps<typeof DropdownNavMenu>['links'];

  const githubLinks: Links = [
    { title: 'Mermaid JS', href: 'https://github.com/mermaid-js/mermaid' },
    {
      title: 'Mermaid Live Editor',
      href: 'https://github.com/mermaid-js/mermaid-live-editor'
    },
    {
      title: 'Mermaid CLI',
      href: 'https://github.com/mermaid-js/mermaid-cli'
    }
  ];


</script>


<nav class="z-50 flex p-4 sm:p-6">
  <div class="flex flex-1 items-center gap-2">
    <MainMenu />
    <img src="https://raw.githubusercontent.com/mermert1/mermert1/refs/heads/main/static/mermert-logo.png" alt="MerMert Logo" class="size-8 rounded-sm" />
    <a href="/" class="whitespace-nowrap text-accent">
      {#if !mobileToggle}
        MerMert
      {/if}
      {$stateStore.viewMode === 'code' ? 'Code Editor' : 'Interactive Playground'}
    </a>
  </div>

  <div class="hidden items-center gap-2 md:flex">
    <span
      class={['text-sm font-medium', $stateStore.viewMode === 'code' ? 'text-accent' : 'text-muted-foreground']}>
      Code
    </span>
    <Switch
      checked={$stateStore.viewMode === 'interactive'}
      onCheckedChange={(checked) => updateCodeStore({ viewMode: checked ? 'interactive' : 'code' })} />
    <span
      class={[
        'text-sm font-medium',
        $stateStore.viewMode === 'interactive' ? 'text-accent' : 'text-muted-foreground'
      ]}>
      Interactive
    </span>
  </div>
  <div
    id="menu"
    class="hidden flex-nowrap items-center justify-between gap-3 overflow-hidden md:flex">
    <DropdownNavMenu icon={GithubIcon} links={githubLinks} />
    <Separator orientation="vertical" />
    {@render children()}
  </div>
  {@render mobileToggle?.()}
</nav>
