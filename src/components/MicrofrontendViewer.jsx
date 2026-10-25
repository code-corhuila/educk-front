import React from 'react';

export default function MicrofrontendViewer({ portal, role = 'ACUDIENTE' }) {
  const separator = portal.url.includes('?') ? '&' : '?';
  const embeddedUrl = `${portal.url}${separator}embedded=1&role=${encodeURIComponent(role)}`;

  return (
    <iframe
      key={`${portal.id}-${role}`}
      className="shell-portal-frame"
      src={embeddedUrl}
      title={`Portal ${portal.name}`}
      loading="eager"
    />
  );
}
