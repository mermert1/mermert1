<script lang="ts">
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { setToken, getToken, validateUserAccess, logout } from '$lib/github/api';
    import { page } from '$app/stores';

    export let data: any; // We'll type this better later if needed

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
                const response = await fetch(`https://graphi-cms-oauth.thatzane.workers.dev/callback?code=${code}`);
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
        window.addEventListener('message', async (event) => {
            if (event.data && typeof event.data === 'string' && event.data.startsWith('authorization:github:success:')) {
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
                    console.error("Failed to parse auth token", e);
                }
            }
        }, false);
    });

    function handleLogin() {
        // Open OAuth in popup like Static CMS
        const authWindow = window.open(OAUTH_WORKER_URL, "Auth", "width=800,height=600");
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

<div class="min-h-screen bg-background text-foreground font-sans flex flex-col">
    <!-- Header -->
    <header class="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-30">
        <div class="container mx-auto px-4 h-16 flex items-center justify-between">
            <div class="flex items-center gap-3">
                <img src="/graphi-logo.png" alt="Graphi Logo" class="w-8 h-8 rounded" />
                <h1 class="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">Graphi CMS</h1>
            </div>
            
            {#if isAuthenticated}
                <div class="flex items-center gap-4">
                    <nav class="hidden md:flex gap-1">
                        <a href="/admin" class="px-3 py-2 text-sm font-medium rounded-md {$page.url.pathname === '/admin' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'}">Dashboard</a>
                        <a href="/admin/docs" class="px-3 py-2 text-sm font-medium rounded-md {$page.url.pathname.includes('/admin/docs') ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'}">Content</a>
                        <a href="/admin/users" class="px-3 py-2 text-sm font-medium rounded-md {$page.url.pathname.includes('/admin/users') ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'}">Access</a>
                    </nav>
                    <div class="h-6 w-px bg-border mx-2"></div>
                    <button class="text-sm font-medium text-muted-foreground hover:text-destructive transition-colors" on:click={handleLogout}>
                        <i class="fas fa-sign-out-alt mr-2"></i>Sign Out
                    </button>
                </div>
            {/if}
        </div>
    </header>

    <!-- Main Content Area -->
    <main class="flex-grow container mx-auto p-4 md:p-8">
        {#if isCheckingAuth}
            <div class="flex items-center justify-center h-[60vh]">
                <div class="flex flex-col items-center gap-4">
                    <i class="fas fa-circle-notch fa-spin text-4xl text-primary"></i>
                    <p class="text-muted-foreground animate-pulse">Authenticating with GitHub...</p>
                </div>
            </div>
        {:else if !isAuthenticated}
            <div class="flex items-center justify-center h-[60vh]">
                <div class="max-w-md w-full bg-card border border-border rounded-xl p-8 shadow-xl relative overflow-hidden">
                    <div class="absolute inset-0 bg-gradient-to-br from-primary/5 to-purple-500/5 -z-10"></div>
                    
                    <div class="text-center mb-8">
                        <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4 ring-1 ring-primary/20">
                            <i class="fab fa-github text-3xl text-primary"></i>
                        </div>
                        <h2 class="text-2xl font-bold mb-2">Editor Login</h2>
                        <p class="text-muted-foreground text-sm">Access to the Graphi CMS requires an authorized GitHub account.</p>
                    </div>

                    {#if authError}
                        <div class="mb-6 p-4 bg-destructive/10 text-destructive border border-destructive/20 rounded-lg text-sm text-center">
                            <i class="fas fa-exclamation-triangle mr-2"></i> {authError}
                        </div>
                    {/if}

                    <button class="w-full flex items-center justify-center gap-3 py-3 px-4 bg-[#24292e] hover:bg-[#2f363d] text-white font-medium rounded-lg transition-all shadow-[0_0_15px_rgba(0,0,0,0.2)] hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] active:scale-[0.98]" on:click={handleLogin}>
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
