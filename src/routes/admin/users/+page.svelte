<script lang="ts">
    import { onMount } from 'svelte';
    import { getFileContent, commitFile } from '$lib/github/api';

    let authorizedUsers: string[] = [];
    let newUser = '';
    let isLoading = true;
    let isSaving = false;
    let error = '';
    let successMessage = '';
    let configSha = ''; // Needed to update the file in GitHub

    const CONFIG_PATH = 'src/content/cms-config.json';

    onMount(async () => {
        try {
            // Because we are fetching raw from the repo via API, we always get the latest master version
            const { content, sha } = await getFileContent(CONFIG_PATH);
            const config = JSON.parse(content);
            authorizedUsers = config.authorizedUsers || [];
            configSha = sha;
        } catch (e) {
            error = 'Failed to load user configuration from GitHub.';
            console.error(e);
        } finally {
            isLoading = false;
        }
    });

    async function saveUsers() {
        isSaving = true;
        error = '';
        successMessage = '';
        
        try {
            const updatedConfig = { authorizedUsers };
            const contentString = JSON.stringify(updatedConfig, null, 2);
            
            await commitFile(
                CONFIG_PATH, 
                contentString, 
                `chore(cms): update authorized users list`, 
                configSha
            );
            
            // Re-fetch to get the new SHA so subsequent saves don't fail
            const { sha } = await getFileContent(CONFIG_PATH);
            configSha = sha;
            
            successMessage = 'Successfully saved users to GitHub repository!';
            setTimeout(() => successMessage = '', 3000);
        } catch (e) {
            error = 'Failed to push changes to GitHub.';
            console.error(e);
        } finally {
            isSaving = false;
        }
    }

    function addUser() {
        if (newUser && !authorizedUsers.includes(newUser)) {
            authorizedUsers = [...authorizedUsers, newUser.trim()];
            newUser = '';
        }
    }

    function removeUser(user: string) {
        authorizedUsers = authorizedUsers.filter(u => u !== user);
    }
</script>

<div class="max-w-4xl mx-auto">
    <div class="flex items-center justify-between mb-8">
        <div>
            <h1 class="text-3xl font-bold mb-2">Access Control</h1>
            <p class="text-muted-foreground">Manage which GitHub accounts are authorized to access the CMS.</p>
        </div>
        <button 
            class="px-4 py-2 bg-primary text-primary-foreground font-medium rounded-md hover:bg-primary/90 disabled:opacity-50 transition-colors flex items-center gap-2"
            on:click={saveUsers}
            disabled={isSaving || isLoading}
        >
            {#if isSaving}
                <i class="fas fa-spinner fa-spin"></i> Saving to Git...
            {:else}
                <i class="fas fa-save"></i> Save Changes
            {/if}
        </button>
    </div>

    {#if error}
        <div class="mb-4 p-4 border border-destructive/20 bg-destructive/10 text-destructive rounded-lg flex items-center gap-2">
            <i class="fas fa-exclamation-triangle"></i> {error}
        </div>
    {/if}

    {#if successMessage}
        <div class="mb-4 p-4 border border-green-500/20 bg-green-500/10 text-green-500 rounded-lg flex items-center gap-2">
            <i class="fas fa-check-circle"></i> {successMessage}
        </div>
    {/if}

    <div class="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
        <div class="p-6 border-b border-border">
            <h2 class="text-lg font-semibold mb-1">Authorized GitHub Accounts</h2>
            <p class="text-sm text-muted-foreground mb-4">Users must log in with these exact GitHub usernames to gain access. Role permission splitting is currently not supported.</p>
            
            <form on:submit|preventDefault={addUser} class="flex gap-2 max-w-md">
                <input 
                    type="text" 
                    bind:value={newUser}
                    placeholder="Enter GitHub username (e.g. torvalds)"
                    class="flex-1 px-3 py-2 bg-background border border-input rounded-md focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                />
                <button type="submit" class="px-4 py-2 bg-secondary text-secondary-foreground font-medium rounded-md hover:bg-secondary/80 transition-colors">
                    Add User
                </button>
            </form>
        </div>

        {#if isLoading}
            <div class="p-8 flex justify-center text-muted-foreground">
                <i class="fas fa-circle-notch fa-spin text-2xl"></i>
            </div>
        {:else}
            <ul class="divide-y divide-border">
                {#each authorizedUsers as user}
                    <li class="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors group">
                        <div class="flex items-center gap-3">
                            <!-- Optional: try to fetch GitHub avatar via their public URL -->
                            <img src="https://github.com/{user}.png?size=40" alt="{user}'s avatar" class="w-10 h-10 rounded-full bg-muted" on:error={(e) => e.currentTarget.style.display='none'}/>
                            <div>
                                <span class="font-medium">{user}</span>
                                <a href="https://github.com/{user}" target="_blank" class="text-xs text-primary block hover:underline">View Profile</a>
                            </div>
                        </div>
                        <button 
                            class="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded transition-colors opacity-0 group-hover:opacity-100"
                            on:click={() => removeUser(user)}
                            title="Remove User"
                        >
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </li>
                {/each}
                
                {#if authorizedUsers.length === 0}
                    <li class="p-8 text-center text-muted-foreground">
                        No users authorized. CMS is currently locked out.
                    </li>
                {/if}
            </ul>
        {/if}
    </div>
</div>
