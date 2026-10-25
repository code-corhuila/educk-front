import React, { useState, useEffect, useRef } from 'react';

const ROLE_STYLES = {
  DOCENTE:    { bg: 'bg-amber-100', text: 'text-amber-900', border: 'border-amber-200', label: 'Docente' },
  ADMIN:      { bg: 'bg-purple-100', text: 'text-purple-900', border: 'border-purple-200', label: 'Directivo / Admin' },
  DIRECTIVO:  { bg: 'bg-purple-100', text: 'text-purple-900', border: 'border-purple-200', label: 'Director / Coordinación' },
  ESTUDIANTE: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200', label: 'Estudiante' },
  ACUDIENTE:  { bg: 'bg-indigo-100', text: 'text-indigo-900', border: 'border-indigo-200', label: 'Familia / Acudiente' }
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
          <span className="text-[11px] font-bold text-teal-700 bg-teal-50 border border-teal-200 px-2.5 py-0.5 rounded-full">
            Colegio Institucional
          </span>
        </div>

        <div className="h-5 w-px bg-slate-200" />

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-semibold">Módulo:</span>
          <span className="font-bold text-slate-800 text-sm">{title}</span>
        </div>
      </div>

      <div className="flex items-center gap-3" ref={menuRef}>
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-full border border-slate-200" role="tablist" aria-label="Cambiar rol activo">
          {['ACUDIENTE', 'DOCENTE', 'DIRECTIVO'].map((r) => (
            <button
              key={r}
              type="button"
              role="tab"
              aria-selected={roleKey === r}
              onClick={() => onRoleChange?.(r)}
              className={`text-[11px] px-3 py-1 rounded-full font-bold transition-all cursor-pointer ${
                roleKey === r ? 'bg-blue-700 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {r === 'ACUDIENTE' ? 'Como Acudiente' : r === 'DOCENTE' ? 'Como Docente' : 'Como Director'}
            </button>
          ))}
        </div>

        <div className={`shell-navbar__role text-xs px-3 py-1 rounded-full font-bold tracking-wide border ${roleConfig.bg} ${roleConfig.text} ${roleConfig.border}`}>
          {roleConfig.label}
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => setShowMenu(!showMenu)}
            className="bg-slate-900 text-white border-2 border-slate-200 rounded-full w-9 h-9 flex items-center justify-center cursor-pointer font-bold text-xs shadow-sm transition-all hover:bg-slate-800"
            title={currentUser.name || currentUser.nombre}
          >
            {getInitials(currentUser.name || currentUser.nombre)}
          </button>

          {showMenu && (
            <div className="absolute top-full right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-lg w-60 z-50 overflow-hidden">
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
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2.5 text-xs text-red-600 font-bold hover:bg-red-50 flex items-center gap-2 cursor-pointer"
                >
                  Cerrar Sesión
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
