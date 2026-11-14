import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { isSameOriginUrl } from '../core/http/apiClient';

export default function MicrofrontendViewer({ portal, token = '', role = 'ACUDIENTE', user, view = '' }) {
  const iframeRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);

  const portalOrigin = useMemo(() => new URL(portal.url).origin, [portal.url]);

  // ?embedded=1 le indica al portal que no dibuje logo, perfil ni menú propio.
  const embeddedUrl = useMemo(() => {
    const url = new URL(portal.url);
    url.searchParams.set('embedded', '1');
    if (view) url.searchParams.set('view', view);
    return url.toString();
  }, [portal.url, view]);

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
      if (
        isSameOriginUrl(event, portalOrigin) &&
        iframeRef.current &&
        event.source === iframeRef.current.contentWindow &&
        event.data?.type === 'edutrack:ready'
      ) {
        setIsLoading(false);
        sendContext();
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [portalOrigin, sendContext]);

  return (
    <div className="relative flex min-h-0 min-w-0 flex-1 flex-col">
      {isLoading && (
        <div role="status" aria-live="polite" className="absolute inset-0 z-10 flex items-center justify-center bg-slate-50/80 backdrop-blur-sm">
          <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600" aria-hidden="true" />
            <span className="text-sm font-semibold text-slate-700">Cargando {portal.name}…</span>
            {import.meta.env?.DEV && <span className="font-mono text-xs text-slate-400">:{portal.port}</span>}
          </div>
        </div>
      )}
      <iframe
        ref={iframeRef}
        key={`${portal.id}-${view}`}
        onLoad={() => { setIsLoading(false); sendContext(); }}
        className="shell-portal-frame block min-h-0 w-full flex-1 border-0 bg-transparent"
        src={embeddedUrl}
        title={`Portal ${portal.name}`}
        loading="eager"
        sandbox="allow-scripts allow-same-origin allow-forms allow-downloads allow-popups"
        referrerPolicy="no-referrer"
      />
    </div>
  );
}
