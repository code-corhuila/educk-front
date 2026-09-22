import React, { useState } from 'react';
import Navbar from './components/Navbar';

const MODULES = [
  { id: 'auth', name: 'Autenticación & Usuarios', port: 3001, color: '#1e3a8a', desc: 'IAM (HU-003)' },
  { id: 'academic', name: 'Gestión Académica & Notas', port: 3002, color: '#065f46', desc: 'Notas y Evaluaciones (HU-001)' },
  { id: 'attendance', name: 'Asistencia Escolar', port: 3003, color: '#b45309', desc: 'Control de Inasistencias (HU-005)' },
  { id: 'comms', name: 'Mensajería Institucional', port: 3005, color: '#7c3aed', desc: 'Comunicación Padre-Profesor (HU-004)' }
];

const MOCK_DOCENTE = {
  id: 'usr-001',
  nombre: 'Ximena Del Pilar Zambrano',
  rol: 'DOCENTE',
  email: 'ximena.zambrano@edutrack.edu.co'
};

export default function App() {
  const [activeModule, setActiveModule] = useState(MODULES[0]);
  const [user, setUser] = useState(MOCK_DOCENTE);

  const handleLogout = () => {
    console.log('Sesión cerrada desde el Frontend Shell');
    setUser(null);
  };

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: "'Segoe UI', sans-serif", background: '#F8F9FA' }}>
      {/* Sidebar */}
      <div style={{ width: 280, background: '#FFFFFF', color: '#263F70', padding: 20, display: 'flex', flexDirection: 'column', boxShadow: '2px 0 10px rgba(32, 48, 74, 0.05)', zIndex: 10 }}>
        <h2 style={{ fontSize: 24, fontWeight: 'bold', color: '#263F70', marginBottom: 4 }}>EduTrack</h2>
        <span style={{ fontSize: 12, fontWeight: 600, color: '#14B8A6', marginBottom: 24, letterSpacing: '1.8px', textTransform: 'uppercase' }}>CORHUILA — G1</span>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
          {MODULES.map(m => (
            <button
              key={m.id}
              onClick={() => setActiveModule(m)}
              style={{
                textAlign: 'left',
                padding: '14px 16px',
                borderRadius: 12,
                border: 'none',
                background: activeModule.id === m.id ? 'rgba(20, 184, 166, 0.1)' : 'transparent',
                color: activeModule.id === m.id ? '#14B8A6' : '#64748b',
                fontWeight: activeModule.id === m.id ? 'bold' : '600',
                cursor: 'pointer',
                borderLeft: activeModule.id === m.id ? '4px solid #14B8A6' : '4px solid transparent',
                transition: 'all 0.2s ease',
                display: 'flex',
                flexDirection: 'column',
                gap: 4
              }}
            >
              <div style={{ fontSize: 14 }}>{m.name}</div>
            </button>
          ))}
        </div>
        
        <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: 16, fontSize: 12, color: '#94a3b8', fontWeight: 500 }}>
          Desarrolladora: @XimenaChala
        </div>
      </div>

      {/* Main Content Container */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#f8fafc' }}>
        <Navbar 
          title={activeModule.name} 
          activePort={activeModule.port} 
          user={user} 
          onLogout={handleLogout} 
        />
        
        <div style={{ flex: 1, padding: '32px' }}>
          <iframe 
            src={`http://localhost:${activeModule.port}`} 
            style={{ width: '100%', height: '100%', border: 'none', borderRadius: 18, background: '#FFFFFF', boxShadow: '0px 24px 70px rgba(32, 48, 74, 0.15)' }}
            title={activeModule.name}
          />
        </div>
      </div>
    </div>
  );
}
