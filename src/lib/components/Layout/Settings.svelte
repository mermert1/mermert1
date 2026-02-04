<script lang="ts">
  import { toggleDarkTheme, updateCodeStore, stateStore } from '$/util/state';
  import { Switch } from '$/components/ui/switch';
  import { Label } from '$/components/ui/label';
  import { mode, setMode } from 'mode-watcher';
  import ThemeIcon from '~icons/material-symbols/dark-mode-rounded';
  import AppThemeIcon from '~icons/material-symbols/palette';

  let sync = $derived($stateStore.updateDiagram);
  // let autoSync = $derived($stateStore.autoSync);
  let rough = $derived($stateStore.rough);
  let panZoom = $derived($stateStore.panZoom);
  let currentTheme = $derived(JSON.parse($stateStore.mermaid).theme);
  let isDark = $derived(currentTheme === 'dark');
  let isAppDark = $derived($mode === 'dark');

  const toggleSync = () => {
    updateCodeStore({ updateDiagram: !sync });
  };
  // const toggleAutoSync = () => {
  //  updateCodeStore({ autoSync: !autoSync });
  // };

  const toggleRough = () => {
    updateCodeStore({ rough: !rough });
  };

  const togglePanZoom = () => {
    updateCodeStore({ panZoom: !panZoom });
  };

  const handleThemeChange = () => {
    toggleDarkTheme(!isDark);
  };

  const handleAppThemeChange = () => {
    setMode($mode === 'dark' ? 'light' : 'dark');
  };
</script>

<div class="flex flex-col gap-6 p-4">
  <div class="space-y-4">
    <h3 class="text-sm font-medium tracking-wider text-muted-foreground uppercase">Appearance</h3>
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <AppThemeIcon class="size-4" />
        <Label for="app-theme-mode">App Theme</Label>
      </div>
      <Switch id="app-theme-mode" checked={isAppDark} onCheckedChange={handleAppThemeChange} />
    </div>
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <ThemeIcon class="size-4" />
        <Label for="theme-mode">Diagram Dark Mode</Label>
      </div>
      <Switch id="theme-mode" checked={isDark} onCheckedChange={handleThemeChange} />
    </div>
  </div>

  <div class="space-y-4">
    <h3 class="text-sm font-medium tracking-wider text-muted-foreground uppercase">Editor</h3>
    <div class="flex items-center justify-between">
      <Label for="auto-sync">Auto Sync</Label>
      <Switch id="auto-sync" checked={sync} onCheckedChange={toggleSync} />
    </div>
    <div class="flex items-center justify-between">
      <Label for="rough-mode">Rough Mode</Label>
      <Switch id="rough-mode" checked={rough} onCheckedChange={toggleRough} />
    </div>
    <div class="flex items-center justify-between">
      <Label for="pan-zoom">Pan & Zoom</Label>
      <Switch id="pan-zoom" checked={panZoom} onCheckedChange={togglePanZoom} />
    </div>
  </div>
</div>
