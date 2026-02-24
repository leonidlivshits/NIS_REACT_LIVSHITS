import { describe, it, expect, vi, beforeEach } from 'vitest';
import { setupApiStore } from '../../test/utils';
import { api } from '../../app/api/apiSlice';
import authReducer from './authSlice';

beforeEach(() => {
  vi.resetAllMocks();
});

describe('login mutation', () => {
  it('should send login request and handle success', async () => {
    const mockUser = { id: 1, username: 'kminchelle', email: 'kminchelle@qq.com' };
    const mockToken = 'mock-token';

    const responseBody = { ...mockUser, token: mockToken };
    const response = new Response(JSON.stringify(responseBody), {
      status: 200,
      statusText: 'OK',
      headers: { 'Content-Type': 'application/json' },
    });

    global.fetch = vi.fn().mockResolvedValue(response);

    const storeRef = setupApiStore(api, { auth: authReducer });

    const result = await storeRef.store.dispatch(
      api.endpoints.login.initiate({ username: 'test', password: 'test' })
    );

    expect(fetch).toHaveBeenCalledTimes(1);
    const fetchCall = (fetch as any).mock.calls[0][0];
    if (typeof fetchCall === 'string') {
      expect(fetchCall).toContain('/auth/login');
    } else {
      expect(fetchCall.url).toContain('/auth/login');
    }

    expect(result.data).toEqual(responseBody);
  });

  it('should handle login error', async () => {
    const errorResponse = new Response(JSON.stringify({ message: 'Invalid credentials' }), {
      status: 401,
      statusText: 'Unauthorized',
      headers: { 'Content-Type': 'application/json' },
    });

    global.fetch = vi.fn().mockResolvedValue(errorResponse);

    const storeRef = setupApiStore(api, { auth: authReducer });

    const result = await storeRef.store.dispatch(
      api.endpoints.login.initiate({ username: 'wrong', password: 'wrong' })
    );

    expect(result.error).toBeDefined();
    const errorStatus = (result.error as any)?.originalStatus || (result.error as any)?.status;
    expect(errorStatus).toBe(401);
  });
});