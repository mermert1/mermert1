<script lang="ts">
  import DiagramDocButton from '$/components/DiagramDocumentationButton.svelte';
  import Editor from '$/components/Editor.svelte';
  import FileExplorer from '$/components/FileExplorer/FileExplorer.svelte';
  import History from '$/components/History/History.svelte';
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
  import { PanZoomState } from '$/util/panZoom';
  import { stateStore, updateCodeStore } from '$/util/state';
  import { logEvent } from '$/util/stats';
  import { initHandler } from '$/util/util';
  import { onMount } from 'svelte';
  import { toast } from 'svelte-sonner';
  import CodeIcon from '~icons/custom/code';
  import SaveIcon from '~icons/material-symbols/save';
  import GearIcon from '~icons/material-symbols/settings';
  import Card from '$/components/Card/Card.svelte';

  import HelpIcon from '~icons/material-symbols/help';
  import Tutorial from '$/components/Layout/Tutorial.svelte';

  const panZoomState = new PanZoomState();

  const tabSelectHandler = (tab: Tab) => {
    // @ts-expect-error - editorMode is a subset of tab.id
    updateCodeStore({ editorMode: tab.id });
  };

  const editorTabs: Tab[] = [
    {
      icon: CodeIcon,
      id: 'code',
      title: 'Code'
    },
    {
      icon: GearIcon,
      id: 'config',
      title: 'Config'
    },
    {
      icon: HelpIcon,
      id: 'tutorial',
      title: 'Learning'
    }
  ];

  let width = $state(1200);
  let isMobile = $derived(width > 0 && width < 768);

  onMount(async () => {
    await initHandler();
    window.addEventListener('appinstalled', () => {
      logEvent('pwaInstalled', { isMobile });
    });
    // Load persisted folders
    await loadRoots();
  });

  // let isHistoryOpen = $state(false); // Removed, using sidebar

  let activeSideBarView = $state('explorer'); // Default to explorer

  async function handleSaveDiagram() {
    const code = $stateStore.code;
    // Try to save to active file first
    const saved = await saveActiveFile(code);
    if (saved) {
      toast.success('Diagram saved successfully');
      saveStatus.set('saved');
      return;
    }

    // Fallback to Save As
    try {
      if (await saveFile(code)) {
        toast.success('Diagram saved successfully');
        saveStatus.set('saved');
      }
    } catch {
      // Error handled in saveFile
    }
  }

  // Editor resize logic removed

  import {
    activeFileHandle,
    activeVirtualFileId,
    lastSavedCode,
    saveActiveFile,
    saveStatus,
    writeFile
  } from '$/util/fileSystem';
  import { debounce } from 'lodash-es';

  // State
  const isDirty = $derived(
    (!!$activeFileHandle || !!$activeVirtualFileId) && $stateStore.code !== $lastSavedCode
  );

  // Autosave Logic
  const autosave = debounce(async (code: string) => {
    const handle = $activeFileHandle;
    const virtualId = $activeVirtualFileId;

    if (virtualId) {
      await saveActiveFile(code);
      return;
    }

    if (handle && code !== $lastSavedCode) {
      try {
        // Only attempt if we likely have permission
        // @ts-expect-error - File System API types are experimental
        const permission = await handle.queryPermission({ mode: 'readwrite' });
        if (permission === 'granted') {
          await writeFile(handle, code);
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
  });

  // Clean up navbar to be just a top header if desired, or remove it completely
  // and move title to titlebar. For now, we keep a slim header.
</script>

<svelte:window bind:innerWidth={width} />

{#if width > 0 && isMobile}
  <MobileLayout {isMobile} />
{:else}
  <div class="flex h-screen w-screen flex-col overflow-hidden bg-background">
    <!-- Top Bar / Title Bar (Optional, can be merged into Activity Bar top or kept separate) -->
    <!-- Using a simplified header for standard app feel -->

    <div class="flex flex-1 overflow-hidden">
      <!-- Activity Bar -->
      <ActivityBar
        {isMobile}
        activeView={activeSideBarView}
        onViewChange={(view) => {
          if (view === activeSideBarView && activeSideBarView !== '') {
            // Optional: collapse logic if desired
          } else {
            activeSideBarView = view;
          }
        }} />

      <!-- Resizable Content Area -->
      <Resizable.PaneGroup direction="horizontal" class="flex-1 overflow-hidden">
        {#if activeSideBarView}
          <Resizable.Pane defaultSize={20} minSize={15} maxSize={40} collapsible={false}>
            <SideBar
              title={activeSideBarView === 'explorer'
                ? 'Explorer'
                : activeSideBarView === 'export'
                  ? 'Export'
                  : activeSideBarView === 'history'
                    ? 'History'
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
                  <History />
                </div>
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
          <Resizable.Handle />
        {/if}

        <Resizable.Pane defaultSize={80}>
          <div class="flex h-full flex-col overflow-hidden">
            <div class="flex h-10 shrink-0 items-center justify-between border-b px-4">
              <!-- Breadcrumbs or simple title -->
              <div class="flex items-center gap-2">
                <MainMenu />
                <span class="text-sm font-semibold">
                  {$activeFileHandle?.name || 'Untitled'}
                  {#if isDirty}
                    <span class="ml-1 text-[#333333] dark:text-white">●</span>
                  {/if}
                </span>
              </div>

              <div class="flex items-center gap-2">
                <Share />
                <div class="flex items-center gap-2 px-2 text-xs">
                  {#if isDirty}
                    <span class="text-[#333333] dark:text-white" title="Unsaved changes">●</span>
                  {/if}

                  {#if $saveStatus === 'saving'}
                    <span class="animate-pulse text-muted-foreground">Saving...</span>
                  {:else if $saveStatus === 'blocked'}
                    <span class="text-rose-500" title="Click Save button to grant permission"
                      >Permission Needed</span>
                  {/if}
                </div>
                <Button variant="ghost" size="icon" onclick={handleSaveDiagram} title="Save">
                  <SaveIcon class="size-5" />
                </Button>
              </div>
            </div>

            <div class="relative flex flex-1 flex-row overflow-hidden">
              <div class="flex h-full w-1/2 flex-col border-r">
                <Card
                  onselect={tabSelectHandler}
                  isOpen
                  tabs={editorTabs}
                  activeTabID={$stateStore.editorMode}
                  isClosable={false}
                  class="h-full rounded-none border-0">
                  {#snippet actions()}
                    <DiagramDocButton />
                  {/snippet}
                  {#if $stateStore.editorMode === 'tutorial'}
                    <Tutorial />
                  {:else}
                    <Editor {isMobile} />
                  {/if}
                </Card>
              </div>

              <div class="relative h-full w-1/2 bg-muted/10">
                <View {panZoomState} shouldShowGrid={$stateStore.grid} />
                <div class="absolute right-4 bottom-4 flex flex-col gap-2">
                  <PanZoomToolbar {panZoomState} />
                </div>
              </div>
            </div>
          </div>
        </Resizable.Pane>
      </Resizable.PaneGroup>
    </div>

    <StatusBar />
  </div>
{/if}
