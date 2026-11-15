// Fuente única de verdad para roles. El JWT trae ADMIN / TEACHER / PARENT / STUDENT;
// la interfaz trabaja con DIRECTIVO / DOCENTE / ACUDIENTE / ESTUDIANTE.

export const ROLE_ALIASES = {
  ADMIN: 'DIRECTIVO',
  SUPER_ADMIN: 'DIRECTIVO',
  DIRECTIVO: 'DIRECTIVO',
  TEACHER: 'DOCENTE',
  DOCENTE: 'DOCENTE',
  PARENT: 'ACUDIENTE',
  ACUDIENTE: 'ACUDIENTE',
  STUDENT: 'ESTUDIANTE',
  ESTUDIANTE: 'ESTUDIANTE',
};

export const ROLE_LABELS = {
  DIRECTIVO: 'Portal Dirección',
  DOCENTE: 'Portal Docente',
  ACUDIENTE: 'Portal Familias / Acudiente',
  ESTUDIANTE: 'Portal Estudiante',
};

/** Devuelve el rol de interfaz. Si el rol es desconocido, usa ACUDIENTE (comportamiento original). */
export function normalizeRole(role) {
  const key = typeof role === 'string' ? role.trim().toUpperCase() : '';
  return ROLE_ALIASES[key] ?? 'ACUDIENTE';
}
