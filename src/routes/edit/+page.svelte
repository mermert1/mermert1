<script lang="ts">
  import DiagramDocButton from '$/components/DiagramDocumentationButton.svelte';
  import Editor from '$/components/Editor.svelte';
  import FileExplorer from '$/components/FileExplorer/FileExplorer.svelte';
  import HistoryTimeline from '$/components/History/HistoryTimeline.svelte';
  import ThemeStore from '$/components/ThemeStore.svelte';
  import ActivityBar from '$/components/Layout/ActivityBar.svelte';
  import ExportPane from '$/components/Layout/ExportPane.svelte';
  import MobileLayout from '$/components/Layout/MobileLayout.svelte';
  import SideBar from '$/components/Layout/SideBar.svelte';
  import StatusBar from '$/components/Layout/StatusBar.svelte';
  import MainMenu from '$/components/MainMenu.svelte';
  import PanZoomToolbar from '$/components/PanZoomToolbar.svelte';
  import Share from '$/components/Share.svelte';
  import Settings from '$/components/Layout/Settings.svelte';
  import TemplatePane from '$/components/Layout/TemplatePane.svelte';
  import Credits from '$/components/Layout/Credits.svelte';
  import View from '$/components/View.svelte';
  import { Button } from '$/components/ui/button';
  import * as Resizable from '$/components/ui/resizable';
  import type { Tab } from '$/types';
  import { loadRoots, saveFile } from '$/util/fileSystem';
  import { packFileContent } from '$/util/fileContent';
  import { PanZoomState } from '$/util/panZoom';
  import { stateStore, updateCodeStore } from '$/util/state';
  import { logEvent } from '$/util/stats';
  import { initHandler } from '$/util/util';
  import { siteFiles } from '$/util/siteWorkspace.svelte';
  import { onMount } from 'svelte';
  import { toast } from 'svelte-sonner';
  import CodeIcon from '~icons/custom/code';
  import SaveIcon from '~icons/material-symbols/save';
  import GearIcon from '~icons/material-symbols/settings';
  import Card from '$/components/Card/Card.svelte';
  import HelpIcon from '~icons/material-symbols/help';
  import Tutorial from '$/components/Layout/Tutorial.svelte';
  import AIChatSidebar from '$/components/AIChatSidebar.svelte';
  import { scheduleAutoSave } from '$/util/historyStore';
  import AIIcon from '~icons/material-symbols/auto-awesome';
  import CheckIcon from '~icons/material-symbols/check-circle-outline';
  import { Toggle } from "$/components/ui/toggle";
  import ShortcutsModal from '$/components/Layout/ShortcutsModal.svelte';

  const panZoomState = new PanZoomState();

  const tabSelectHandler = (tab: Tab) => {
    // @ts-expect-error - editorMode is a subset of tab.id
    updateCodeStore({ editorMode: tab.id });
  };

  const editorTabs: Tab[] = [
    { icon: CodeIcon, id: 'code', title: 'Code' },
    { icon: GearIcon, id: 'config', title: 'Config' },
    { icon: HelpIcon, id: 'tutorial', title: 'Learning' }
  ];

  let width = $state(1200);
  let isMobile = $derived(width > 0 && width < 768);

  onMount(async () => {
    await initHandler();
    
    const onHashChange = () => {
      void initHandler();
    };
    window.addEventListener('hashchange', onHashChange);

    window.addEventListener('appinstalled', () => {
      logEvent('pwaInstalled', { isMobile });
    });
    await loadRoots();

    return () => {
      window.removeEventListener('hashchange', onHashChange);
    };
  });

  let activeSideBarView = $state('explorer');
  let showAISidebar = $state(false);
  let isShortcutsOpen = $state(false);
  
  // NEW: Simple vs Advanced Mode (Synced with store)
  let isAdvancedMode = $derived($stateStore.isAdvancedMode);
  const toggleMode = (pressed: boolean) => {
    updateCodeStore({ isAdvancedMode: pressed });
  };

  async function handleSaveDiagram() {
    const packed = packFileContent($stateStore.code, $stateStore.mermaid);
    const saved = await saveActiveFile(packed);
    if (saved) {
      toast.success('Diagram saved successfully');
      return;
    }
    try {
      if (await saveFile(packed)) {
        toast.success('Diagram saved successfully');
      }
    } catch {
      // Error handled in saveFile
    }
  }

  import {
    activeFileHandle,
    activeVirtualFileId,
    lastSavedCode,
    saveActiveFile,
    saveStatus,
    writeFile
  } from '$/util/fileSystem';
  import { debounce } from 'lodash-es';

  const isDirty = $derived(
    (!!$activeFileHandle || !!$activeVirtualFileId) && $stateStore.code !== $lastSavedCode
  );

  const autosave = debounce(async (code: string) => {
    const handle = $activeFileHandle;
    const virtualId = $activeVirtualFileId;
    const packed = packFileContent(code, $stateStore.mermaid);

    if (virtualId) {
      await saveActiveFile(packed);
      return;
    }

    if (handle && code !== $lastSavedCode) {
      try {
        // @ts-expect-error - File System API types are experimental
        const permission = await handle.queryPermission({ mode: 'readwrite' });
        if (permission === 'granted') {
          await writeFile(handle, packed);
        } else {
          saveStatus.set('blocked');
        }
      } catch (error) {
        console.error('Autosave failed:', error);
      }
    }
  }, 60000);

  $effect(() => {
    if ((!!$activeFileHandle || !!$activeVirtualFileId) && isDirty) {
      autosave($stateStore.code);
    }
    scheduleAutoSave($stateStore.code, $stateStore.mermaid);
  });

  function handleKeydown(e: KeyboardEvent) {
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      handleSaveDiagram();
    }
    if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
      e.preventDefault();
      // Reserved for Command Palette or Export
    }
  }
