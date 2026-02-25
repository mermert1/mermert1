<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { setToken, getToken, validateUserAccess, logout } from '$lib/github/api';
  import { page } from '$app/stores';

  let isCheckingAuth = true;
  let isAuthenticated = false;
  let authError = '';

  // Constants for OAuth Flow
  const OAUTH_WORKER_URL = 'https://graphi-cms-oauth.thatzane.workers.dev/auth';

  onMount(async () => {
    // 1. Check if returning from OAuth flow via URL params
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code) {
      isCheckingAuth = true;
      try {
        // Exchange code for token directly by mimicking Static CMS postMessage flow
        // BUT since we are on the same origin as the redirect, we can just call our worker
        const response = await fetch(
          `https://graphi-cms-oauth.thatzane.workers.dev/callback?code=${code}`
        );
        const htmlResponse = await response.text();

        // Extract the token from the injected postMessage script the worker returns
        const tokenMatch = htmlResponse.match(/"token":"([^"]+)"/);

        if (tokenMatch && tokenMatch[1]) {
          const token = tokenMatch[1];
          setToken(token);

          // Immediately clean the URL
          window.history.replaceState({}, document.title, '/admin');

          // Validate authorization
          const isAuthorized = await validateUserAccess();
          if (!isAuthorized) {
            logout();
            authError = 'Your GitHub account is not authorized in cms-config.json.';
            isAuthenticated = false;
          } else {
            isAuthenticated = true;
          }
        } else {
          authError = 'Failed to extract GitHub token from auth provider.';
        }
      } catch (err) {
        authError = 'Authentication handshake failed.';
        console.error(err);
      }
    } else {
      // 2. Normal initial load, check if already logged in
      const existingToken = getToken();
      if (existingToken) {
        const isAuthorized = await validateUserAccess();
        if (isAuthorized) {
          isAuthenticated = true;
        } else {
          logout();
          authError = 'Your session expired or you lost access.';
        }
      }
    }

    isCheckingAuth = false;

    // Listen for postMessage specifically if the worker opens a popup window
    window.addEventListener(
      'message',
      async (event) => {
        if (
          event.data &&
          typeof event.data === 'string' &&
          event.data.startsWith('authorization:github:success:')
        ) {
          const jsonStr = event.data.substring('authorization:github:success:'.length);
          try {
            const payload = JSON.parse(jsonStr);
            if (payload.token) {
              setToken(payload.token);

              const isAuthorized = await validateUserAccess();
              if (isAuthorized) {
                isAuthenticated = true;
                authError = '';
              } else {
                logout();
                authError = 'Your GitHub account is not authorized in cms-config.json.';
              }
            }
          } catch (e) {
            console.error('Failed to parse auth token', e);
          }
        }
      },
      false
    );
  });

  function handleLogin() {
    // Open OAuth in popup like Static CMS
    window.open(OAUTH_WORKER_URL, 'Auth', 'width=800,height=600');
  }

  function handleLogout() {
    logout();
    isAuthenticated = false;
    goto('/admin');
  }
</script>

<svelte:head>
  <title>Graphi CMS</title>
</svelte:head>

<div class="flex min-h-screen flex-col bg-background font-sans text-foreground">
  <!-- Header -->
  <header class="sticky top-0 z-30 border-b border-border bg-card/50 backdrop-blur-sm">
    <div class="container mx-auto flex h-16 items-center justify-between px-4">
      <div class="flex items-center gap-3">
        <img src="/graphi-logo.png" alt="Graphi Logo" class="h-8 w-8 rounded" />
        <h1
          class="bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-xl font-bold text-transparent">
          Graphi CMS
        </h1>
      </div>

      {#if isAuthenticated}
        <div class="flex items-center gap-4">
          <nav class="hidden gap-1 md:flex">
            <a
              href="/admin"
              class="rounded-md px-3 py-2 text-sm font-medium {$page.url.pathname === '/admin'
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'}">Dashboard</a>
            <a
              href="/admin/docs"
              class="rounded-md px-3 py-2 text-sm font-medium {$page.url.pathname.includes(
                '/admin/docs'
              )
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'}">Content</a>
            <a
              href="/admin/users"
              class="rounded-md px-3 py-2 text-sm font-medium {$page.url.pathname.includes(
                '/admin/users'
              )
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'}">Access</a>
          </nav>
          <div class="mx-2 h-6 w-px bg-border"></div>
          <button
            class="text-sm font-medium text-muted-foreground transition-colors hover:text-destructive"
            on:click={handleLogout}>
            <i class="fas fa-sign-out-alt mr-2"></i>Sign Out
          </button>
        </div>
      {/if}
    </div>
  </header>

  <!-- Main Content Area -->
  <main class="container mx-auto flex-grow p-4 md:p-8">
    {#if isCheckingAuth}
      <div class="flex h-[60vh] items-center justify-center">
        <div class="flex flex-col items-center gap-4">
          <i class="fas fa-circle-notch fa-spin text-4xl text-primary"></i>
          <p class="animate-pulse text-muted-foreground">Authenticating with GitHub...</p>
        </div>
      </div>
    {:else if !isAuthenticated}
      <div class="flex h-[60vh] items-center justify-center">
        <div
          class="relative w-full max-w-md overflow-hidden rounded-xl border border-border bg-card p-8 shadow-xl">
          <div class="absolute inset-0 -z-10 bg-gradient-to-br from-primary/5 to-purple-500/5">
          </div>

          <div class="mb-8 text-center">
            <div
              class="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 ring-1 ring-primary/20">
              <i class="fab fa-github text-3xl text-primary"></i>
            </div>
            <h2 class="mb-2 text-2xl font-bold">Editor Login</h2>
            <p class="text-sm text-muted-foreground">
              Access to the Graphi CMS requires an authorized GitHub account.
            </p>
          </div>

          {#if authError}
            <div
              class="mb-6 rounded-lg border border-destructive/20 bg-destructive/10 p-4 text-center text-sm text-destructive">
              <i class="fas fa-exclamation-triangle mr-2"></i>
              {authError}
            </div>
          {/if}

          <button
            class="flex w-full items-center justify-center gap-3 rounded-lg bg-[#24292e] px-4 py-3 font-medium text-white shadow-[0_0_15px_rgba(0,0,0,0.2)] transition-all hover:bg-[#2f363d] hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] active:scale-[0.98]"
            on:click={handleLogin}>
            <i class="fab fa-github text-lg"></i>
            Authorize with GitHub
          </button>

          <div class="mt-6 text-center text-xs text-muted-foreground">
            <p>Powered by the GitHub API. No external databases.</p>
          </div>
        </div>
      </div>
    {:else}
      <!-- Render authenticated pages -->
      <slot />
    {/if}
  </main>
</div>
