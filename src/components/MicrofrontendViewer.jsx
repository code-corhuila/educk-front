import React from 'react';

export default function MicrofrontendViewer({ portal, role = 'ACUDIENTE', view = '' }) {
  const separator = portal.url.includes('?') ? '&' : '?';
  const viewParam = view ? `&view=${encodeURIComponent(view)}` : '';
  const embeddedUrl = `${portal.url}${separator}embedded=1&role=${encodeURIComponent(role)}${viewParam}`;

  return (
    <iframe
      key={`${portal.id}-${role}-${view}`}
      className="shell-portal-frame"
      src={embeddedUrl}
      title={`Portal ${portal.name}`}
      loading="eager"
    />
  );
}
