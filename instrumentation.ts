// Ensure all server-side fetch calls include credentials by default
export async function register() {
  if (typeof globalThis.fetch !== 'function') {
    return;
  }

  const originalFetch = globalThis.fetch;

  // Avoid re-wrapping if already wrapped
  if ((originalFetch as any).__withCredentialsWrapped) {
    return;
  }

  const wrappedFetch: typeof fetch = (input: RequestInfo | URL, init?: RequestInit) => {
    const nextInit: RequestInit = {
      ...init,
      credentials: init?.credentials ?? 'include'
    };
    return originalFetch(input as any, nextInit as any);
  };

  (wrappedFetch as any).__withCredentialsWrapped = true;
  // @ts-expect-error override global fetch
  globalThis.fetch = wrappedFetch;
}


