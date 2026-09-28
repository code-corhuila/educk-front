export const PORTAL_MODULES = Object.freeze([
  Object.freeze({ id: 'identity', name: 'Identidad', description: 'Sesión, perfil y acceso institucional', port: 3001, url: 'http://localhost:3001' }),
  Object.freeze({ id: 'academic', name: 'Académico', description: 'Calificaciones y seguimiento académico', port: 3002, url: 'http://localhost:3002' }),
  Object.freeze({ id: 'attendance', name: 'Asistencia', description: 'Registro y resumen de asistencia', port: 3003, url: 'http://localhost:3003' }),
  Object.freeze({ id: 'communication', name: 'Comunicación', description: 'Circulares y avisos institucionales', port: 3005, url: 'http://localhost:3005' })
]);

export function getPortalModule(portalId, modules = PORTAL_MODULES) {
  return modules.find(({ id }) => id === portalId) ?? modules[0];
}
