<script lang="ts">
  import { Button } from '$/components/ui/button';
  import * as Popover from '$/components/ui/popover';
  import Icon from '~icons/material-symbols/add-reaction';
  import SearchIcon from '~icons/material-symbols/search';
  import { toast } from 'svelte-sonner';

  // FontAwesome 6 Free icons commonly used in Mermaid
  // ... (keep icon list same) ...
  const icons = [
    { id: 'fa:fa-user', name: 'User' },
    { id: 'fa:fa-car', name: 'Car' },
    { id: 'fa:fa-database', name: 'Database' },
    { id: 'fa:fa-server', name: 'Server' },
    { id: 'fa:fa-cloud', name: 'Cloud' },
    { id: 'fa:fa-envelope', name: 'Envelope' },
    { id: 'fa:fa-check', name: 'Check' },
    { id: 'fa:fa-times', name: 'Times' },
    { id: 'fa:fa-cog', name: 'Cog' },
    { id: 'fa:fa-home', name: 'Home' },
    { id: 'fa:fa-camera', name: 'Camera' },
    { id: 'fa:fa-heart', name: 'Heart' },
    { id: 'fa:fa-rocket', name: 'Rocket' },
    { id: 'fa:fa-laptop', name: 'Laptop' },
    { id: 'fa:fa-mobile', name: 'Mobile' },
    { id: 'fa:fa-wifi', name: 'Wifi' },
    { id: 'fa:fa-lock', name: 'Lock' },
    { id: 'fa:fa-thumbs-up', name: 'Thumbs Up' }
  ];

  let searchQuery = $state('');
  let filteredIcons = $derived(
    icons.filter(
      (icon) =>
        icon.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        icon.id.includes(searchQuery.toLowerCase())
    )
  );
  let isOpen = $state(false);

  function insertIcon(iconId: string) {
    navigator.clipboard.writeText(iconId).then(() => {
      toast.success('Icon copied successfully', {
        style: 'background: #22c55e; color: white; border: none; font-weight: 500;'
      });
      isOpen = false;
    });
  }
</script>

<Popover.Root bind:open={isOpen}>
  <Popover.Trigger>
    <Button variant="ghost" size="sm" title="Insert Icon">
      <Icon class="size-5" />
    </Button>
  </Popover.Trigger>
  <Popover.Content class="w-64 p-2">
    <div class="flex flex-col gap-2">
      <div class="flex items-center gap-2 rounded-md border px-2 py-1">
        <SearchIcon class="text-muted-foreground" />
        <input
          type="text"
          placeholder="Search icons..."
          class="w-full bg-transparent text-sm focus:outline-none"
          bind:value={searchQuery} />
      </div>
      <div class="grid max-h-48 grid-cols-4 gap-2 overflow-y-auto pt-2">
        {#each filteredIcons as icon (icon.id)}
          <button
            class="flex flex-col items-center justify-center gap-1 rounded bg-muted p-1 hover:bg-accent hover:text-accent-foreground"
            onclick={() => insertIcon(icon.id)}
            title={icon.name}>
            <i class={`fa ${icon.id.replace('fa:fa-', 'fa-')} text-lg`}></i>
            <!-- Note: font-awesome needs to be loaded globally for 'i' tag preivew, 
                         or we just show a placeholder/name if not available yet -->
            <span class="w-full truncate text-center text-[10px]">{icon.name}</span>
          </button>
        {/each}
      </div>
    </div>
  </Popover.Content>
</Popover.Root>
