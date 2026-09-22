import React from 'react';
import { LayoutDashboard, Users, BookOpen, Calendar, CheckSquare } from 'lucide-react';

export default function Sidebar({ user }) {
  const role = user?.rol?.toUpperCase() || 'ESTUDIANTE';
  
  const adminLinks = [
    { name: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { name: 'Gestión de Usuarios', icon: <Users size={18} /> },
    { name: 'Auditoría', icon: <CheckSquare size={18} /> }
  ];

  const academicLinks = [
    { name: 'Mis Cursos', icon: <BookOpen size={18} /> },
    { name: 'Calificaciones', icon: <CheckSquare size={18} /> },
    { name: 'Calendario', icon: <Calendar size={18} /> }
  ];

  const links = ['DIRECTIVO', 'ADMIN'].includes(role) 
    ? adminLinks 
    : academicLinks;

  return (
    <aside style={{ width: 250, height: 'calc(100vh - 64px)', background: '#1e293b', color: '#fff', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '20px 0', flex: 1 }}>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {links.map((link, i) => (
            <li 
              key={i} 
              style={{ padding: '12px 24px', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', transition: 'background 0.2s' }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#334155'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              {link.icon}
              <span style={{ fontSize: 14 }}>{link.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
