import React, { useCallback, useEffect, useRef, useState } from 'react';
import { isSameOriginUrl } from '../core/http/apiClient';

export function buildEmbeddedPortalUrl(rawUrl, view = '') {
  try {
    const url = new URL(rawUrl);
    url.searchParams.set('embedded', '1');
    if (view) {
      url.searchParams.set('view', view);
    }
    return url.toString();
  } catch {
    const separator = rawUrl.includes('?') ? '&' : '?';
    return `${rawUrl}${separator}embedded=1${view ? `&view=${encodeURIComponent(view)}` : ''}`;
  }
}

export default function MicrofrontendViewer({ portal, token = '', role = 'ACUDIENTE', user, view = '' }) {
  const iframeRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const portalOrigin = new URL(portal.url).origin;
  const embeddedUrl = buildEmbeddedPortalUrl(portal.url, view);

  const sendContext = useCallback(() => {
    if (!iframeRef.current?.contentWindow || !token) return;
    iframeRef.current.contentWindow.postMessage(
      { type: 'edutrack:context', token, role, user: { id: user?.id || '', name: user?.name || user?.nombre || '', email: user?.email || '' }, view },
      portalOrigin
    );
  }, [portalOrigin, token, role, user, view]);

  useEffect(() => {
    setIsLoading(true);
  }, [portal.id, view]);

  useEffect(() => {
    const handleMessage = (event) => {
      if (isSameOriginUrl(event, portalOrigin) && iframeRef.current && event.source === iframeRef.current.contentWindow && event.data?.type === 'edutrack:ready') {
        setIsLoading(false);
        sendContext();
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [portalOrigin, sendContext]);

  return (
    <div className="relative flex-1 flex flex-col min-w-0">
      {isLoading && (
        <div role="status" className="bg-blue-50 border-b border-blue-200 text-blue-900 text-xs font-semibold px-6 py-2 flex items-center justify-between">
          <span>Sincronizando módulo {portal.name}…</span>
          <span className="text-blue-600 font-mono">:{portal.port}</span>
        </div>
      )}
      <iframe
        ref={iframeRef}
        key={`${portal.id}-${view}`}
        onLoad={() => { setIsLoading(false); sendContext(); }}
        className="shell-portal-frame"
        src={embeddedUrl}
        title={`Portal ${portal.name}`}
        loading="eager"
        sandbox="allow-scripts allow-same-origin allow-forms allow-downloads allow-popups"
        referrerPolicy="no-referrer"
      />
    </div>
  );
}
