import { ROLE } from '../config/roles.js';
import CRM from '../models/crm.js';

export function canViewRecords(user) {
  return (
    user.role.includes(ROLE.ADMIN) ||
    user.role.includes(ROLE.MANAGER) ||
    user.role.includes(ROLE.SALES)
  );
}

export function canCreateRecord(user) {
  return (
    user.role.includes(ROLE.ADMIN) ||
    user.role.includes(ROLE.MANAGER) ||
    user.role.includes(ROLE.SALES)
  );
}

export async function canEditRecord(user, recordID) {
  const record = await CRM.findOne({ _id: recordID }).lean();
  return (
    user.role.includes(ROLE.ADMIN) ||
    user.role.includes(ROLE.MANAGER) ||
    record.created.id === user._id
  );
}

export async function canDeleteRecord(user, recordID) {
  const record = await CRM.findOne({ _id: recordID }).lean();
  return user.role.includes(ROLE.ADMIN) || record.created.id === user._id;
}
