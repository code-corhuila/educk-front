const SESSION_KEY = 'edutrack_session';

export const setSession = (token: string, user: any, expiresIn?: number, tokenType?: string) => {
  const sessionData = { token, user, expiresIn, tokenType };
  localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
};

export const getSession = () => {
  const data = localStorage.getItem(SESSION_KEY);
  return data ? JSON.parse(data) : null;
};

export const clearSession = () => {
  localStorage.removeItem(SESSION_KEY);
};

export const apiFetch = async (url: string, options: RequestInit = {}) => {
  const headers = new Headers(options.headers || {});
  const session = getSession();
  
  if (session?.token) {
    headers.set('Authorization', `Bearer ${session.token}`);
  }
  
  headers.set('X-Correlation-Id', crypto.randomUUID());
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);
  
  try {
    const response = await fetch(url, { ...options, headers, signal: controller.signal });
    if (response.status === 401) {
      clearSession();
      window.location.href = '/login';
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
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
  } catch (e: any) {
    // Network error (DNS, CORS, offline)
    throw new Error('Network error: Could not reach the authentication server.');
  }

  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch (e) {
      errorData = { message: response.statusText || 'Authentication failed' };
    }
    const error: any = new Error(errorData.message || 'Authentication failed');
    error.status = response.status;
    error.body = errorData;
    throw error;
  }

  const rawData = await response.json();
  // Don't drop fields; return the full response object
  return rawData;
};
