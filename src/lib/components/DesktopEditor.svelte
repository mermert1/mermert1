<script lang="ts">
  import type { EditorProps } from '$/types';
  import { env } from '$/util/env';
  import { stateStore } from '$/util/state';
  import { initEditor } from '$lib/util/monacoExtra';
  import { errorDebug } from '$lib/util/util';
  import { mode } from 'mode-watcher';
  import * as monaco from 'monaco-editor';
  import monacoEditorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
  import monacoJsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker';
  import { debounce } from 'lodash-es';
  import { onMount } from 'svelte';

  const { onUpdate }: EditorProps = $props();

  let divElement: HTMLDivElement | undefined = $state();
  let editor: monaco.editor.IStandaloneCodeEditor | undefined;
  let editorOptions = {
    minimap: {
      enabled: false
    },
    overviewRulerLanes: 0,
    quickSuggestions: false,
    suggestOnTriggerCharacters: false,
    wordBasedSuggestions: false
  } satisfies monaco.editor.IStandaloneEditorConstructionOptions;
  let currentText = '';

  let jsonModel: monaco.editor.ITextModel;
  let mermaidModel: monaco.editor.ITextModel;

  onMount(() => {
    self.MonacoEnvironment = {
      getWorker(_, label) {
        if (label === 'json') {
          return new monacoJsonWorker();
        }
        return new monacoEditorWorker();
      }
    };

    if (!divElement) {
      throw new Error('divEl is undefined');
    }

    monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
      validate: true,
      enableSchemaRequest: true,
      schemas: [
        {
          fileMatch: ['config.json'],
          uri: `${env.docsUrl}/schemas/config.schema.json`
        }
      ]
    });



    initEditor(monaco);
    
    jsonModel = monaco.editor.createModel(
      '',
      'json',
      monaco.Uri.parse('internal://config.json')
    );
    mermaidModel = monaco.editor.createModel(
      '',
      'mermaid',
      monaco.Uri.parse('internal://mermaid.mmd')
    );

    errorDebug();
    editor = monaco.editor.create(divElement, editorOptions);
    const onUpdateDebounced = debounce(onUpdate, 300);

    editor.onDidChangeModelContent(({ isFlush }) => {
      const newText = editor?.getValue();
      if (!newText || currentText === newText || isFlush) {
        return;
      }
      currentText = newText;
      onUpdateDebounced(currentText);
    });

    const unsubscribeState = stateStore.subscribe(({ errorMarkers, editorMode, code, mermaid }) => {
      if (!editor) {
        return;
      }

      const model = editorMode === 'code' ? mermaidModel : jsonModel;

      if (editor.getModel()?.id !== model.id) {
        editor.setModel(model);
      }

      // Update editor text if it's different
      let newText = editorMode === 'code' ? code : mermaid;
      if (typeof newText !== 'string') {
        newText = JSON.stringify(newText, null, 2);
      }
      if (newText !== currentText) {
        editor.setScrollTop(0);
        editor.setValue(newText);
        currentText = newText;
      }

      // Display/clear errors
      monaco.editor.setModelMarkers(model, 'mermaid', errorMarkers);
    });

    const unsubscribeMode = mode.subscribe((mode) => {
      if (editor) {
        monaco.editor.setTheme(`mermaid${mode === 'dark' ? '-dark' : ''}`);
      }
    });
    const resizeObserver = new ResizeObserver((entries) => {
      editor?.layout({
        height: entries[0].contentRect.height,
        width: entries[0].contentRect.width
      });
    });

    if (divElement.parentElement) {
      resizeObserver.observe(divElement);
    }

    return () => {
      unsubscribeState();
      unsubscribeMode();
      resizeObserver.disconnect();
      jsonModel.dispose();
      mermaidModel.dispose();
      editor?.dispose();
    };
  });
</script>

<div bind:this={divElement} id="editor" class="h-full flex-grow overflow-hidden"></div>
