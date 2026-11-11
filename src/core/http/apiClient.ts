const SESSION_KEY = 'edutrack_session';
const LEGACY_KEYS = ['edutrack_token', 'edutrack_user', 'edutrack_session'];
const JWT_ROLE_MAP: Record<string, 'ACUDIENTE' | 'DOCENTE' | 'DIRECTIVO'> = {
  PARENT: 'ACUDIENTE', ACUDIENTE: 'ACUDIENTE', TEACHER: 'DOCENTE', DOCENTE: 'DOCENTE',
  ADMIN: 'DIRECTIVO', SUPER_ADMIN: 'DIRECTIVO', DIRECTIVO: 'DIRECTIVO'
};
function randomHex(byteLength: number): string {
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const bytes = new Uint8Array(byteLength);
    crypto.getRandomValues(bytes);
    return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
  }
  return Array.from({ length: byteLength * 2 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
}
export function purgeLegacyLocalSession(): void {
  if (typeof localStorage === 'undefined') return;
  for (const key of LEGACY_KEYS) {
    try { localStorage.removeItem(key); } catch { /* ignore */ }
  }
}
export function decodeJwtPayload(token: string): Record<string, any> | null {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 3 || !parts[1]) return null;
  try {
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
    const binary = typeof atob === 'function' ? atob(padded) : Buffer.from(padded, 'base64').toString('binary');
    const parsed = JSON.parse(new TextDecoder().decode(Uint8Array.from(binary, (c) => c.charCodeAt(0))));
    return parsed && typeof parsed === 'object' ? parsed : null;
  } catch { return null; }
}
export function mapJwtRole(rawRole?: string): 'ACUDIENTE' | 'DOCENTE' | 'DIRECTIVO' | null {
  if (!rawRole || typeof rawRole !== 'string') return null;
  return JWT_ROLE_MAP[rawRole.trim().toUpperCase()] ?? null;
}
export function isSameOriginUrl(candidate: unknown, trustedUrl: string): boolean {
  try {
    const g = globalThis as any;
    if ('Origin' in g && typeof g.Origin?.from === 'function') {
      let candidateOrigin;
      try { candidateOrigin = g.Origin.from(candidate); } catch {
        const raw = typeof MessageEvent !== 'undefined' && candidate instanceof MessageEvent ? candidate.origin : String(candidate ?? '');
        candidateOrigin = g.Origin.from(raw);
      }
      return candidateOrigin.isSameOrigin(g.Origin.from(trustedUrl));
    }
    const rawUrl = typeof candidate === 'string' ? candidate : (typeof (candidate as any)?.origin === 'string' ? (candidate as any).origin : '');
    const candidateParsed = new URL(rawUrl), trustedParsed = new URL(trustedUrl);
    return candidateParsed.origin !== 'null' && candidateParsed.origin === trustedParsed.origin;
  } catch { return false; }
}
export const setSession = (token: string, user: any, expiresIn?: number, tokenType?: string) => {
  purgeLegacyLocalSession();
  const payload = decodeJwtPayload(token);
  const expiresAt = typeof payload?.exp === 'number' ? payload.exp * 1000 : (typeof expiresIn === 'number' ? Date.now() + expiresIn * 1000 : undefined);
  const role = mapJwtRole(payload?.role || user?.role || user?.rol) || undefined;
  if (typeof sessionStorage !== 'undefined') {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify({ token, user, role, expiresIn, expiresAt, tokenType }));
  }
};
export const getSession = () => {
  if (typeof sessionStorage === 'undefined') return null;
  const data = sessionStorage.getItem(SESSION_KEY);
  if (!data) return null;
  try {
    const parsed = JSON.parse(data);
    if (!parsed?.token || (typeof parsed.expiresAt === 'number' && parsed.expiresAt <= Date.now())) {
      sessionStorage.removeItem(SESSION_KEY);
      return null;
    }
    return parsed;
  } catch {
    sessionStorage.removeItem(SESSION_KEY);
    return null;
  }
};
export const clearSession = () => {
  if (typeof sessionStorage !== 'undefined') sessionStorage.removeItem(SESSION_KEY);
  purgeLegacyLocalSession();
};
export const apiFetch = async (url: string, options: RequestInit = {}) => {
  const headers = new Headers(options.headers || {});
  const session = getSession();
  if (session?.token) {
    headers.set('Authorization', `Bearer ${session.token}`);
  }
  headers.set('X-Correlation-Id', crypto.randomUUID());
  if (!headers.has('traceparent')) {
    headers.set('traceparent', `00-${randomHex(16)}-${randomHex(8)}-01`);
  }
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);
  try {
    const response = await fetch(url, { ...options, headers, signal: controller.signal });
    if (response.status === 401) {
      clearSession();
      if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
        window.dispatchEvent(new CustomEvent('edutrack:unauthorized'));
      }
    }
    return response;
  } catch (error: any) {
    if (error.name === 'AbortError') {
      throw new Error('TIMEOUT');
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
};
/**
 * Shared login logic to prevent duplication in every portal.
 */
export const loginWithApi = async (email: string, password: string, gatewayUrl: string) => {
  let response;
  try {
    response = await fetch(`${gatewayUrl}/api/v1/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        traceparent: `00-${randomHex(16)}-${randomHex(8)}-01`,
        'X-Correlation-Id': crypto.randomUUID()
      },
      body: JSON.stringify({ email, password })
    });
  } catch {
    throw new Error('Network error: Could not reach the authentication server.');
  }
  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch {
      errorData = { message: response.statusText || 'Authentication failed' };
    }
    const error: any = new Error(errorData.message || 'Authentication failed');
    error.status = response.status;
    error.body = errorData;
    throw error;
  }
  return await response.json();
};
