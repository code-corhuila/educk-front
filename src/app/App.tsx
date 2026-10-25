import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import MicrofrontendViewer from '../components/MicrofrontendViewer';
import { getPortalModule } from '../portalModules';
import { clearSession, getSession, setSession } from '../core/http/apiClient';

const IDENTITY_PORTAL_URL = 'http://localhost:3001';

export default function App() {
  const [activePortalId, setActivePortalId] = useState<string>('academic');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<any>(null);

  const activePortal = getPortalModule(activePortalId);

  useEffect(() => {
    const hash = window.location.hash || '';
    if (hash.startsWith('#edutrack_session=')) {
      try {
        const rawPayload = decodeURIComponent(hash.slice('#edutrack_session='.length));
        const parsed = JSON.parse(rawPayload);
        if (parsed?.token) {
          setSession(parsed.token, parsed.user ?? null, parsed.expiresIn ?? 3600, parsed.tokenType ?? 'Bearer');
          localStorage.setItem('edutrack_token', parsed.token);
          if (parsed.user) {
            localStorage.setItem('edutrack_user', JSON.stringify(parsed.user));
          }
          window.history?.replaceState?.(null, '', window.location.pathname + window.location.search);
          setUser(parsed.user ?? null);
          setIsAuthenticated(true);
          return;
        }
      } catch {
        // Ignore malformed hash payload and fall back to stored session
      }
    }

    const storedSession = getSession();
    if (storedSession?.token) {
      setUser(storedSession.user ?? null);
      setIsAuthenticated(true);
      return;
    }

    const legacyToken = localStorage.getItem('edutrack_token');
    const savedUser = localStorage.getItem('edutrack_user');

    if (!legacyToken) {
      window.location.href = IDENTITY_PORTAL_URL;
      return;
    }

    try {
      const parsedUser = savedUser ? JSON.parse(savedUser) : null;
      setSession(legacyToken, parsedUser);
      setUser(parsedUser);
    } catch {
      setSession(legacyToken, null);
      setUser(null);
    }

    setIsAuthenticated(true);
  }, []);

  const handleRoleChange = (nextRole: 'ACUDIENTE' | 'DOCENTE' | 'DIRECTIVO') => {
    const roleProfiles = {
      ACUDIENTE: { name: 'María López', email: 'maria.lopez@email.com', role: 'ACUDIENTE' },
      DOCENTE: { name: 'Prof. Carlos Ramírez', email: 'carlos.ramirez@edutrack.edu.co', role: 'DOCENTE' },
      DIRECTIVO: { name: 'Coordinación Institucional', email: 'rectoria@edutrack.edu.co', role: 'DIRECTIVO' }
    };
    const nextUser = roleProfiles[nextRole];
    const currentToken = getSession()?.token || localStorage.getItem('edutrack_token') || `edutrack_demo_${nextRole.toLowerCase()}`;
    setSession(currentToken, nextUser, 3600, 'Bearer');
    localStorage.setItem('edutrack_user', JSON.stringify(nextUser));
    setUser(nextUser);
  };

  const handleLogout = () => {
    clearSession();
    localStorage.removeItem('edutrack_token');
    localStorage.removeItem('edutrack_user');
    window.location.href = IDENTITY_PORTAL_URL;
  };

  if (!isAuthenticated) {
    return null;
  }

  const activeRole = (user?.rol || user?.role || 'ACUDIENTE').toUpperCase();

  return (
    <div className="shell-layout">
      <Navbar
        title={activePortal.name}
        user={user}
        onRoleChange={handleRoleChange}
        onLogout={handleLogout}
      />

      <div className="shell-workspace">
        <Sidebar
          activePortalId={activePortalId}
          onSelectPortal={setActivePortalId}
        />

        <main className="shell-main">
          <MicrofrontendViewer portal={activePortal} role={activeRole} />
        </main>
      </div>
    </div>
  );
}
