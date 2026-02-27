export const ROLES = [
  'super_admin',
  'admin',
  'institute_admin',
  'institute_staff',
  'teacher',
  'student',
] as const;
export type Role = (typeof ROLES)[number];
