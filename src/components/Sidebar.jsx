import React from 'react';
import { BookOpen, CalendarCheck, MessageSquare, Users } from 'lucide-react';
import { normalizeRole } from '../core/roles';

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

export default function Sidebar({ role = 'ACUDIENTE', user, activePortalId, onSelectPortal }) {
  const normalizedRole = normalizeRole(role);
  const context = ROLE_CONTEXT_CARD[normalizedRole];
  const displayName = normalizedRole === 'ACUDIENTE' ? context.name : (user?.name || user?.nombre || context.name);
  const items = getRoleMenuItems(normalizedRole);

  return (
    <aside className="shell-sidebar" aria-label="Menú institucional de EduTrack">
      <div className="mb-4 rounded-xl border border-slate-400/20 bg-slate-800/70 px-3.5 py-3">
        <div className="text-[10px] font-extrabold uppercase tracking-[0.08em] text-sky-400">{context.badge}</div>
        <div className="mt-1 text-sm font-bold text-white">{displayName}</div>
        <div className="mt-0.5 text-xs text-slate-400">{context.detail}</div>
      </div>

      <p className="shell-sidebar__label">Menú de navegación</p>
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
                onClick={() => onSelectPortal(item.navId)}
              >
                <Icon aria-hidden="true" size={19} />
                <span>
                  <strong>{item.title}</strong>
                  <small>{item.subtitle}</small>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
