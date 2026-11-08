import React, { useCallback, useEffect, useRef } from 'react';
import { isSameOriginUrl } from '../core/http/apiClient';

export default function MicrofrontendViewer({ portal, token = '', role = 'ACUDIENTE', user = null, view = '' }) {
  const iframeRef = useRef(null);
  const portalOrigin = new URL(portal.url).origin;
  const separator = portal.url.includes('?') ? '&' : '?';
  const embeddedUrl = `${portal.url}${separator}embedded=1${view ? `&view=${encodeURIComponent(view)}` : ''}`;

  const sendContext = useCallback(() => {
    if (!iframeRef.current?.contentWindow || !token) return;
    iframeRef.current.contentWindow.postMessage(
      { type: 'edutrack:context', token, role, user: { id: user?.id || '', name: user?.name || user?.nombre || '', email: user?.email || '' }, view },
      portalOrigin
    );
  }, [portalOrigin, token, role, user, view]);

  useEffect(() => {
    const handleMessage = (event) => {
      if (isSameOriginUrl(event, portalOrigin) && iframeRef.current && event.source === iframeRef.current.contentWindow && event.data?.type === 'edutrack:ready') {
        sendContext();
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [portalOrigin, sendContext]);

  return (
    <iframe ref={iframeRef} key={`${portal.id}-${view}`} className="shell-portal-frame" src={embeddedUrl} title={`Portal ${portal.name}`} loading="eager" sandbox="allow-scripts allow-same-origin allow-forms allow-downloads allow-popups" referrerPolicy="no-referrer" />
  );
}
