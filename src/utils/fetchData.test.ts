// fetchData.test.ts
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { fetchData } from './fetchData';

describe('fetchData', () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should return data when fetch succeeds', async () => {
    const mockData = { value: 42 };
    (fetch as any).mockResolvedValue({
      ok: true,
      json: async () => mockData,
    });

    const data = await fetchData('/api/test');
    expect(data).toEqual(mockData);
    expect(fetch).toHaveBeenCalledWith('/api/test');
  });

  it('should throw error when fetch fails', async () => {
    (fetch as any).mockResolvedValue({ ok: false });

    await expect(fetchData('/api/test')).rejects.toThrow('Network error');
  });
});
