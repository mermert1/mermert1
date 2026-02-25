import { browser } from '$app/environment';
import { Octokit } from 'octokit';

const REPO_OWNER = 'mermert1';
const REPO_NAME = 'mermert1';
const GITHUB_TOKEN_KEY = 'cms_github_token';

// Use local storage to persist the token
export function setToken(token: string) {
    if (browser) {
        localStorage.setItem(GITHUB_TOKEN_KEY, token);
    }
}

export function getToken(): string | null {
    if (browser) {
        return localStorage.getItem(GITHUB_TOKEN_KEY);
    }
    return null;
}

export function logout() {
    if (browser) {
        localStorage.removeItem(GITHUB_TOKEN_KEY);
    }
}

// Get an authenticated Octokit instance
function getClient(): Octokit {
    const token = getToken();
    if (!token) throw new Error('Not authenticated');
    return new Octokit({ auth: token });
}

// --- GitHub API Operations ---

/**
 * Validates if the currently authenticated user is in cms-config.json
 */
export async function validateUserAccess(): Promise<boolean> {
    try {
        const client = getClient();

        // 1. Get current user's username
        const { data: user } = await client.rest.users.getAuthenticated();

        // 2. Fetch cms-config.json from the repo
        const response = await fetch('/src/content/cms-config.json');
        if (!response.ok) return false;

        const config = await response.json();

        // 3. Check if username exists in the authorized list
        return config.authorizedUsers.includes(user.login);
    } catch (e) {
        console.error('Access validation failed:', e);
        return false;
    }
}

/**
 * Fetches the contents of a directory (e.g., getting list of docs)
 */
export async function getDirectoryContents(path: string) {
    const client = getClient();
    const { data } = await client.rest.repos.getContent({
        owner: REPO_OWNER,
        repo: REPO_NAME,
        path: path,
    });
    return Array.isArray(data) ? data : [data];
}

/**
 * Fetches a single raw file
 */
export async function getFileContent(path: string): Promise<{ content: string; sha: string }> {
    const client = getClient();
    const { data } = await client.rest.repos.getContent({
        owner: REPO_OWNER,
        repo: REPO_NAME,
        path: path,
    });

    if (!Array.isArray(data) && data.type === 'file' && data.content) {
        // GitHub API returns content as base64
        const content = atob(data.content);
        return { content, sha: data.sha };
    }
    throw new Error('Not a file or file is empty');
}

/**
 * Commits a file creation or update to the repository
 */
export async function commitFile(path: string, content: string, commitMessage: string, sha?: string) {
    const client = getClient();

    // GitHub API requires base64 encoded content for commits
    const base64Content = btoa(unescape(encodeURIComponent(content)));

    await client.rest.repos.createOrUpdateFileContents({
        owner: REPO_OWNER,
        repo: REPO_NAME,
        path: path,
        message: commitMessage,
        content: base64Content,
        sha: sha // Required if updating an existing file
    });
}

/**
 * Deletes a file from the repository
 */
export async function deleteFile(path: string, commitMessage: string, sha: string) {
    const client = getClient();
    await client.rest.repos.deleteFile({
        owner: REPO_OWNER,
        repo: REPO_NAME,
        path: path,
        message: commitMessage,
        sha: sha
    });
}
