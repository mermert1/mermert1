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

<div class="ai-sidebar">
  <!-- Header -->
  <div class="ai-header">
    <div class="ai-header-title">
      <SparklesIcon class="ai-icon text-primary" />
      <span>AI Assistant</span>
    </div>
    <div class="ai-header-actions">
      <button class="ai-btn-icon" onclick={() => (showSettings = !showSettings)} title="Settings" class:active={showSettings}>
        <SettingsIcon />
      </button>
      <button class="ai-btn-icon" onclick={clearChat} title="Clear chat">
        <DeleteIcon />
      </button>
      <button class="ai-btn-icon" onclick={onClose} title="Close">
         <CloseIcon />
      </button>
    </div>
  </div>

  <!-- Settings Panel -->
  {#if showSettings}
    <div class="ai-settings glass-subtle">
      <div class="ai-settings-field">
        <span class="ai-label">Provider</span>
        <div class="custom-select-container">
          <button class="custom-select-trigger" onclick={() => showProviderDropdown = !showProviderDropdown}>
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
            <div class="custom-select-options">
              {#each providers as p}
                <button 
                  class="custom-option" 
                  class:selected={provider === p.value}
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

      <div class="ai-settings-field">
        <label for="ai-key" class="ai-label">
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
          class="custom-input"
          placeholder={provider === 'gemini' ? 'AIza...' : provider === 'groq' ? 'gsk_...' : 'sk-...'}
          bind:value={apiKey}
        />
      </div>

      <div class="ai-settings-field">
        <label for="ai-model" class="ai-label">Model</label>
         <div class="custom-select-container">
            <button class="custom-select-trigger" onclick={() => showModelDropdown = !showModelDropdown}>
              <span>{models[provider]?.find(m => m.value === model)?.label || model}</span>
              <ChevronDownIcon class="size-4 opacity-50" />
            </button>
            
            {#if showModelDropdown}
              <div class="custom-select-options">
                {#each models[provider] || [] as m}
                  <button 
                    class="custom-option" 
                    class:selected={model === m.value}
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

      <div class="ai-settings-actions">
        <Button size="sm" onclick={saveSettings} class="w-full">Save Settings</Button>
      </div>
    </div>
  {/if}

  <!-- Messages -->
  <div class="ai-messages">
    {#if messages.length === 0}
      <div class="ai-welcome">
        <p class="ai-welcome-title flex flex-col items-center gap-2">
            <SparklesIcon class="size-8 text-primary/50" />
            Text to Diagram
        </p>
        <p class="ai-welcome-text">Describe what you want and I'll generate the Mermaid code.</p>
        <div class="ai-suggestions">
          <button
            class="ai-suggestion"
            onclick={() => {
              inputText = 'Create a login flow diagram';
              sendMessage();
            }}
          >
            Login flow
          </button>
          <button
            class="ai-suggestion"
            onclick={() => {
              inputText = 'Create a database ER diagram for a blog';
              sendMessage();
            }}
          >
            Blog ER diagram
          </button>
          <button
            class="ai-suggestion"
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
      <div class="ai-message ai-message-{msg.role}">
        <div class="ai-message-avatar shadow-sm">
          {#if msg.role === 'user'}
            <UserIcon class="size-4" />
          {:else}
            <RobotIcon class="size-4 text-primary" />
          {/if}
        </div>
        <div class="ai-message-content" class:shadow-md={msg.role === 'user'}>
          {#if msg.role === 'assistant'}
            <pre class="ai-code-block shadow-inner"><code>{msg.content}</code></pre>
            <Button
              size="sm"
              class="ai-insert-btn"
              onclick={() => insertCode(msg.content)}
            >
              <ContentCopyIcon class="mr-2 size-3" />
              Insert into Editor
            </Button>
          {:else}
            <p>{msg.content}</p>
          {/if}
        </div>
      </div>
    {/each}

    {#if isLoading}
      <div class="ai-message ai-message-assistant">
        <div class="ai-message-avatar">
            <RobotIcon class="size-4 text-primary" />
        </div>
        <div class="ai-message-content">
          <div class="ai-loading">
            <span class="ai-dot"></span>
            <span class="ai-dot"></span>
            <span class="ai-dot"></span>
          </div>
        </div>
      </div>
    {/if}

    {#if error}
      <div class="ai-error shadow-sm">{error}</div>
    {/if}
  </div>

  <!-- Input -->
  <div class="ai-input-area">
    <textarea
      class="ai-input"
      placeholder="Describe your diagram..."
      bind:value={inputText}
      onkeydown={handleKeydown}
      rows="2"
    ></textarea>
    <Button size="sm" onclick={sendMessage} disabled={isLoading || !inputText.trim()}>
      {#if isLoading}
        ...
      {:else}
        <SendIcon class="size-4" />
      {/if}
    </Button>
  </div>
</div>

<style>
  .ai-sidebar {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 360px;
    background: var(--background);
    border-left: 1px solid var(--border);
    font-size: 0.875rem;
  }

  .ai-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem 1rem;
    border-bottom: 1px solid var(--border);
    background: var(--muted) / 0.3;
  }

  .ai-header-title {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: 600;
  }

  .ai-icon {
    font-size: 1.1rem;
  }

  .ai-header-actions {
    display: flex;
    gap: 0.25rem;
  }

  .ai-btn-icon {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.25rem 0.4rem;
    border-radius: 4px;
    font-size: 0.85rem;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.15s;
    color: hsl(var(--muted-foreground));
  }

  .ai-btn-icon:hover {
    background: var(--muted);
    color: var(--foreground);
  }

  /* Settings */
  .ai-settings {
    padding: 0.75rem 1rem;
    border-bottom: 1px solid var(--border);
    background: var(--muted) / 0.15;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .ai-settings-field {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
  }

  .ai-label {
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--muted-foreground);
    margin-bottom: 0.25rem;
  }

  .custom-select-container {
    position: relative;
    width: 100%;
  }

  .custom-select-trigger {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem 0.75rem;
    border: 1px solid hsl(var(--border));
    border-radius: 6px;
    background: var(--background);
    color: var(--foreground);
    font-size: 0.85rem;
    cursor: pointer;
    transition: all 0.2s;
  }

  .custom-select-trigger:hover {
    border-color: var(--primary) / 0.5;
  }

  .custom-select-options {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    margin-top: 4px;
    margin-top: 4px;
    background: var(--popover); 
    border: 1px solid var(--border);
    border-radius: 6px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    z-index: 50;
    overflow: hidden;
    padding: 4px;
  }

  .custom-option {
    width: 100%;
    display: flex;
    justify-content: space-between;
    padding: 0.5rem 0.75rem;
    cursor: pointer;
    border: none;
    background: transparent;
    color: var(--popover-foreground);
    font-size: 0.85rem;
    border-radius: 4px;
    text-align: left;
  }

  .custom-option:hover {
    background: var(--accent);
    color: var(--accent-foreground);
  }

  .custom-option.selected {
    background: var(--primary) / 0.1;
    color: var(--primary);
    font-weight: 500;
  }

  .custom-input {
    width: 100%;
    padding: 0.5rem 0.75rem;
    border: 1px solid var(--border);
    border-radius: 6px;
    background: var(--background);
    color: var(--foreground);
    font-size: 0.85rem;
    outline: none;
    transition: all 0.2s;
  }

  .custom-input:focus {
    border-color: var(--primary);
    box-shadow: 0 0 0 2px var(--primary) / 0.1;
  }

  .ai-settings-actions {
    display: flex;
    gap: 0.5rem;
    margin-top: 0.25rem;
  }

  /* Messages */
  .ai-messages {
    flex: 1;
    overflow-y: auto;
    padding: 0.75rem;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .ai-welcome {
    text-align: center;
    padding: 2rem 1rem;
    color: hsl(var(--muted-foreground));
  }

  .ai-welcome-title {
    font-size: 1.1rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: hsl(var(--foreground));
  }

  .ai-welcome-text {
    margin-bottom: 1.25rem;
  }

  .ai-suggestions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    justify-content: center;
  }

  .ai-suggestion {
    padding: 0.4rem 0.75rem;
    border: 1px solid hsl(var(--border));
    border-radius: 99px;
    background: hsl(var(--muted) / 0.3);
    color: hsl(var(--foreground));
    font-size: 0.75rem;
    cursor: pointer;
    transition: all 0.15s;
  }

  .ai-suggestion:hover {
    background: hsl(var(--primary) / 0.1);
    border-color: hsl(var(--primary) / 0.3);
  }

  .ai-message {
    display: flex;
    gap: 0.75rem;
    align-items: flex-start;
  }

  .ai-message-avatar {
    flex-shrink: 0;
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background: hsl(var(--muted));
    font-size: 0.8rem;
    border: 1px solid hsl(var(--border));
  }

  .ai-message-content {
    flex: 1;
    min-width: 0;
  }

  .ai-message-content p {
    margin: 0;
    line-height: 1.5;
  }

  /* User Message Bubble */
  .ai-message-user .ai-message-content {
    background: hsl(var(--primary));
    color: hsl(var(--primary-foreground));
    padding: 0.6rem 0.8rem;
    border-radius: 12px 12px 4px 12px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1); /* Drop shadow */
  }

  .ai-code-block {
    background: hsl(var(--muted) / 0.5);
    border: 1px solid hsl(var(--border));
    border-radius: 8px;
    padding: 0.6rem 0.75rem;
    overflow-x: auto;
    font-size: 0.78rem;
    line-height: 1.5;
    margin: 0;
  }

  .ai-code-block code {
    white-space: pre-wrap;
    word-break: break-word;
  }

  :global(.ai-insert-btn) {
    margin-top: 0.4rem;
  }

  /* Loading dots */
  .ai-loading {
    display: flex;
    gap: 4px;
    padding: 0.5rem 0;
  }

  .ai-dot {
    width: 6px;
    height: 6px;
    background: hsl(var(--primary));
    border-radius: 50%;
    animation: ai-bounce 1.2s infinite;
  }

  .ai-dot:nth-child(2) {
    animation-delay: 0.2s;
  }

  .ai-dot:nth-child(3) {
    animation-delay: 0.4s;
  }

  @keyframes ai-bounce {
    0%,
    80%,
    100% {
      transform: scale(0.6);
      opacity: 0.4;
    }
    40% {
      transform: scale(1);
      opacity: 1;
    }
  }

  .ai-error {
    color: hsl(var(--destructive));
    font-size: 0.8rem;
    padding: 0.5rem 0.75rem;
    background: hsl(var(--destructive) / 0.08);
    border-radius: 8px;
  }

  /* Input */
  .ai-input-area {
    display: flex;
    gap: 0.5rem;
    padding: 0.75rem;
    border-top: 1px solid hsl(var(--border));
    align-items: flex-end;
  }

  .ai-input {
    flex: 1;
    padding: 0.5rem 0.75rem;
    border: 1px solid hsl(var(--border));
    border-radius: 8px;
    background: hsl(var(--background));
    color: hsl(var(--foreground));
    font-size: 0.85rem;
    resize: none;
    font-family: inherit;
    line-height: 1.4;
  }

  .ai-input:focus {
    outline: none;
    border-color: hsl(var(--primary));
    box-shadow: 0 0 0 2px hsl(var(--primary) / 0.15);
  }
</style>
