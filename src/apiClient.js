// apiClient.js
// Shared session and HTTP client for all EduTrack portals

let memorySession = null;

export const setSession = (token, user) => {
  memorySession = { token, user };
};

export const getSession = () => {
  return memorySession;
};

export const clearSession = () => {
  memorySession = null;
};

/**
 * Wrapper for native fetch that automatically attaches the bearer token if it exists.
 */
export const apiFetch = async (url, options = {}) => {
  const headers = new Headers(options.headers || {});
  if (memorySession?.token) {
    headers.set('Authorization', `Bearer ${memorySession.token}`);
  }
  
  const response = await fetch(url, { ...options, headers });
  return response;
};

/**
 * Shared login logic to prevent duplication in every portal.
 * @param {string} email 
 * @param {string} password 
 * @param {string} gatewayUrl The API gateway URL provided by the portal
 * @returns {object} The user session data
 */
export const loginWithApi = async (email, password, gatewayUrl) => {
  const response = await fetch(`${gatewayUrl}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch (e) {
      errorData = { message: response.statusText };
    }
    const error = new Error(errorData.message || 'Authentication failed');
    error.status = response.status;
    error.body = errorData;
    throw error;
  }

  const data = await response.json();
  setSession(data.token, data.user);
  return data;
};
