// Shared session and token handling for all EduTrack portals

export function setSession(user, token) {
  localStorage.setItem('edutrack_user', JSON.stringify(user));
  localStorage.setItem('edutrack_token', token);
}

export function getSession() {
  const user = localStorage.getItem('edutrack_user');
  const token = localStorage.getItem('edutrack_token');
  if (!user || !token) return null;
  
  try {
    return { user: JSON.parse(user), token };
  } catch (e) {
    return null;
  }
}

export function clearSession() {
  localStorage.removeItem('edutrack_user');
  localStorage.removeItem('edutrack_token');
}

export async function loginWithApi(email, password, gatewayUrl) {
  const response = await fetch(`${gatewayUrl}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  });
  
  if (!response.ok) {
    throw new Error('Authentication failed');
  }
  
  return response.json();
}
