import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import MicrofrontendViewer from './components/MicrofrontendViewer';

const MODULES = [
  { id: 'auth', name: 'Autenticación & Usuarios', port: 3001, color: '#1e3a8a', desc: 'IAM (HU-003)' },
  { id: 'academic', name: 'Gestión Académica & Notas', port: 3002, color: '#065f46', desc: 'Notas y Evaluaciones (HU-001)' },
  { id: 'attendance', name: 'Asistencia Escolar', port: 3003, color: '#b45309', desc: 'Control de Inasistencias (HU-005)' },
  { id: 'comms', name: 'Mensajería Institucional', port: 3005, color: '#7c3aed', desc: 'Comunicación Padre-Profesor (HU-004)' }
];

export default function App() {
  const [activeModule, setActiveModule] = useState(MODULES[0]);
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [activeUrl, setActiveUrl] = useState('http://localhost:3002');

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
    } catch (err) {}
    
    setIsAuthenticated(true);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('edutrack_token');
    localStorage.removeItem('edutrack_user');
    window.location.href = 'http://localhost:3001';
  };

  if (!isAuthenticated) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', fontFamily: 'sans-serif' }}>
      <Navbar user={user} onLogout={handleLogout} />
      
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <Sidebar user={user} setActiveUrl={setActiveUrl} />
        
        <main style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#f8fafc' }}>
          <header style={{ height: 60, background: '#fff', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px' }}>
            <span style={{ fontWeight: 'bold', color: '#1e293b' }}>{activeModule.name}</span>
            <span style={{ fontSize: 12, background: '#e0f2fe', color: '#0369a1', padding: '4px 10px', borderRadius: 12 }}>
              Puerto Módulo: http://localhost:{activeModule.port}
            </span>
          </header>
          
          <div style={{ padding: '10px 24px', display: 'flex', gap: 10, background: '#fff', borderBottom: '1px solid #e2e8f0' }}>
            {MODULES.map(m => (
              <button 
                key={m.id} 
                onClick={() => setActiveModule(m)}
                style={{ 
                  padding: '6px 12px', 
                  borderRadius: 4, 
                  border: 'none',
                  background: activeModule.id === m.id ? m.color : '#e2e8f0',
                  color: activeModule.id === m.id ? '#fff' : '#475569',
                  cursor: 'pointer'
                }}
              >
                {m.name}
              </button>
            ))}
          </div>

          <div style={{ flex: 1, padding: 20, display: 'flex' }}>
            <MicrofrontendViewer moduleUrl={activeUrl} />
          </div>
        </main>
      </div>
    </div>
  );
}
