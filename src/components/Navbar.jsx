import React, { useState, useEffect, useRef } from 'react';

/**
 * Navbar.jsx - Institutional Top Navigation Bar (Frontend Shell)
 * EduTrack — Sistemas Distribuidos 2026-B
 * Architecture: Microfrontend Host Shell (ADR-006 on port :3000)
 */

const ROLE_STYLES = {
  DOCENTE:    { bg: 'bg-amber-100', text: 'text-amber-900', border: 'border-amber-200', label: 'Docente' },
  ADMIN:      { bg: 'bg-purple-100', text: 'text-purple-900', border: 'border-purple-200', label: 'Directivo / Admin' },
  DIRECTIVO:  { bg: 'bg-purple-100', text: 'text-purple-900', border: 'border-purple-200', label: 'Directivo' },
  ESTUDIANTE: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200', label: 'Estudiante' },
  ACUDIENTE:  { bg: 'bg-indigo-100', text: 'text-indigo-900', border: 'border-indigo-200', label: 'Acudiente' }
};

/**
 * @param {{
 *   title?: string,
 *   activePort?: number,
 *   user?: any,
 *   onLogout?: (() => void) | null
 * }} props
 */
export default function Navbar({ 
  title = 'Portal Central', 
  activePort = 3000, 
  user = null, 
  onLogout = null 
}) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  // Active user with fallback default values
  const currentUser = user || (() => {
    try {
      const saved = localStorage.getItem('edutrack_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  })() || {
    name: 'Ximena Del Pilar Zambrano',
    role: 'DOCENTE',
    email: 'ximena.zambrano@edutrack.edu.co'
  };

  // Avatar initials calculation
  const getInitials = (name) => {
    if (!name) return 'ED';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  // Dynamic RBAC role styles
  const userRole = currentUser.rol || currentUser.role || 'DOCENTE';
  const roleKey = userRole.toUpperCase();
  const roleConfig = ROLE_STYLES[roleKey] || {
    bg: 'bg-slate-100',
    text: 'text-slate-600',
    border: 'border-slate-300',
    label: userRole || 'Usuario'
  };

  // Close menu on outside click
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

  // Secure logout routine
  const handleLogout = () => {
    setShowMenu(false);
    try {
      localStorage.removeItem('edutrack_token');
      localStorage.removeItem('edutrack_user');
    } catch (err) {
      console.error('Failed to clear local session:', err);
    }

    if (typeof onLogout === 'function') {
      onLogout();
    } else {
      window.location.reload();
    }
  };

  return (
    <header className="shell-navbar h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shadow-sm relative z-20">
      
      {/* Left Section: Branding, Module, and Port */}
      <div className="shell-navbar__context flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-lg font-extrabold text-slate-900 tracking-tight">
            Edu<span className="text-teal-500">Track</span>
          </span>
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
            Shell
          </span>
        </div>

        <div className="h-5 w-px bg-slate-300" />

        <div className="flex items-center gap-3">
          <span className="font-semibold text-slate-800 text-sm">
            {title}
          </span>
          <span className="text-xs bg-sky-100 text-sky-700 px-3 py-1 rounded-full font-medium border border-sky-200">
            Módulo Activo: http://localhost:{activePort}
          </span>
        </div>
      </div>

      {/* Right Section: RBAC Access Control & Profile Menu */}
      <div className="flex items-center gap-4" ref={menuRef}>
        
        {/* Dynamic Role Badge */}
        <div className={`shell-navbar__role text-xs px-3 py-1 rounded-full font-bold tracking-wide border ${roleConfig.bg} ${roleConfig.text} ${roleConfig.border}`}>
          Rol: {roleConfig.label}
        </div>

        {/* Avatar Button with Initials */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowMenu(!showMenu)}
            className="bg-sky-500 text-white border-2 border-sky-100 rounded-full w-10 h-10 flex items-center justify-center cursor-pointer font-bold text-sm shadow-sm transition-all hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-1"
            title={currentUser.name || currentUser.nombre}
          >
            {getInitials(currentUser.name || currentUser.nombre)}
          </button>

          {/* Dropdown Menu */}
          {showMenu && (
            <div className="absolute top-full right-0 mt-2 bg-white border border-slate-200 rounded-lg shadow-lg w-56 z-50 overflow-hidden">
              <div className="px-4 py-3 bg-slate-50 border-b border-slate-200">
                <div className="text-sm font-bold text-slate-900 truncate">
                  {currentUser.name || currentUser.nombre}
                </div>
                <div className="text-xs text-slate-500 truncate">
                  {currentUser.email}
                </div>
              </div>

              <div className="py-1">
                <button
                  type="button"
                  className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-100 flex items-center gap-2 cursor-pointer font-medium focus:outline-none"
                >
                  👤 Mi Perfil Institucional
                </button>

                <div className="h-px bg-slate-100 my-1" />

                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-xs text-red-500 font-semibold hover:bg-red-50 flex items-center gap-2 cursor-pointer focus:outline-none"
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
