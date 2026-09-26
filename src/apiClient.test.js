import { getSession, setSession, clearSession, loginWithApi, apiFetch } from './apiClient';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('Shared Session Module', () => {
  beforeEach(() => {
    const store = {};
    global.localStorage = {
      getItem: vi.fn(key => store[key] || null),
      setItem: vi.fn((key, value) => { store[key] = value.toString(); }),
      removeItem: vi.fn(key => { delete store[key]; })
    };
    clearSession();
    global.fetch = vi.fn();
  });

  it('should store and clear session in memory', () => {
    expect(getSession()).toBeNull();
    setSession('mock_token', { name: 'Test' });
    expect(getSession()).toEqual({ token: 'mock_token', user: { name: 'Test' } });
    clearSession();
    expect(getSession()).toBeNull();
  });

  it('loginWithApi should throw specific error on failure', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: async () => ({ message: 'Invalid credentials' }),
    });

    try {
      await loginWithApi('test@test.com', 'pass', 'http://gateway');
      expect.fail('Should have thrown an error');
    } catch (error) {
      expect(error.status).toBe(401);
      expect(error.message).toBe('Invalid credentials');
    }
  });

  it('apiFetch should attach Authorization header when session exists', async () => {
    global.fetch.mockResolvedValueOnce({ ok: true });
    setSession('secret_token', { name: 'User' });
    
    await apiFetch('http://api/test');
    
    expect(global.fetch).toHaveBeenCalledWith('http://api/test', expect.objectContaining({
      headers: expect.any(Headers)
    }));
    
    const passedHeaders = global.fetch.mock.calls[0][1].headers;
    expect(passedHeaders.get('Authorization')).toBe('Bearer secret_token');
  });

  it('apiFetch should not attach Authorization header when session does not exist', async () => {
    global.fetch.mockResolvedValueOnce({ ok: true, status: 200 });
    clearSession();
    
    await apiFetch('http://api/test');
    
    expect(global.fetch).toHaveBeenCalledWith('http://api/test', expect.objectContaining({
      headers: expect.any(Headers)
    }));
    
    const passedHeaders = global.fetch.mock.calls[0][1].headers;
    expect(passedHeaders.has('Authorization')).toBe(false);
  });
});
