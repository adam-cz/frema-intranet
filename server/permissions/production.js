import { ROLE } from '../config/roles.js';

export function canViewRecords(user) {
  return (
    user.role.includes(ROLE.ADMIN) ||
    user.role.includes(ROLE.MANAGER) ||
    user.role.includes(ROLE.PRODUCTION)
  );
}
