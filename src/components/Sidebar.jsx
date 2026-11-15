import React, { useEffect, useRef, useState } from 'react';
import { BookOpen, CalendarCheck, MessageSquare, Users } from 'lucide-react';
import { normalizeRole, ROLE_LABELS } from '../core/roles';

const ROLE_CONTEXT_CARD = {
  ACUDIENTE: { badge: 'Estudiante matriculado', name: 'Juan Sebastián López', detail: 'Grado 10°A · Promedio 4.4' },
  DOCENTE: { badge: 'Asignación académica', name: 'Prof. Carlos Ramírez', detail: 'Titular Matemáticas · 10°A' },
  DIRECTIVO: { badge: 'Coordinación general', name: 'Mag. Juan Pérez', detail: 'Sede Bachillerato · 2026-B' },
  ESTUDIANTE: { badge: 'Estudiante', name: 'Juan Sebastián López', detail: 'Grado 10°A · Solo consulta' },
};

/** Menú por rol. Cada rol solo ve los portales que puede usar. */
export function getRoleMenuItems(role = 'ACUDIENTE') {
  const normalized = normalizeRole(role);

  if (normalized === 'DOCENTE') {
    return [
      { navId: 'academic', portalId: 'academic', view: '', title: 'Planilla de calificaciones', subtitle: 'Registrar notas y evaluaciones 10°A', icon: BookOpen },
      { navId: 'attendance', portalId: 'attendance', view: '', title: 'Pase de lista y fallas', subtitle: 'Control diario de asistencia 10°A', icon: CalendarCheck },
      { navId: 'comm-msg', portalId: 'communication', view: 'mensajeria', title: 'Atención a acudientes', subtitle: 'Bandeja de mensajes con familias', icon: MessageSquare },
      { navId: 'comm-circ', portalId: 'communication', view: 'canales', title: 'Circulares académicas', subtitle: 'Comunicados institucionales', icon: Users },
    ];
  }

  if (normalized === 'DIRECTIVO') {
    return [
      { navId: 'academic', portalId: 'academic', view: '', title: 'Consolidado académico', subtitle: 'Supervisión de promedios por área', icon: BookOpen },
      { navId: 'attendance', portalId: 'attendance', view: '', title: 'Aval de excusas y fallas', subtitle: 'Aprobación de excusas médicas', icon: CalendarCheck },
      { navId: 'comm-circ', portalId: 'communication', view: 'canales', title: 'Circulares oficiales', subtitle: 'Publicaciones de rectoría', icon: MessageSquare },
      { navId: 'comm-audit', portalId: 'communication', view: 'lecturas', title: 'Auditoría de acuses', subtitle: 'Trazabilidad de lectura certificada', icon: Users },
    ];
  }

  if (normalized === 'ESTUDIANTE') {
    return [
      { navId: 'academic', portalId: 'academic', view: '', title: 'Mis calificaciones', subtitle: 'Consulta tu rendimiento por materia', icon: BookOpen },
      { navId: 'attendance', portalId: 'attendance', view: '', title: 'Mi asistencia', subtitle: 'Porcentaje de asistencia y fallas', icon: CalendarCheck },
      { navId: 'comm-circ', portalId: 'communication', view: 'canales', title: 'Circulares del colegio', subtitle: 'Avisos oficiales', icon: MessageSquare },
    ];
  }

  return [
    { navId: 'academic', portalId: 'academic', view: '', title: 'Boletín y calificaciones', subtitle: 'Notas parciales de Juan Sebastián', icon: BookOpen },
    { navId: 'attendance', portalId: 'attendance', view: '', title: 'Inasistencias y excusas', subtitle: 'Consultar fallas y radicar excusa', icon: CalendarCheck },
    { navId: 'comm-msg', portalId: 'communication', view: 'mensajeria', title: 'Mensajes con docentes', subtitle: 'Chat directo con profesores 10°A', icon: MessageSquare },
    { navId: 'comm-circ', portalId: 'communication', view: 'canales', title: 'Circulares del colegio', subtitle: 'Avisos oficiales y confirmación', icon: BookOpen },
    { navId: 'comm-dir', portalId: 'communication', view: 'contactos', title: 'Directorio docente', subtitle: 'Horarios de atención a padres', icon: Users },
  ];
}

function getInitials(name) {
  if (!name) return 'ET';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function Sidebar({ role = 'ACUDIENTE', user, activePortalId, onSelectPortal, onLogout }) {
  const normalizedRole = normalizeRole(role);
  const context = ROLE_CONTEXT_CARD[normalizedRole];
  const displayName = normalizedRole === 'ACUDIENTE' ? (user?.name || user?.nombre || 'María López') : (user?.name || user?.nombre || context.name);
  const items = getRoleMenuItems(normalizedRole);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!showMenu) return undefined;
    const onDown = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setShowMenu(false); };
    const onKey = (e) => { if (e.key === 'Escape') setShowMenu(false); };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onDown); document.removeEventListener('keydown', onKey); };
  }, [showMenu]);

  return (
    <aside className="shell-sidebar" aria-label="Menú institucional de EduTrack">
      <div className="shell-brand">Edu<span>Track</span></div>

      <div className="shell-user" ref={menuRef}>
        <button type="button" className="shell-user__card" aria-haspopup="menu" aria-expanded={showMenu} onClick={() => setShowMenu((o) => !o)}>
          <span className="shell-user__avatar">{getInitials(displayName)}</span>
          <span className="shell-user__text">
            <strong>{displayName}</strong>
            <small>{ROLE_LABELS[normalizedRole]} · Colegio EduTrack</small>
          </span>
          <span aria-hidden="true" className="shell-user__chevron">⌄</span>
        </button>
        {showMenu && (
          <div role="menu" className="shell-user__menu">
            {user?.email && <div className="shell-user__email">{user.email}</div>}
            <button type="button" role="menuitem" onClick={() => { setShowMenu(false); if (typeof onLogout === 'function') onLogout(); }}>
              Cerrar sesión
            </button>
          </div>
        )}
      </div>

      <ul className="shell-sidebar__list">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activePortalId === item.navId;

          return (
            <li key={item.navId}>
              <button
                type="button"
                className={`shell-sidebar__button${isActive ? ' is-active' : ''}`}
                aria-current={isActive ? 'page' : undefined}
                title={item.subtitle}
                onClick={() => onSelectPortal(item.navId)}
              >
                <Icon aria-hidden="true" size={18} />
                <span>{item.title}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
