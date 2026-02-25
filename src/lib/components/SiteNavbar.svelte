<script lang="ts">
  import { base } from '$app/paths';
  import { Button } from '$/components/ui/button';
  import {
    Share2,
    Github,
    Sun,
    Moon,
    Menu,
    X,
    LogIn,
    LogOut,
    LayoutDashboard
  } from 'lucide-svelte';
  import { mode, setMode } from 'mode-watcher';
  import { isAuthenticated, login, logout } from '$lib/stores/auth';

  let isMobileMenuOpen = false;

  function toggleMobileMenu() {
    isMobileMenuOpen = !isMobileMenuOpen;
  }
</script>

<nav
  class="sticky top-0 z-50 w-full border-b border-border bg-background/80 shadow-sm backdrop-blur-md">
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <div class="flex h-16 items-center justify-between">
      <!-- Logo -->
      <a href="{base}/" class="flex flex-shrink-0 cursor-pointer items-center gap-2">
        <div
          class="flex h-8 w-8 rotate-3 transform items-center justify-center rounded-lg bg-indigo-600 transition-transform hover:rotate-6">
          <Share2 class="h-5 w-5 text-white" />
        </div>
        <span class="text-xl font-bold tracking-tight text-foreground">Graphi</span>
      </a>

      <!-- Desktop Navigation -->
      <div class="hidden items-center space-x-6 md:flex">
        <a
          href="{base}/"
          class="font-medium text-muted-foreground transition-colors hover:text-primary">Home</a>
        <a
          href="{base}/#features"
          class="font-medium text-muted-foreground transition-colors hover:text-primary"
          >Features</a>
        <a
          href="{base}/#downloads"
          class="font-medium text-muted-foreground transition-colors hover:text-primary"
          >Downloads</a>
        <a
          href="{base}/docs"
          class="font-medium text-muted-foreground transition-colors hover:text-primary"
          >Documentation</a>

        {#if $isAuthenticated}
          <a
            href="{base}/admin"
            class="flex items-center gap-1 font-medium text-muted-foreground transition-colors hover:text-primary">
            <LayoutDashboard class="h-4 w-4" /> Admin
          </a>
        {/if}

        <div class="h-6 w-px bg-border"></div>

        <!-- Theme Toggle -->
        <Button
          variant="ghost"
          size="icon"
          onclick={() => setMode($mode === 'dark' ? 'light' : 'dark')}
          class="text-muted-foreground transition-colors hover:text-foreground">
          {#if $mode === 'dark'}
            <Sun class="h-5 w-5" />
          {:else}
            <Moon class="h-5 w-5" />
          {/if}
        </Button>

        <a
          href="https://github.com/mermert1/mermert1"
          target="_blank"
          class="flex items-center gap-2 font-medium text-foreground transition-colors hover:text-primary">
          <Github class="h-4 w-4" /> GitHub
        </a>
        <Button
          href="{base}/edit/"
          class="h-auto rounded-full bg-primary px-5 py-2.5 font-medium text-primary-foreground shadow-sm transition-all hover:opacity-90 hover:shadow-md">
          Open Editor
        </Button>
        {#if $isAuthenticated}
          <Button
            variant="ghost"
            size="sm"
            onclick={logout}
            class="text-muted-foreground hover:text-destructive">
            <LogOut class="mr-2 h-4 w-4" /> Logout
          </Button>
        {:else}
          <Button
            variant="ghost"
            size="sm"
            onclick={login}
            class="text-muted-foreground hover:text-primary">
            <LogIn class="mr-2 h-4 w-4" /> Login
          </Button>
        {/if}
      </div>

      <!-- Mobile Menu Button -->
      <div class="flex items-center md:hidden">
        <button
          on:click={toggleMobileMenu}
          class="p-2 text-muted-foreground hover:text-foreground focus:outline-none">
          {#if isMobileMenuOpen}
            <X class="h-6 w-6" />
          {:else}
            <Menu class="h-6 w-6" />
          {/if}
        </button>
      </div>
    </div>
  </div>

  <!-- Mobile Menu -->
  {#if isMobileMenuOpen}
    <div class="absolute w-full border-b border-border bg-background shadow-lg md:hidden">
      <div class="space-y-1 px-4 pt-2 pb-4">
        <a
          href="{base}/"
          on:click={toggleMobileMenu}
          class="block rounded-md px-3 py-2 text-base font-medium text-muted-foreground hover:bg-muted hover:text-primary"
          >Home</a>
        <a
          href="{base}/#features"
          on:click={toggleMobileMenu}
          class="block rounded-md px-3 py-2 text-base font-medium text-muted-foreground hover:bg-muted hover:text-primary"
          >Features</a>
        <a
          href="{base}/#downloads"
          on:click={toggleMobileMenu}
          class="block rounded-md px-3 py-2 text-base font-medium text-muted-foreground hover:bg-muted hover:text-primary"
          >Downloads</a>
        <a
          href="{base}/docs"
          on:click={toggleMobileMenu}
          class="block rounded-md px-3 py-2 text-base font-medium text-muted-foreground hover:bg-muted hover:text-primary"
          >Documentation</a>
        {#if $isAuthenticated}
          <a
            href="{base}/admin"
            on:click={toggleMobileMenu}
            class="block rounded-md px-3 py-2 text-base font-medium text-muted-foreground hover:bg-muted hover:text-primary"
            >Admin</a>
        {/if}
        <div class="my-2 border-t border-border pt-2">
          <a
            href="https://github.com/mermert1/mermert1"
            target="_blank"
            class="block flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-base font-medium text-muted-foreground hover:bg-muted hover:text-primary">
            <Github class="h-4 w-4" /> GitHub
          </a>
          <Button
            href="{base}/edit/"
            class="mt-2 h-auto w-full rounded-md bg-indigo-600 px-3 py-2 text-center text-base font-medium text-white hover:bg-indigo-700">
            Open Editor
          </Button>
          {#if $isAuthenticated}
            <button
              on:click={() => {
                logout();
                toggleMobileMenu();
              }}
              class="mt-2 flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-base font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive">
              <LogOut class="h-4 w-4" /> Logout
            </button>
          {:else}
            <button
              on:click={() => {
                login();
                toggleMobileMenu();
              }}
              class="mt-2 flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-base font-medium text-muted-foreground hover:bg-muted hover:text-primary">
              <LogIn class="h-4 w-4" /> Login
            </button>
          {/if}
        </div>
      </div>
    </div>
  {/if}
</nav>
