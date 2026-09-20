import React, { useState } from 'react';

const MODULES = [
  { id: 'auth', name: 'Autenticación & Usuarios', port: 3001, color: '#1e3a8a', desc: 'IAM (HU-003)' },
  { id: 'academic', name: 'Gestión Académica & Notas', port: 3002, color: '#065f46', desc: 'Notas y Evaluaciones (HU-001)' },
  { id: 'attendance', name: 'Asistencia Escolar', port: 3003, color: '#b45309', desc: 'Control de Inasistencias (HU-005)' },
  { id: 'comms', name: 'Mensajería Institucional', port: 3005, color: '#7c3aed', desc: 'Comunicación Padre-Profesor (HU-004)' }
];

export default function App() {
  const [activeModule, setActiveModule] = useState(MODULES[0]);

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'sans-serif' }}>
      {/* Sidebar */}
      <div style={{ width: 280, background: '#0f172a', color: '#fff', padding: 20, display: 'flex', flexDirection: 'column' }}>
        <h2 style={{ fontSize: 18, color: '#38bdf8', marginBottom: 4 }}>EduTrack Platform</h2>
        <span style={{ fontSize: 11, color: '#94a3b8', marginBottom: 24 }}>Universidad CORHUILA — Corte 2</span>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
          {MODULES.map(m => (
            <button
              key={m.id}
              onClick={() => setActiveModule(m)}
              style={{
                textAlign: 'left',
                padding: '12px 14px',
                borderRadius: 6,
                border: 'none',
                background: activeModule.id === m.id ? '#1e293b' : 'transparent',
                color: activeModule.id === m.id ? '#38bdf8' : '#cbd5e1',
                fontWeight: activeModule.id === m.id ? 'bold' : 'normal',
                cursor: 'pointer',
                borderLeft: activeModule.id === m.id ? '4px solid #38bdf8' : '4px solid transparent'
              }}
            >
              <div>{m.name}</div>
              <div style={{ fontSize: 11, color: '#64748b' }}>{m.desc} (:{m.port})</div>
            </button>
          ))}
        </div>
        
        <div style={{ borderTop: '1px solid #334155', paddingTop: 12, fontSize: 11, color: '#64748b' }}>
          Líder Técnica: @XimenaChala
        </div>
      </div>

      {/* Main Content Container */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#f8fafc' }}>
        <header style={{ height: 60, background: '#fff', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px' }}>
          <span style={{ fontWeight: 'bold', color: '#1e293b' }}>{activeModule.name}</span>
          <span style={{ fontSize: 12, background: '#e0f2fe', color: '#0369a1', padding: '4px 10px', borderRadius: 12 }}>
            Puerto Módulo: http://localhost:{activeModule.port}
          </span>
        </header>
        
        <div style={{ flex: 1, padding: 20 }}>
          <iframe 
            src={`http://localhost:${activeModule.port}`} 
            style={{ width: '100%', height: '100%', border: 'none', borderRadius: 8, background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}
            title={activeModule.name}
          />
        </div>
      </div>
    </div>
  );
}
