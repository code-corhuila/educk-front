import React from 'react';

export default function MicrofrontendViewer({ portal }) {
  const embeddedUrl = portal.url.includes('?') ? `${portal.url}&embedded=1` : `${portal.url}?embedded=1`;

  return (
    <iframe
      className="shell-portal-frame"
      src={embeddedUrl}
      title={`Portal ${portal.name}`}
      loading="eager"
    />
  );
}
