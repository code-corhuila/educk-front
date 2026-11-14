import React, { useEffect, useRef, useState } from 'react';
import { normalizeRole, ROLE_LABELS } from '../core/roles';

const ROLE_STYLES = {
  DOCENTE: 'bg-amber-50 text-amber-800 border-amber-200',
  DIRECTIVO: 'bg-purple-50 text-purple-800 border-purple-200',
  ESTUDIANTE: 'bg-green-50 text-green-800 border-green-200',
  ACUDIENTE: 'bg-blue-50 text-blue-800 border-blue-200',
};

function getInitials(name) {
  if (!name) return 'ET';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/**
 * Barra superior del Shell. Es la ÚNICA que muestra el logo y el perfil:
 * los portales embebidos no deben repetirlos.
 * `devModule` (opcional) muestra la URL del módulo activo, solo en desarrollo.
 */
export default function Navbar({ title = 'Portal Institucional', user, onLogout, devModule, activeUrl }) {
  const moduleUrl = devModule ?? activeUrl;
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  const currentUser = user || { name: 'Usuario Institucional', role: 'ACUDIENTE', email: '' };
  const displayName = currentUser.name || currentUser.nombre || 'Usuario Institucional';
  const roleKey = normalizeRole(currentUser.rol || currentUser.role);
  const roleLabel = ROLE_LABELS[roleKey];

  useEffect(() => {
    if (!showMenu) return undefined;
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setShowMenu(false);
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setShowMenu(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [showMenu]);

  const handleLogout = () => {
    setShowMenu(false);
    if (typeof onLogout === 'function') onLogout();
    else window.location.reload();
  };

  return (
    <header className="shell-navbar relative z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6 shadow-sm">
      <div className="shell-navbar__context flex items-center gap-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-xs font-extrabold text-teal-400">ET</div>
          <span className="text-lg font-extrabold tracking-tight text-slate-900">
            Edu<span className="text-teal-600">Track</span>
          </span>
        </div>

        <div className="hidden h-5 w-px bg-slate-200 sm:block" />

        <div className="hidden items-center gap-2 text-sm sm:flex">
          <span className="font-medium text-slate-400">Colegio EduTrack</span>
          <span className="text-slate-300">/</span>
          <span className="font-bold text-slate-800">{title}</span>
        </div>

        {import.meta.env?.DEV && moduleUrl && (
          <span className="hidden rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 font-mono text-[11px] text-slate-500 lg:inline">
            Módulo activo: {moduleUrl}
          </span>
        )}
      </div>

      <div className="flex items-center gap-3" ref={menuRef}>
        <span className={`shell-navbar__role hidden rounded-full border px-3 py-1 text-xs font-bold sm:inline ${ROLE_STYLES[roleKey]}`}>
          {roleLabel}
        </span>

        <div className="relative">
          <button
            type="button"
            aria-haspopup="menu"
            aria-expanded={showMenu}
            onClick={() => setShowMenu((open) => !open)}
            className="flex cursor-pointer items-center gap-2.5 rounded-full border border-slate-200 bg-slate-50 py-1 pl-1.5 pr-3 transition-all hover:bg-slate-100"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
              {getInitials(displayName)}
            </span>
            <span className="max-w-[140px] truncate text-xs font-bold text-slate-800">{displayName}</span>
          </button>

          {showMenu && (
            <div role="menu" className="absolute right-0 top-full z-50 mt-2 w-64 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
              <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
                <div className="text-xs font-extrabold uppercase tracking-wider text-teal-700">{roleLabel}</div>
                <div className="mt-0.5 truncate text-sm font-bold text-slate-900">{displayName}</div>
                {currentUser.email && <div className="truncate text-xs text-slate-500">{currentUser.email}</div>}
              </div>

              <div className="py-1">
                <button
                  type="button"
                  role="menuitem"
                  onClick={handleLogout}
                  className="flex w-full cursor-pointer items-center gap-2 px-4 py-2.5 text-left text-xs font-bold text-red-600 hover:bg-red-50"
                >
                  Cerrar sesión e ir al login
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