</script>

<svelte:window bind:innerWidth={width} onkeydown={handleKeydown} />

{#if width > 0 && isMobile}
  <MobileLayout {isMobile} />
{:else}
  <div class="flex h-screen w-screen flex-col overflow-hidden bg-background text-foreground">
    <!-- Clean Header -->
    <header class="flex h-12 shrink-0 items-center justify-between border-b border-border px-4 bg-background z-50 transition-all duration-300">
        <div class="flex items-center gap-3">
            <div class="flex items-center gap-2">
                <div class="w-7 h-7 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-sm rotate-3">
                    G
                </div>
                <span class="font-bold tracking-tight flex items-center gap-2">
                    Graphi 
                    <span class="text-xs font-normal text-muted-foreground italic flex items-center gap-1">
                      / 
                      {#if $activeVirtualFileId}
                        {siteFiles.find(f => f.id === $activeVirtualFileId)?.name || 'Untitled Diagram'}
                      {:else}
                        {$activeFileHandle?.name || 'Untitled Diagram'}
                      {/if}
                      {#if isDirty}
                        <span class="text-primary text-[10px] ml-0.5">●</span>
                      {/if}
                    </span>
                </span>
            </div>
            
            <div class="h-4 w-[1px] bg-border mx-2"></div>
            
            {#if isAdvancedMode}
              <MainMenu />
            {/if}
        </div>

        <div class="flex items-center gap-3">
            <!-- Save Status -->
            <div class="flex justify-end min-w-[60px] text-[10px] uppercase font-bold tracking-wider mr-2">
              {#if $saveStatus === 'saving'}
                <span class="animate-pulse text-muted-foreground">Saving...</span>
              {:else if $saveStatus === 'success'}
                <span class="text-green-600 dark:text-green-400 flex items-center gap-1 animate-out fade-out duration-1000 fill-mode-forwards">
                  <CheckIcon class="size-3.5" />
                  Saved
                </span>
              {:else if $saveStatus === 'blocked'}
                <span class="text-destructive text-[9px] cursor-help" title="Click Save button to grant permission">Need Permission</span>
              {/if}
            </div>

            <!-- Mode Toggle -->
            <label class="flex items-center gap-2 text-xs font-semibold cursor-pointer border border-border px-2 py-1 rounded-md bg-muted/20 hover:bg-muted/40 transition-colors">
              <span class="text-muted-foreground {isAdvancedMode ? '' : 'text-foreground'}">Simple</span>
              <Toggle 
                pressed={isAdvancedMode} 
                onPressedChange={toggleMode}
                size="sm" 
                class="h-5 w-8 data-[state=on]:bg-primary rounded-full p-0">
                 <div class="h-3 w-3 bg-white rounded-full transition-transform {isAdvancedMode ? 'translate-x-1.5' : '-translate-x-1.5'} shadow-sm"></div>
              </Toggle>
              <span class="text-muted-foreground {isAdvancedMode ? 'text-foreground' : ''}">Advanced</span>
            </label>

            <!-- Actions -->
            <div class="flex items-center gap-1 border border-border bg-muted/20 rounded-md p-1 shadow-sm">
                <Button variant="default" size="sm" onclick={handleSaveDiagram} title="Save to File" class="h-7 px-3 text-xs gap-1.5 font-bold">
                    <SaveIcon class="size-3.5" />
                    Save
                </Button>
                <div class="h-4 w-[1px] bg-border mx-1"></div>
                <Share />
            </div>
            
            <Button
                variant={showAISidebar ? 'secondary' : 'ghost'}
                size="icon"
                onclick={() => (showAISidebar = !showAISidebar)}
                title="AI Assistant"
                class="size-8 rounded-full text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-950/50">
                <AIIcon class="size-5" />
            </Button>
        </div>
    </header>

    <div class="flex flex-1 overflow-hidden">
      <!-- Only show ActivityBar in Advanced Mode -->
      {#if isAdvancedMode}
        <ActivityBar
          {isMobile}
          activeView={activeSideBarView}
          onViewChange={(view) => {
            if (view === 'shortcuts') {
              isShortcutsOpen = true;
              return;
            }
            if (view === activeSideBarView && activeSideBarView !== '') {
              // Toggle off
              activeSideBarView = '';
            } else {
              activeSideBarView = view;
            }
          }} />
      {/if}

      <Resizable.PaneGroup direction="horizontal" class="flex-1 overflow-hidden">
        <!-- Sidebar only in Advanced Mode + Active View -->
        {#if isAdvancedMode && activeSideBarView}
          <Resizable.Pane order={1} defaultSize={20} minSize={15} maxSize={40} collapsible={false}>
            <SideBar
              title={activeSideBarView === 'explorer'
                ? 'Explorer'
                : activeSideBarView === 'export'
                  ? 'Export'
                  : activeSideBarView === 'history'
                    ? 'History'
                    : activeSideBarView === 'themes'
                      ? 'Theme Store'
                    : activeSideBarView === 'templates'
                      ? 'Templates'
                      : activeSideBarView === 'credits'
                        ? 'Credits'
                        : 'Settings'}>
              {#if activeSideBarView === 'explorer' && !isMobile}
                <div class="h-full p-2">
                  <FileExplorer {isMobile} />
                </div>
              {:else if activeSideBarView === 'export'}
                <ExportPane />
              {:else if activeSideBarView === 'history'}
                <div class="h-full overflow-y-auto">
                  <HistoryTimeline onRestore={(code, mermaid) => {
                    const update: Record<string, string> = { code };
                    if (mermaid) update.mermaid = mermaid;
                    updateCodeStore(update);
                  }} />
                </div>
              {:else if activeSideBarView === 'themes'}
                <ThemeStore />
              {:else if activeSideBarView === 'templates'}
                <div class="h-full overflow-y-auto">
                  <TemplatePane />
                </div>
              {:else if activeSideBarView === 'credits'}
                <Credits />
              {:else if activeSideBarView === 'settings'}
                <Settings />
              {/if}
            </SideBar>
          </Resizable.Pane>
          <Resizable.Handle withHandle class="w-1.5 bg-border/50 hover:bg-primary/50 transition-colors" />
        {/if}

        <Resizable.Pane order={2} defaultSize={80}>
          <div class="flex h-full flex-col overflow-hidden">
            <!-- Removed old header, now unified at top -->
            <!-- Nested Resizable Group for Editor & Preview -->
            <Resizable.PaneGroup direction="horizontal" class="flex-1 w-full h-full" autoSaveId="graphi-editor-panes">
              <Resizable.Pane order={1} defaultSize={50} minSize={20} class="flex flex-col border-r border-border h-full bg-background/50">
                <Card
                  onselect={tabSelectHandler}
                  isOpen
                  tabs={isAdvancedMode ? editorTabs : [editorTabs[0]]} 
                  activeTabID={$stateStore.editorMode}
                  isClosable={false}
                  class="h-full w-full rounded-none border-0 bg-transparent flex flex-col">
                  {#snippet actions()}
                    <DiagramDocButton />
                  {/snippet}
                  <div class="flex-1 overflow-hidden relative">
                    {#if $stateStore.editorMode === 'tutorial'}
                      <Tutorial />
                    {:else}
                      <Editor {isMobile} />
                    {/if}
                  </div>
                </Card>
              </Resizable.Pane>

              <Resizable.Handle withHandle class="w-1.5 bg-border/50 hover:bg-primary/50 transition-colors" />

              <!-- Preview Area styled like mockup -->
              <Resizable.Pane order={2} defaultSize={50} minSize={20} class="relative h-full flex flex-col items-center justify-center bg-muted/5 theme-transition overflow-hidden">
                <div class="z-10 w-full h-full p-4 md:p-8 flex items-center justify-center">
                    <div class="w-full h-full rounded-xl bg-background border border-border transition-all duration-300 relative overflow-hidden flex flex-col">
                        <View {panZoomState} shouldShowGrid={$stateStore.grid} />
                    </div>
                </div>

                <div class="absolute right-6 bottom-6 flex flex-col gap-2 z-20">
                  <PanZoomToolbar {panZoomState} />
                </div>
              </Resizable.Pane>

              {#if showAISidebar}
                <Resizable.Handle withHandle class="w-1.5 bg-border/50" />
                <Resizable.Pane order={3} defaultSize={30} minSize={20} maxSize={50} class="relative h-full flex flex-col border-l border-border bg-card">
                  <AIChatSidebar
                    currentCode={$stateStore.code}
                    onInsertCode={(code) => updateCodeStore({ code })}
                    onClose={() => (showAISidebar = false)}
                  />
                </Resizable.Pane>
              {/if}
            </Resizable.PaneGroup>
          </div>
        </Resizable.Pane>
      </Resizable.PaneGroup>
    </div>

    <!-- Replace old StatusBar component call with new styled one -->
    <StatusBar />
  </div>

  <ShortcutsModal bind:isOpen={isShortcutsOpen} />
{/if}