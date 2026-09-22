import React from 'react';

export default function MicrofrontendViewer({ moduleUrl }) {
  return (
    <iframe 
      src={moduleUrl}
      width="100%"
      height="100%"
      style={{ border: 'none', flexGrow: 1 }}
      title="Visor de Microfrontend"
    />
  );
}
