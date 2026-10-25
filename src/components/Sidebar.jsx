import React from 'react';
import { BookOpen, CalendarCheck, MessageSquare, Users } from 'lucide-react';

const ROLE_CONTEXT_CARD = {
  ACUDIENTE: { badge: 'Estudiante Matriculado', name: 'Juan Sebastián López', detail: 'Grado 10°A · Promedio 4.4' },
  DOCENTE: { badge: 'Asignación Académica', name: 'Prof. Carlos Ramírez', detail: 'Titular Matemáticas · 10°A' },
  DIRECTIVO: { badge: 'Coordinación General', name: 'Mag. Juan Pérez', detail: 'Sede Bachillerato · 2026-B' }
};

export function getRoleMenuItems(role = 'ACUDIENTE') {
  const normalized = role.toUpperCase();
  if (normalized === 'DOCENTE') {
    return [
      { navId: 'academic', portalId: 'academic', view: '', title: 'Planilla de Calificaciones', subtitle: 'Registrar notas y evaluaciones 10°A', icon: BookOpen },
      { navId: 'attendance', portalId: 'attendance', view: '', title: 'Pase de Lista y Fallas', subtitle: 'Control diario de asistencia 10°A', icon: CalendarCheck },
      { navId: 'comm-msg', portalId: 'communication', view: 'mensajeria', title: 'Atención a Acudientes', subtitle: 'Bandeja de mensajes con familias', icon: MessageSquare },
      { navId: 'comm-circ', portalId: 'communication', view: 'canales', title: 'Circulares Académicas', subtitle: 'Comunicados institucionales', icon: Users }
    ];
  }
  if (normalized === 'DIRECTIVO' || normalized === 'ADMIN') {
    return [
      { navId: 'academic', portalId: 'academic', view: '', title: 'Consolidado Académico', subtitle: 'Supervisión de promedios por área', icon: BookOpen },
      { navId: 'attendance', portalId: 'attendance', view: '', title: 'Aval de Excusas y Fallas', subtitle: 'Aprobación de excusas médicas', icon: CalendarCheck },
      { navId: 'comm-circ', portalId: 'communication', view: 'canales', title: 'Circulares Oficiales', subtitle: 'Publicaciones de rectoría', icon: MessageSquare },
      { navId: 'comm-audit', portalId: 'communication', view: 'lecturas', title: 'Auditoría de Acuses', subtitle: 'Trazabilidad de lectura certificada', icon: Users }
    ];
  }
  return [
    { navId: 'academic', portalId: 'academic', view: '', title: 'Boletín y Calificaciones', subtitle: 'Notas parciales de Juan Sebastián', icon: BookOpen },
    { navId: 'attendance', portalId: 'attendance', view: '', title: 'Inasistencias y Excusas', subtitle: 'Consultar fallas y radicar excusa', icon: CalendarCheck },
    { navId: 'comm-msg', portalId: 'communication', view: 'mensajeria', title: 'Mensajes con Docentes', subtitle: 'Chat directo con profesores 10°A', icon: MessageSquare },
    { navId: 'comm-circ', portalId: 'communication', view: 'canales', title: 'Circulares del Colegio', subtitle: 'Avisos oficiales y confirmación', icon: BookOpen },
    { navId: 'comm-dir', portalId: 'communication', view: 'contactos', title: 'Directorio Docente', subtitle: 'Horarios de atención a padres', icon: Users }
  ];
}

export default function Sidebar({ role = 'ACUDIENTE', activePortalId, onSelectPortal }) {
  const context = ROLE_CONTEXT_CARD[role.toUpperCase()] || ROLE_CONTEXT_CARD.ACUDIENTE;
  const items = getRoleMenuItems(role);

  return (
    <aside className="shell-sidebar" aria-label="Menú institucional de EduTrack">
      <div style={{ padding: '12px 14px', background: 'rgba(30,41,59,0.7)', border: '1px solid rgba(148,163,184,0.16)', borderRadius: '10px', marginBottom: '18px' }}>
        <div style={{ fontSize: '10px', fontWeight: 800, color: '#38bdf8', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          {context.badge}
        </div>
        <div style={{ fontSize: '14px', fontWeight: 700, color: '#ffffff', marginTop: '4px' }}>
          {context.name}
        </div>
        <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>
          {context.detail}
        </div>
      </div>

      <p className="shell-sidebar__label">Menú de Navegación</p>
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
