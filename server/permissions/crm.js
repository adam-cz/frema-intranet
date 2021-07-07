import { ROLE } from '../config/roles.js';

export function canViewRecords(user) {
  return user.role.includes(ROLE.ADMIN || ROLE.MANAGER || ROLE.SALES);
}

export function canCreateRecord(user) {
  return user.role.includes(ROLE.ADMIN || ROLE.MANAGER || ROLE.SALES);
}

export function canEditRecord(user, record) {
  return (
    user.role.includes(ROLE.ADMIN || ROLE.MANAGER) ||
    record.created.id === user._id
  );
}

export function canDeleteRecord(user, record) {
  return user.role.includes(ROLE.ADMIN) || record.created.id === user._id;
}
