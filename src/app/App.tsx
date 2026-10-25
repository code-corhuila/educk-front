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
  const [user, setUser] = useState<unknown>(null);

  const activePortal = getPortalModule(activePortalId);

  useEffect(() => {
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

  const handleLogout = () => {
    clearSession();
    localStorage.removeItem('edutrack_token');
    localStorage.removeItem('edutrack_user');
    window.location.href = IDENTITY_PORTAL_URL;
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="shell-layout">
      <Navbar
        title={activePortal.name}
        activePort={activePortal.port}
        user={user}
        onLogout={handleLogout}
      />

      <div className="shell-workspace">
        <Sidebar
          activePortalId={activePortalId}
          onSelectPortal={setActivePortalId}
        />

        <main className="shell-main">
          <MicrofrontendViewer portal={activePortal} />
        </main>
      </div>
    </div>
  );
}
