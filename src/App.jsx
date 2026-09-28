import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import MicrofrontendViewer from './components/MicrofrontendViewer';
import { getPortalModule } from './portalModules';

export default function App() {
  const [activePortalId, setActivePortalId] = useState('academic');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const activePortal = getPortalModule(activePortalId);

  useEffect(() => {
    const token = localStorage.getItem('edutrack_token');
    if (!token) {
      window.location.href = 'http://localhost:3001';
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
    window.location.href = 'http://localhost:3001';
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
