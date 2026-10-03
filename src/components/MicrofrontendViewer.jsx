import React from 'react';

export default function MicrofrontendViewer({ portal }) {
  return (
    <iframe
      className="shell-portal-frame"
      src={portal.url}
      title={`Portal ${portal.name}`}
      loading="eager"
    />
  );
}
