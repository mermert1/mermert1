<script lang="ts">
  import { generateDiagram, getConfig, saveConfig, clearConfig } from '$/util/aiService';
  import type { ChatMessage, AIServiceConfig } from '$/util/aiService';
  import { Button } from '$/components/ui/button';
  import SparklesIcon from '~icons/material-symbols/auto-awesome';
  import SendIcon from '~icons/material-symbols/send';
  import DeleteIcon from '~icons/material-symbols/delete-outline';
  import CloseIcon from '~icons/material-symbols/close';
  import SettingsIcon from '~icons/material-symbols/settings-outline';
  import UserIcon from '~icons/material-symbols/person';
  import RobotIcon from '~icons/material-symbols/smart-toy-outline';
  import ContentCopyIcon from '~icons/material-symbols/content-copy';
  import ChevronDownIcon from '~icons/material-symbols/keyboard-arrow-down';

  interface Props {
    currentCode: string;
    onInsertCode: (code: string) => void;
    onClose: () => void;
  }

  let { currentCode, onInsertCode, onClose }: Props = $props();

  let messages: ChatMessage[] = $state([]);
  let inputText = $state('');
  let isLoading = $state(false);
  let error = $state('');
  let showSettings = $state(false);

  // Settings
  let apiKey = $state('');
  let provider = $state<'gemini' | 'openai' | 'groq'>('groq'); // Default to Groq
  let model = $state('llama-3.3-70b-versatile');

  // Load existing config
  $effect(() => {
    const config = getConfig();
    if (config) {
      apiKey = config.apiKey;
      provider = config.provider;
      model = config.model || '';
    } else {
      showSettings = true;
    }
  });

  function saveSettings() {
    const config: AIServiceConfig = {
      apiKey,
      provider,
      model: model || undefined
    };
    saveConfig(config);
    showSettings = false;
    error = '';
  }

  function resetSettings() {
    clearConfig();
    apiKey = '';
    provider = 'gemini';
    model = '';
    showSettings = true;
  }

  async function sendMessage() {
    if (!inputText.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      role: 'user',
      content: inputText.trim(),
      timestamp: Date.now()
    };

    messages = [...messages, userMsg];
    const messageText = inputText;
    inputText = '';
    isLoading = true;
    error = '';

    try {
      const response = await generateDiagram(messageText, currentCode, messages);

      const assistantMsg: ChatMessage = {
        role: 'assistant',
        content: response,
        timestamp: Date.now()
      };

      messages = [...messages, assistantMsg];
    } catch (err) {
      error = err instanceof Error ? err.message : 'An error occurred';
    } finally {
      isLoading = false;
    }
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  function insertCode(code: string) {
    onInsertCode(code);
  }

  function clearChat() {
    messages = [];
    error = '';
  }

  /* Custom Dropdown Logic */
  let showProviderDropdown = $state(false);
  
  const providers = [
    { value: 'groq', label: 'Groq (Fast & Free)', icon: '⚡' },
    { value: 'gemini', label: 'Google Gemini', icon: '💎' },
    { value: 'openai', label: 'OpenAI', icon: '🤖' }
  ];

  const models = {
    groq: [
      { value: 'llama-3.3-70b-versatile', label: 'Llama 3.3 70B (Recommended)' },
      { value: 'llama-3.1-8b-instant', label: 'Llama 3.1 8B (Fast)' },
      { value: 'mixtral-8x7b-32768', label: 'Mixtral 8x7B' }
    ],
    gemini: [
      { value: 'gemini-2.0-flash', label: 'Gemini 2.0 Flash (Fast)' },
      { value: 'gemini-1.5-flash', label: 'Gemini 1.5 Flash' },
      { value: 'gemini-1.5-pro', label: 'Gemini 1.5 Pro (Capable)' }
    ],
    openai: [
      { value: 'gpt-4o-mini', label: 'GPT-4o Mini (Fast)' },
      { value: 'gpt-4o', label: 'GPT-4o (Smart)' },
      { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo' }
    ]
  };

  let showModelDropdown = $state(false);

  function selectProvider(p: 'groq' | 'gemini' | 'openai') {
    provider = p;
    showProviderDropdown = false;
    // Set default models
    if (provider === 'groq') model = 'llama-3.3-70b-versatile';
    else if (provider === 'gemini') model = 'gemini-2.0-flash';
    else if (provider === 'openai') model = 'gpt-4o-mini';
  }

  function selectModel(m: string) {
    model = m;
    showModelDropdown = false;
  }
</script>

<div class="flex h-full w-[360px] flex-col bg-card border-l border-border text-sm">
  <!-- Header -->
  <div class="flex items-center justify-between border-b border-border bg-muted/30 p-2">
    <div class="flex items-center gap-1.5 px-1">
      <SparklesIcon class="size-4 text-primary" />
      <h3 class="text-[10px] font-bold tracking-[0.2em] text-muted-foreground uppercase">
        AI Assistant
      </h3>
    </div>
    <div class="flex gap-0.5">
      <Button variant="ghost" size="icon" class={showSettings ? 'bg-muted size-6' : 'size-6'} onclick={() => (showSettings = !showSettings)} title="Settings">
        <SettingsIcon class="size-3.5" />
      </Button>
      <Button variant="ghost" size="icon" class="size-6" onclick={clearChat} title="Clear chat">
        <DeleteIcon class="size-3.5" />
      </Button>
      <Button variant="ghost" size="icon" class="size-6" onclick={onClose} title="Close">
         <CloseIcon class="size-3.5" />
      </Button>
    </div>
  </div>

  <!-- Settings Panel -->
  {#if showSettings}
    <div class="flex flex-col gap-3 border-b border-border bg-muted/15 p-3 glass-subtle">
      <div class="flex flex-col gap-1">
        <span class="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Provider</span>
        <div class="relative w-full">
          <button class="flex w-full items-center justify-between rounded-md border border-border bg-background px-3 py-1.5 text-xs text-foreground transition-all hover:border-primary/50" onclick={() => showProviderDropdown = !showProviderDropdown}>
            {#if provider === 'groq'}
              <span>⚡ Groq (Fast & Free)</span>
            {:else if provider === 'gemini'}
              <span>💎 Google Gemini</span>
            {:else}
              <span>🤖 OpenAI</span>
            {/if}
            <ChevronDownIcon class="size-4 opacity-50" />
          </button>
          
          {#if showProviderDropdown}
            <div class="absolute z-50 mt-1 w-full overflow-hidden rounded-md border border-border bg-popover p-1 shadow-md">
              {#each providers as p}
                <button 
                  class="flex w-full items-center justify-between rounded-sm px-2 py-1.5 text-left text-xs text-popover-foreground hover:bg-accent hover:text-accent-foreground {provider === p.value ? 'bg-primary/10 text-primary font-medium' : ''}" 
                  onclick={() => selectProvider(p.value as any)}>
                  <span>{p.icon} {p.label}</span>
                  {#if provider === p.value}✓{/if}
                </button>
              {/each}
            </div>
            <!-- Overlay to close -->
            <button class="fixed inset-0 z-40 cursor-default" style="background: transparent;" onclick={() => showProviderDropdown = false} aria-label="Close dropdown"></button>
          {/if}
        </div>
      </div>

      <div class="flex flex-col gap-1">
        <label for="ai-key" class="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
          API Key
          {#if provider === 'groq'}
            (<a href="https://console.groq.com/keys" target="_blank" class="text-primary hover:underline">Get Key</a>)
          {:else if provider === 'gemini'}
            (<a href="https://aistudio.google.com/app/apikey" target="_blank" class="text-primary hover:underline">Get Key</a>)
          {/if}
        </label>
        <input
          id="ai-key"
          type="password"
          class="w-full rounded-md border border-border bg-background px-3 py-1.5 text-xs text-foreground outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/15"
          placeholder={provider === 'gemini' ? 'AIza...' : provider === 'groq' ? 'gsk_...' : 'sk-...'}
          bind:value={apiKey}
        />
      </div>

      <div class="flex flex-col gap-1">
        <label for="ai-model" class="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Model</label>
         <div class="relative w-full">
            <button class="flex w-full items-center justify-between rounded-md border border-border bg-background px-3 py-1.5 text-xs text-foreground transition-all hover:border-primary/50" onclick={() => showModelDropdown = !showModelDropdown}>
              <span>{models[provider]?.find(m => m.value === model)?.label || model}</span>
              <ChevronDownIcon class="size-4 opacity-50" />
            </button>
            
            {#if showModelDropdown}
              <div class="absolute z-50 mt-1 w-full overflow-hidden rounded-md border border-border bg-popover p-1 shadow-md">
                {#each models[provider] || [] as m}
                  <button 
                    class="flex w-full items-center justify-between rounded-sm px-2 py-1.5 text-left text-xs text-popover-foreground hover:bg-accent hover:text-accent-foreground {model === m.value ? 'bg-primary/10 text-primary font-medium' : ''}" 
                    onclick={() => selectModel(m.value)}>
                    <span>{m.label}</span>
                    {#if model === m.value}✓{/if}
                  </button>
                {/each}
              </div>
              <button class="fixed inset-0 z-40 cursor-default" style="background: transparent;" onclick={() => showModelDropdown = false} aria-label="Close dropdown"></button>
            {/if}
         </div>
      </div>

      <div class="mt-1 flex gap-2">
        <Button size="sm" onclick={saveSettings} class="w-full text-xs font-bold h-8">Save Settings</Button>
      </div>
    </div>
  {/if}

  <!-- Messages -->
  <div class="flex flex-1 flex-col gap-3 overflow-y-auto p-3">
    {#if messages.length === 0}
      <div class="p-8 text-center text-muted-foreground flex flex-col items-center justify-center h-full">
        <div class="mb-2 flex flex-col items-center gap-2 text-[15px] font-bold tracking-tight text-foreground">
            <div class="flex size-12 items-center justify-center rounded-2xl bg-primary/10 shadow-inner">
                <SparklesIcon class="size-6 text-primary" />
            </div>
            Text to Diagram
        </div>
        <p class="mb-6 text-xs leading-relaxed">Describe what you want and I'll generate the Mermaid code.</p>
        
        <div class="flex flex-wrap justify-center gap-2">
          <button
            class="rounded-full border border-border bg-muted/30 px-3 py-1.5 text-xs text-foreground transition-all hover:border-primary/30 hover:bg-primary/10"
            onclick={() => {
              inputText = 'Create a login flow diagram';
              sendMessage();
            }}
          >
            Login flow
          </button>
          <button
            class="rounded-full border border-border bg-muted/30 px-3 py-1.5 text-xs text-foreground transition-all hover:border-primary/30 hover:bg-primary/10"
            onclick={() => {
              inputText = 'Create a database ER diagram for a blog';
              sendMessage();
            }}
          >
            Blog ER diagram
          </button>
          <button
            class="rounded-full border border-border bg-muted/30 px-3 py-1.5 text-xs text-foreground transition-all hover:border-primary/30 hover:bg-primary/10"
            onclick={() => {
              inputText = 'Create a CI/CD pipeline diagram';
              sendMessage();
            }}
          >
            CI/CD pipeline
          </button>
        </div>
      </div>
    {/if}

    {#each messages as msg}
      <div class="flex items-start gap-3">
        <div class="flex size-7 shrink-0 items-center justify-center rounded-full border border-border bg-muted shadow-sm mt-0.5">
          {#if msg.role === 'user'}
            <UserIcon class="size-3.5" />
          {:else}
            <RobotIcon class="size-3.5 text-primary" />
          {/if}
        </div>
        
        <div class="flex-1 min-w-0">
          {#if msg.role === 'user'}
            <div class="bg-primary text-primary-foreground rounded-2xl rounded-tl-sm px-3.5 py-2 shadow-sm text-xs leading-relaxed max-w-[90%] break-words">
                {msg.content}
            </div>
          {:else}
            <div class="bg-muted/30 border border-border rounded-2xl rounded-tr-sm px-3.5 py-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] text-xs leading-relaxed">
              <pre class="overflow-x-auto rounded-lg border border-border bg-background/50 p-2.5 text-[11px] shadow-inner font-mono mt-1 mb-2 whitespace-pre-wrap break-words"><code>{msg.content}</code></pre>
              <Button
                size="sm"
                variant="secondary"
                class="h-7 text-[10px] gap-1.5 font-bold"
                onclick={() => insertCode(msg.content)}
              >
                <ContentCopyIcon class="size-3" />
                Insert into Editor
              </Button>
            </div>
          {/if}
        </div>
      </div>
    {/each}

    {#if isLoading}
      <div class="flex items-start gap-3">
        <div class="flex size-7 shrink-0 items-center justify-center rounded-full border border-border bg-muted shadow-sm mt-0.5">
            <RobotIcon class="size-3.5 text-primary" />
        </div>
        <div class="bg-muted/30 border border-border rounded-2xl rounded-tr-sm px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] h-9 flex items-center">
          <div class="flex gap-1">
            <span class="block size-1.5 animate-bounce rounded-full bg-primary opacity-60"></span>
            <span class="block size-1.5 animate-bounce rounded-full bg-primary opacity-60" style="animation-delay: 0.2s"></span>
            <span class="block size-1.5 animate-bounce rounded-full bg-primary opacity-60" style="animation-delay: 0.4s"></span>
          </div>
        </div>
      </div>
    {/if}

    {#if error}
      <div class="rounded-lg bg-destructive/10 p-2.5 text-xs text-destructive border border-destructive/20 shadow-sm mt-2">{error}</div>
    {/if}
  </div>

  <!-- Input -->
  <div class="flex items-end gap-2 border-t border-border bg-background/50 p-3 backdrop-blur-md">
    <textarea
      class="flex-1 resize-none rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/15 shadow-sm"
      placeholder="Wait what diagram should i compose?"
      bind:value={inputText}
      onkeydown={handleKeydown}
      rows="2"
    ></textarea>
    <Button size="icon" class="size-9 rounded-xl shadow-sm shrink-0 mb-0.5 bg-primary hover:bg-primary/90 text-primary-foreground" onclick={sendMessage} disabled={isLoading || !inputText.trim()}>
      {#if isLoading}
        <div class="size-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent"></div>
      {:else}
        <SendIcon class="size-4" />
      {/if}
    </Button>
  </div>
</div>
