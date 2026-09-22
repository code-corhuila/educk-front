import React, { useState, useEffect, useRef } from 'react';

/**
 * Navbar.jsx - Barra de Navegación Superior Institucional (Frontend Shell)
 * EduTrack — Sistemas Distribuidos 2026-B
 * Arquitectura: Microfrontend Host Shell (ADR-006 en puerto :3000)
 */

const ROLE_STYLES = {
  DOCENTE:    { bg: '#fef3c7', text: '#92400e', border: '#fde68a', label: 'Docente' },
  ADMIN:      { bg: '#f3e8ff', text: '#6b21a8', border: '#e9d5ff', label: 'Directivo / Admin' },
  DIRECTIVO:  { bg: '#f3e8ff', text: '#6b21a8', border: '#e9d5ff', label: 'Directivo' },
  ESTUDIANTE: { bg: '#dcfce7', text: '#15803d', border: '#bbf7d0', label: 'Estudiante' },
  ACUDIENTE:  { bg: '#e0e7ff', text: '#3730a3', border: '#c7d2fe', label: 'Acudiente' }
};

export default function Navbar({ 
  title = 'Portal Central', 
  activePort = 3000, 
  user = null, 
  onLogout = null 
}) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  // Usuario activo con valores defensivos por defecto
  const currentUser = user || (() => {
    try {
      const saved = localStorage.getItem('edutrack_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  })() || {
    nombre: 'Ximena Del Pilar Zambrano',
    rol: 'DOCENTE',
    email: 'ximena.zambrano@edutrack.edu.co'
  };

  // Cálculo de iniciales del avatar
  const getInitials = (name) => {
    if (!name) return 'ED';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  // Estilos del rol dinámico (RBAC)
  const roleKey = (currentUser.rol || 'DOCENTE').toUpperCase();
  const roleConfig = ROLE_STYLES[roleKey] || {
    bg: '#f1f5f9',
    text: '#475569',
    border: '#cbd5e1',
    label: currentUser.rol || 'Usuario'
  };

  // Cerrar menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMenu]);

  // Rutina de cierre de sesión seguro
  const handleLogout = () => {
    setShowMenu(false);
    try {
      localStorage.removeItem('edutrack_token');
      localStorage.removeItem('edutrack_user');
    } catch (err) {
      console.error('Error al limpiar sesión local:', err);
    }

    if (typeof onLogout === 'function') {
      onLogout();
    } else {
      window.location.reload();
    }
  };

  return (
    <header style={{
      height: 64,
      background: '#ffffff',
      borderBottom: '1px solid #e2e8f0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
      position: 'relative',
      zIndex: 20
    }}>
      {/* Sección Izquierda: Branding, Módulo y Puerto */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: 18, fontWeight: 800, color: '#0284c7', letterSpacing: '-0.5px' }}>
            EduTrack
          </span>
          <span style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Shell
          </span>
        </div>

        <div style={{ height: 20, width: 1, background: '#cbd5e1' }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontWeight: 600, color: '#1e293b', fontSize: 14 }}>
            {title}
          </span>
          <span style={{
            fontSize: 12,
            background: '#e0f2fe',
            color: '#0369a1',
            padding: '3px 10px',
            borderRadius: 12,
            fontWeight: 500,
            border: '1px solid #bae6fd'
          }}>
            Módulo Activo: http://localhost:{activePort}
          </span>
        </div>
      </div>

      {/* Sección Derecha: Control de Acceso RBAC & Menú de Perfil */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }} ref={menuRef}>
        {/* Badge de Rol Dinámico */}
        <div style={{
          fontSize: 12,
          background: roleConfig.bg,
          color: roleConfig.text,
          border: `1px solid ${roleConfig.border}`,
          padding: '4px 12px',
          borderRadius: 16,
          fontWeight: 700,
          letterSpacing: '0.2px'
        }}>
          Rol: {roleConfig.label}
        </div>

        {/* Botón de Avatar con Iniciales */}
        <div style={{ position: 'relative' }}>
          <button
            type="button"
            onClick={() => setShowMenu(!showMenu)}
            style={{
              background: '#0ea5e9',
              color: '#ffffff',
              border: '2px solid #e0f2fe',
              borderRadius: '50%',
              width: 38,
              height: 38,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: 13,
              boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
              transition: 'all 0.2s ease'
            }}
            title={currentUser.nombre}
          >
            {getInitials(currentUser.nombre)}
          </button>

          {/* Menú Flotante Desplegable */}
          {showMenu && (
            <div style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              marginTop: 8,
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: 8,
              boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)',
              width: 230,
              zIndex: 50,
              overflow: 'hidden'
            }}>
              <div style={{ padding: '12px 16px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {currentUser.nombre}
                </div>
                <div style={{ fontSize: 11, color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {currentUser.email}
                </div>
              </div>

              <div style={{ padding: '6px 0' }}>
                <div style={{
                  padding: '8px 16px',
                  fontSize: 12,
                  color: '#334155',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8
                }}>
                  👤 Mi Perfil Institucional
                </div>

                <div style={{ height: 1, background: '#f1f5f9', margin: '4px 0' }} />

                <button
                  type="button"
                  onClick={handleLogout}
                  style={{
                    width: '100%',
                    padding: '8px 16px',
                    background: 'transparent',
                    border: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    color: '#ef4444',
                    fontSize: 12,
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fef2f2'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  🚪 Cerrar Sesión
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
