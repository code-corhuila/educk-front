import React from 'react';
import { BookOpen, CalendarCheck, MessageSquare, Users } from 'lucide-react';
import { PORTAL_MODULES } from '../portalModules';

const PORTAL_ICONS = {
  identity: Users,
  academic: BookOpen,
  attendance: CalendarCheck,
  communication: MessageSquare
};

const DISPLAY_LABELS = {
  academic: { title: 'Calificaciones y Boletín', subtitle: 'Notas por asignatura y promedio' },
  attendance: { title: 'Asistencia y Excusas', subtitle: 'Registro de fallas y justificaciones' },
  communication: { title: 'Comunicación Escolar', subtitle: 'Mensajería docente y circulares' }
};

export default function Sidebar({ activePortalId, onSelectPortal }) {
  const visibleModules = PORTAL_MODULES.filter((portal) => portal.id !== 'identity');

  return (
    <aside className="shell-sidebar" aria-label="Menú principal de EduTrack">
      <div style={{ padding: '4px 12px 18px', borderBottom: '1px solid rgba(255,255,255,0.08)', marginBottom: '14px' }}>
        <div style={{ fontSize: '11px', fontWeight: 800, color: '#38bdf8', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          Estudiante Activo
        </div>
        <div style={{ fontSize: '14px', fontWeight: 700, color: '#ffffff', marginTop: '4px' }}>
          Juan Sebastián López
        </div>
        <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>
          Grado 10°A · Vigencia 2026-B
        </div>
      </div>

      <p className="shell-sidebar__label">Módulos Institucionales</p>
      <ul className="shell-sidebar__list">
        {visibleModules.map((portal) => {
          const Icon = PORTAL_ICONS[portal.id] || BookOpen;
          const isActive = activePortalId === portal.id;
          const label = DISPLAY_LABELS[portal.id] || { title: portal.name, subtitle: portal.description };

          return (
            <li key={portal.id}>
              <button
                type="button"
                className={`shell-sidebar__button${isActive ? ' is-active' : ''}`}
                aria-current={isActive ? 'page' : undefined}
                onClick={() => onSelectPortal(portal.id)}
              >
                <Icon aria-hidden="true" size={20} />
                <span>
                  <strong>{label.title}</strong>
                  <small>{label.subtitle}</small>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
