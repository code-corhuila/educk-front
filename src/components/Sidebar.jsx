import React from 'react';
import { BookOpen, CalendarCheck, MessageSquare, Users } from 'lucide-react';
import { PORTAL_MODULES } from '../portalModules';

const PORTAL_ICONS = {
  identity: Users,
  academic: BookOpen,
  attendance: CalendarCheck,
  communication: MessageSquare
};

export default function Sidebar({ activePortalId, onSelectPortal }) {
  return (
    <aside className="shell-sidebar" aria-label="Portales de EduTrack">
      <p className="shell-sidebar__label">Portales</p>
      <ul className="shell-sidebar__list">
        {PORTAL_MODULES.map((portal) => {
          const Icon = PORTAL_ICONS[portal.id];
          const isActive = activePortalId === portal.id;

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
                  <strong>{portal.name}</strong>
                  <small>{portal.description}</small>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
