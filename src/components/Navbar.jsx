import React, { useState, useEffect, useRef } from 'react';

const ROLE_STYLES = {
  DOCENTE:    { bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200', label: 'Portal Docente' },
  ADMIN:      { bg: 'bg-purple-50', text: 'text-purple-800', border: 'border-purple-200', label: 'Portal Dirección' },
  DIRECTIVO:  { bg: 'bg-purple-50', text: 'text-purple-800', border: 'border-purple-200', label: 'Portal Dirección' },
  ESTUDIANTE: { bg: 'bg-green-50', text: 'text-green-800', border: 'border-green-200', label: 'Portal Estudiante' },
  ACUDIENTE:  { bg: 'bg-blue-50', text: 'text-blue-800', border: 'border-blue-200', label: 'Portal Familias / Acudiente' }
};

export default function Navbar({
  title = 'Portal Institucional',
  user = null,
  onRoleChange = null,
  onLogout = null
}) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  const currentUser = user || (() => {
    try {
      const saved = localStorage.getItem('edutrack_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  })() || {
    name: 'María López',
    role: 'ACUDIENTE',
    email: 'maria.lopez@email.com'
  };

  const getInitials = (name) => {
    if (!name) return 'ET';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const userRole = currentUser.rol || currentUser.role || 'ACUDIENTE';
  const roleKey = userRole.toUpperCase();
  const roleConfig = ROLE_STYLES[roleKey] || ROLE_STYLES.ACUDIENTE;

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
      <div className="shell-navbar__context flex items-center gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-slate-900 text-teal-400 font-extrabold text-xs flex items-center justify-center">
            ET
          </div>
          <span className="text-lg font-extrabold text-slate-900 tracking-tight">
            Edu<span className="text-teal-600">Track</span>
          </span>
        </div>

        <div className="h-5 w-px bg-slate-200" />

        <div className="flex items-center gap-2 text-sm">
          <span className="text-slate-400 font-medium">Colegio EduTrack</span>
          <span className="text-slate-300">/</span>
          <span className="font-bold text-slate-800">{title}</span>
        </div>
      </div>

      <div className="flex items-center gap-3" ref={menuRef}>
        <span className={`shell-navbar__role text-xs px-3 py-1 rounded-full font-bold border ${roleConfig.bg} ${roleConfig.text} ${roleConfig.border}`}>
          {roleConfig.label}
        </span>

        <div className="relative">
          <button
            type="button"
            onClick={() => setShowMenu(!showMenu)}
            className="flex items-center gap-2.5 pl-1.5 pr-3 py-1 rounded-full border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-all cursor-pointer"
          >
            <span className="bg-slate-900 text-white rounded-full w-7 h-7 flex items-center justify-center font-bold text-xs">
              {getInitials(currentUser.name || currentUser.nombre)}
            </span>
            <span className="text-xs font-bold text-slate-800">
              {currentUser.name || currentUser.nombre}
            </span>
          </button>

          {showMenu && (
            <div className="absolute top-full right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-lg w-64 z-50 overflow-hidden">
              <div className="px-4 py-3 bg-slate-50 border-b border-slate-200">
                <div className="text-xs font-extrabold text-teal-700 uppercase tracking-wider">
                  {roleConfig.label}
                </div>
                <div className="text-sm font-bold text-slate-900 truncate mt-0.5">
                  {currentUser.name || currentUser.nombre}
                </div>
                <div className="text-xs text-slate-500 truncate">
                  {currentUser.email}
                </div>
              </div>

              <div className="px-3 py-2 border-b border-slate-100">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1 mb-1.5">
                  Cambiar cuenta activa
                </div>
                {[
                  { id: 'ACUDIENTE', label: 'María López (Acudiente)' },
                  { id: 'DOCENTE', label: 'Prof. Carlos Ramírez (Docente)' },
                  { id: 'DIRECTIVO', label: 'Mag. Juan Pérez (Director)' }
                ].map((acc) => (
                  <button
                    key={acc.id}
                    type="button"
                    onClick={() => {
                      onRoleChange?.(acc.id);
                      setShowMenu(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-between cursor-pointer ${
                      roleKey === acc.id ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span>{acc.label}</span>
                    {roleKey === acc.id && <span>●</span>}
                  </button>
                ))}
              </div>

              <div className="py-1">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2.5 text-xs text-red-600 font-bold hover:bg-red-50 flex items-center gap-2 cursor-pointer"
                >
                  Cerrar sesión e ir al Login
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
