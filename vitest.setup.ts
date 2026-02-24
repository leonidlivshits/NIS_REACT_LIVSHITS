const _store: Record<string, string> = {};
Object.defineProperty(globalThis, 'localStorage', {
  value: {
    getItem: (k: string) => (_store.hasOwnProperty(k) ? _store[k] : null),
    setItem: (k: string, v: string) => { _store[k] = String(v); },
    removeItem: (k: string) => { delete _store[k]; },
    clear: () => { for (const k in _store) delete _store[k]; },
  },
  configurable: true,
  enumerable: true,
});

(globalThis as any).__APP_API_BASE_URL = process.env.TEST_API_BASE_URL ?? 'http://localhost:3001';