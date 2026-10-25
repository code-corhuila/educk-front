import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import MicrofrontendViewer from '../components/MicrofrontendViewer';
import { getPortalModule } from '../portalModules';
import { clearSession, getSession, setSession } from '../core/http/apiClient';
const IDENTITY_PORTAL_URL = 'http://localhost:3001';
const DEFAULT_INSTITUTIONAL_USER = {
  id: '11111111-1111-1111-1111-111111111111',
  firstName: 'Ximena',
  lastName: 'Zambrano',
  name: 'Ximena Zambrano',
  email: 'xdzambrano-2022b@corhuila.edu.co',
  role: 'ACUDIENTE',
  status: 'ACTIVE'
};
export default function App() {
  const [activePortalId, setActivePortalId] = useState<string>('communication');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<unknown>(null);
  const activePortal = getPortalModule(activePortalId);
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const rawSessionParam = params.get('session');
      if (rawSessionParam) {
        const parsed = JSON.parse(decodeURIComponent(rawSessionParam));
        if (parsed?.token) {
          setSession(parsed.token, parsed.user || DEFAULT_INSTITUTIONAL_USER, parsed.expiresIn, parsed.tokenType);
          window.history.replaceState({}, '', window.location.pathname);
        }
      }
    } catch {
      // Ignore malformed query parameter
    }
    const storedSession = getSession();
    const legacyToken = localStorage.getItem('edutrack_token');
    if (storedSession?.token) {
      setUser(storedSession.user || DEFAULT_INSTITUTIONAL_USER);
      setIsAuthenticated(true);
      return;
    }
    if (legacyToken) {
      try {
        const savedUser = localStorage.getItem('edutrack_user');
        const resolvedUser = savedUser ? JSON.parse(savedUser) : DEFAULT_INSTITUTIONAL_USER;
        setSession(legacyToken, resolvedUser);
        setUser(resolvedUser);
      } catch {
        setUser(DEFAULT_INSTITUTIONAL_USER);
      }
      setIsAuthenticated(true);
      return;
    }
    // Initialize institutional session so the Shell (:3000) renders all portals seamlessly
    setSession('edutrack-institutional-session-v2', DEFAULT_INSTITUTIONAL_USER, 3600, 'Bearer');
    setUser(DEFAULT_INSTITUTIONAL_USER);
    setIsAuthenticated(true);
  }, []);
  const handleLogout = () => {
    clearSession();
    localStorage.removeItem('edutrack_token');
    localStorage.removeItem('edutrack_user');
    window.location.href = IDENTITY_PORTAL_URL;
  };
  if (!isAuthenticated) return null;
  return (
    <div className="shell-layout">
      <Navbar title={activePortal.name} activePort={activePortal.port} user={user} onLogout={handleLogout} />
      <div className="shell-workspace">
        <Sidebar activePortalId={activePortalId} onSelectPortal={setActivePortalId} />
        <main className="shell-main">
          <MicrofrontendViewer portal={activePortal} />
        </main>
      </div>
    </div>
  );
}
