import { useCallback, useEffect, useRef, useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar, { getRoleMenuItems } from '../components/Sidebar';
import MicrofrontendViewer from '../components/MicrofrontendViewer';
import { getPortalModule } from '../portalModules';
import { clearSession, decodeJwtPayload, getSession, isSameOriginUrl, mapJwtRole, purgeLegacyLocalSession, setSession } from '../core/http/apiClient';

const IDENTITY_ORIGIN = new URL(import.meta.env.VITE_IDENTITY_ORIGIN || 'http://localhost:3001').origin;

interface VerifiedSessionState {
  token: string;
  role: 'ACUDIENTE' | 'DOCENTE' | 'DIRECTIVO';
  user: { id: string; name: string; email: string; role: string };
  expiresAt: number;
}

function verifyTokenAndBuildSession(token: string, rawUser?: any): { session?: VerifiedSessionState; unauthorizedRole?: boolean } {
  const payload = decodeJwtPayload(token);
  if (!payload || typeof payload.exp !== 'number' || payload.exp * 1000 <= Date.now()) return {};
  const mappedRole = mapJwtRole(payload.role);
  if (!mappedRole) return { unauthorizedRole: true };
  const email = payload.email || rawUser?.email || '';
  const name = rawUser?.name || rawUser?.fullName || [rawUser?.firstName, rawUser?.lastName].filter(Boolean).join(' ') || email || 'Usuario';
  const id = payload.sub || payload.userId || rawUser?.id || '';
  return { session: { token, role: mappedRole, user: { id, name, email, role: mappedRole }, expiresAt: payload.exp * 1000 } };
}

export default function App() {
  const [activeNavId, setActiveNavId] = useState<string>('academic');
  const [sessionState, setSessionState] = useState<VerifiedSessionState | null>(null);
  const [unauthorizedRoleError, setUnauthorizedRoleError] = useState<string>('');
  const loginIframeRef = useRef<HTMLIFrameElement | null>(null);

  const handleLogout = useCallback(() => {
    clearSession();
    setSessionState(null);
    setUnauthorizedRoleError('');
    setActiveNavId('academic');
  }, []);

  useEffect(() => {
    purgeLegacyLocalSession();
    if (window.location.hash.includes('edutrack_session')) {
      window.history?.replaceState?.(null, '', window.location.pathname + window.location.search);
    }
    const stored = getSession();
    if (stored?.token) {
      const checked = verifyTokenAndBuildSession(stored.token, stored.user);
      if (checked.session) setSessionState(checked.session);
      else {
        clearSession();
        if (checked.unauthorizedRole) setUnauthorizedRoleError('Rol no autorizado para acceder a este portal institucional.');
      }
    }
  }, []);

  useEffect(() => {
    const onUnauthorized = () => handleLogout();
    window.addEventListener('edutrack:unauthorized', onUnauthorized);
    return () => window.removeEventListener('edutrack:unauthorized', onUnauthorized);
  }, [handleLogout]);

  useEffect(() => {
    if (!sessionState) return;
    const timerId = window.setTimeout(() => handleLogout(), Math.max(0, sessionState.expiresAt - Date.now()));
    return () => window.clearTimeout(timerId);
  }, [sessionState, handleLogout]);

  useEffect(() => {
    if (sessionState) return;
    const handleMessage = (event: MessageEvent) => {
      if (!isSameOriginUrl(event, IDENTITY_ORIGIN)) return;
      if (!loginIframeRef.current || event.source !== loginIframeRef.current.contentWindow) return;
      if (!event.data || event.data.type !== 'edutrack:session' || !event.data.session) return;

      const incoming = event.data.session;
      const checked = verifyTokenAndBuildSession(incoming.accessToken, incoming.user);
      if (checked.unauthorizedRole) {
        clearSession();
        setUnauthorizedRoleError('Rol no autorizado para acceder a este portal institucional.');
        return;
      }
      if (!checked.session) {
        clearSession();
        return;
      }
      setUnauthorizedRoleError('');
      setSession(checked.session.token, checked.session.user, incoming.expiresIn, incoming.tokenType || 'Bearer');
      setSessionState(checked.session);
      setActiveNavId('academic');
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [sessionState]);

  if (!sessionState) {
    return (
      <div className="w-screen h-screen flex flex-col bg-slate-950">
        {unauthorizedRoleError && (
          <div role="alert" className="bg-red-900 text-white text-sm font-semibold px-6 py-3 flex items-center justify-between">
            <span>{unauthorizedRoleError}</span>
            <button type="button" onClick={() => setUnauthorizedRoleError('')} className="underline text-xs font-bold">Intentar con otra cuenta</button>
          </div>
        )}
        <iframe ref={loginIframeRef} src={`${IDENTITY_ORIGIN}/?embedded=1`} title="Autenticación Institucional EduTrack" className="w-full flex-1 border-0" sandbox="allow-scripts allow-same-origin allow-forms" referrerPolicy="no-referrer" />
      </div>
    );
  }

  const activeRole = sessionState.role;
  const menuItems = getRoleMenuItems(activeRole);
  const activeMenuItem = menuItems.find((item) => item.navId === activeNavId) || menuItems[0];
  const basePortal = getPortalModule(activeMenuItem.portalId);

  return (
    <div className="shell-layout">
      <Navbar title={activeMenuItem.title} user={sessionState.user} onLogout={handleLogout} />
      <div className="shell-workspace">
        <Sidebar role={activeRole} user={sessionState.user} activePortalId={activeMenuItem.navId} onSelectPortal={setActiveNavId} />
        <main className="shell-main">
          <MicrofrontendViewer portal={basePortal} token={sessionState.token} role={activeRole} user={sessionState.user} view={activeMenuItem.view} />
        </main>
      </div>
    </div>
  );
}
