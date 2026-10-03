import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import MicrofrontendViewer from '../components/MicrofrontendViewer';
import { getPortalModule } from '../portalModules';

const IDENTITY_PORTAL_URL = 'http://localhost:3001';

export default function App() {
  const [activePortalId, setActivePortalId] = useState<string>('academic');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<unknown>(null);
  const activePortal = getPortalModule(activePortalId);

  useEffect(() => {
    const token = localStorage.getItem('edutrack_token');
    if (!token) {
      window.location.href = IDENTITY_PORTAL_URL;
      return;
    }

    try {
      const savedUser = localStorage.getItem('edutrack_user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch {
      localStorage.removeItem('edutrack_user');
    }

    setIsAuthenticated(true);
  }, []);

  const handleLogout = () => {
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
