import { getSession, setSession, clearSession, loginWithApi, apiFetch } from './core/http/apiClient.ts';
import test, { describe, it, beforeEach, mock } from 'node:test';
import assert from 'node:assert/strict';

describe('Shared Session Module', () => {
  beforeEach(() => {
    const store: Record<string, string> = {};
    global.localStorage = {
      getItem: mock.fn(key => store[key] || null),
      setItem: mock.fn((key, value) => { store[key] = value.toString(); }),
      removeItem: mock.fn(key => { delete store[key]; })
    } as any;
    clearSession();
    global.fetch = mock.fn();
  });

  it('should store and clear session in memory', () => {
    assert.equal(getSession(), null);
    setSession('mock_token', { name: 'Test' });
    assert.deepEqual(getSession(), { token: 'mock_token', user: { name: 'Test' } });
    clearSession();
    assert.equal(getSession(), null);
  });

  it('loginWithApi should throw specific error on failure', async () => {
    (global.fetch as any).mock.mockImplementationOnce(async () => ({
      ok: false,
      status: 401,
      json: async () => ({ message: 'Invalid credentials' }),
    }));

    try {
      await loginWithApi('test@test.com', 'pass', 'http://gateway');
      assert.fail('Should have thrown an error');
    } catch (error: any) {
      assert.equal(error.status, 401);
      assert.equal(error.message, 'Invalid credentials');
    }
  });

  it('apiFetch should attach Authorization header when session exists', async () => {
    (global.fetch as any).mock.mockImplementationOnce(async () => ({ ok: true }));
    setSession('secret_token', { name: 'User' });
    
    await apiFetch('http://api/test');
    
    const callArgs = (global.fetch as any).mock.calls[0].arguments;
    assert.equal(callArgs[0], 'http://api/test');
    const passedHeaders = callArgs[1].headers;
    assert.equal(passedHeaders.get('Authorization'), 'Bearer secret_token');
  });

  it('apiFetch should not attach Authorization header when session does not exist', async () => {
    (global.fetch as any).mock.mockImplementationOnce(async () => ({ ok: true, status: 200 }));
    clearSession();
    
    await apiFetch('http://api/test');
    
    const callArgs = (global.fetch as any).mock.calls[0].arguments;
    const passedHeaders = callArgs[1].headers;
    assert.equal(passedHeaders.has('Authorization'), false);
  });
});
