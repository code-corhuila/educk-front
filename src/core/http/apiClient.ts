export const apiFetch = async (url: string, options: RequestInit = {}) => {
  const headers = new Headers(options.headers || {});
  const session = localStorage.getItem('edutrack_session');
  
  if (session) {
    const { token } = JSON.parse(session);
    if (token) headers.set('Authorization', `Bearer ${token}`);
  }
  
  headers.set('X-Correlation-Id', crypto.randomUUID());
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);
  
  try {
    const response = await fetch(url, { ...options, headers, signal: controller.signal });
    if (response.status === 401) {
      localStorage.removeItem('edutrack_session');
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
