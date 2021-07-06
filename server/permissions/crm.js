import { ROLE } from '../config/roles';

export function canViewRecord(user, project) {
  return (
    user.role === (ROLE.ADMIN || ROLE.MANAGER || ROLE.SALES) ||
    project.userId === user._id
  );
}

export function canDeleteRecord(user, record) {
  user.role === ROLE.ADMIN || record.created.id === user._id;
}

export function canEditRecord(user, record) {
  return (
    user.role === (ROLE.ADMIN || ROLE.MANAGER) || record.created.id === user._id
  );
}
