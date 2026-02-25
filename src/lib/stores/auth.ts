import { browser } from '$app/environment';
import {
  logout as apiLogout,
  setToken as apiSetToken,
  getToken,
  validateUserAccess
} from '$lib/github/api';
import { writable } from 'svelte/store';

export const isAuthenticated = writable(false);
export const isCheckingAuth = writable(true);

let authListenerAdded = false;

export async function checkAuth() {
  if (!browser) return;
  isCheckingAuth.set(true);

  const token = getToken();
  if (token) {
    const isAuthorized = await validateUserAccess();
    if (isAuthorized) {
      isAuthenticated.set(true);
    } else {
      apiLogout();
      isAuthenticated.set(false);
    }
  } else {
    isAuthenticated.set(false);
  }
  isCheckingAuth.set(false);
}

export function logout() {
  apiLogout();
  isAuthenticated.set(false);
}

const OAUTH_WORKER_URL = 'https://graphi-cms-oauth.thatzane.workers.dev/auth';

export function login() {
  window.open(OAUTH_WORKER_URL, 'Auth', 'width=800,height=600');
}

export function initAuthListener(onAuthError?: (err: string) => void, onAuthSuccess?: () => void) {
  if (!browser || authListenerAdded) return;
  authListenerAdded = true;

  window.addEventListener('message', async (event) => {
    // Handshake
    if (event.data === 'authorizing:github') {
      (event.source as Window).postMessage('authorization:github:ready', event.origin);
      return;
    }

    // Success payload
    if (
      event.data &&
      typeof event.data === 'string' &&
      event.data.startsWith('authorization:github:success:')
    ) {
      const jsonStr = event.data.substring('authorization:github:success:'.length);
      try {
        const payload = JSON.parse(jsonStr);
        if (payload.token) {
          apiSetToken(payload.token);

          isCheckingAuth.set(true);
          const isAuthorized = await validateUserAccess();
          if (isAuthorized) {
            isAuthenticated.set(true);
            if (onAuthSuccess) onAuthSuccess();
          } else {
            apiLogout();
            isAuthenticated.set(false);
            if (onAuthError)
              onAuthError('Your GitHub account is not authorized in cms-config.json.');
          }
          isCheckingAuth.set(false);
        }
      } catch (e) {
        console.error('Failed to parse auth token', e);
      }
    }
  });
}
