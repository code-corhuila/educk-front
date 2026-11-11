import { getSession, setSession, clearSession, loginWithApi, apiFetch, decodeJwtPayload, mapJwtRole, isSameOriginUrl } from './core/http/apiClient.ts';
import { describe, it, beforeEach, mock } from 'node:test';
import assert from 'node:assert/strict';

const makeJwt = (claims: Record<string, any>) => `${Buffer.from('{"alg":"RS256"}').toString('base64url')}.${Buffer.from(JSON.stringify(claims)).toString('base64url')}.sig`;

describe('Shared Session Module', () => {
  let sessionStore: Record<string, string>, localStore: Record<string, string>;
  beforeEach(() => {
    sessionStore = {};
    localStore = { edutrack_token: 'legacy-token', edutrack_user: '{}' };
    global.sessionStorage = {
      getItem: mock.fn((k: string) => sessionStore[k] || null),
      setItem: mock.fn((k: string, v: string) => { sessionStore[k] = v.toString(); }),
      removeItem: mock.fn((k: string) => { delete sessionStore[k]; })
    } as any;
    global.localStorage = {
      getItem: mock.fn((k: string) => localStore[k] || null),
      setItem: mock.fn((k: string, v: string) => { localStore[k] = v.toString(); }),
      removeItem: mock.fn((k: string) => { delete localStore[k]; })
    } as any;
    clearSession();
    global.fetch = mock.fn();
  });

  it('should store session in sessionStorage, purge legacy localStorage, and reject expired tokens', () => {
    assert.equal(getSession(), null);
    assert.equal(localStore.edutrack_token, undefined);

    const validJwt = makeJwt({ sub: 'u-1', role: 'TEACHER', exp: Math.floor(Date.now() / 1000) + 900 });
    setSession(validJwt, { name: 'Test' }, 900, 'Bearer');
    const saved = getSession();
    assert.equal(saved.token, validJwt);
    assert.equal(saved.role, 'DOCENTE');

    const expiredJwt = makeJwt({ sub: 'u-1', role: 'PARENT', exp: Math.floor(Date.now() / 1000) - 10 });
    setSession(expiredJwt, { name: 'Expired' });
    assert.equal(getSession(), null);
  });

  it('decodes JWT payload, maps allowed roles, rejects STUDENT, and validates exact origins', () => {
    const token = makeJwt({ sub: '123', role: 'SUPER_ADMIN', exp: 9999999999 });
    assert.equal(decodeJwtPayload(token)?.sub, '123');
    assert.equal(mapJwtRole('PARENT'), 'ACUDIENTE');
    assert.equal(mapJwtRole('TEACHER'), 'DOCENTE');
    assert.equal(mapJwtRole('ADMIN'), 'DIRECTIVO');
    assert.equal(mapJwtRole('STUDENT'), null);
    assert.equal(isSameOriginUrl('http://localhost:3001', 'http://localhost:3001/?embedded=1'), true);
    assert.equal(isSameOriginUrl('http://localhost:3001.evil.example', 'http://localhost:3001'), false);
    assert.equal(isSameOriginUrl('null', 'http://localhost:3001'), false);
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
