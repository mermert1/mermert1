<script lang="ts">
  import { Button } from '$/components/ui/button';
  import { cn } from '$/utils';
  import FolderIcon from '~icons/material-symbols/folder-open';
  import ExportIcon from '~icons/material-symbols/download';
  import TemplateIcon from '~icons/material-symbols/account-tree';
  import SettingsIcon from '~icons/material-symbols/settings';
  import HistoryIcon from '~icons/material-symbols/history';
  import CreditIcon from '~icons/material-symbols/person-outline';

  interface Props {
    activeView: string;
    onViewChange: (view: string) => void;
    isMobile?: boolean;
  }

  let { activeView, onViewChange, isMobile = false }: Props = $props();

  const primaryActions = $derived([
    ...(!isMobile ? [{ id: 'explorer', icon: FolderIcon, label: 'Explorer' }] : []),
    { id: 'templates', icon: TemplateIcon, label: 'Templates' },
    { id: 'export', icon: ExportIcon, label: 'Export' }
  ]);

  const secondaryActions = [
    { id: 'history', icon: HistoryIcon, label: 'History' },
    { id: 'credits', icon: CreditIcon, label: 'Credits' },
    { id: 'settings', icon: SettingsIcon, label: 'Settings' }
  ];
</script>

<div class="flex h-full w-12 flex-col items-center justify-between border-r bg-muted py-2">
  <div class="flex flex-col gap-2">
    {#each primaryActions as action (action.id)}
      <Button
        variant="ghost"
        size="icon"
        class={cn(
          'size-10 rounded-none border-l-2 border-transparent hover:bg-background',
          activeView === action.id && 'border-primary bg-background'
        )}
        onclick={() => onViewChange(activeView === action.id ? '' : action.id)}
        title={action.label}>
        <action.icon class="size-6 text-muted-foreground" />
      </Button>
    {/each}
  </div>
  <div class="flex flex-col gap-2">
    {#each secondaryActions as action (action.id)}
      <Button
        variant="ghost"
        size="icon"
        class={cn(
          'size-10 rounded-none border-l-2 border-transparent hover:bg-background',
          activeView === action.id && 'border-primary bg-background'
        )}
        onclick={() => onViewChange(activeView === action.id ? '' : action.id)}
        title={action.label}>
        <action.icon class="size-6 text-muted-foreground" />
      </Button>
    {/each}
  </div>
</div>
