import { ROLE } from '../config/roles.js';

export function canViewCustomers(user) {
  return (
    user.role.includes(ROLE.ADMIN) ||
    user.role.includes(ROLE.MANAGER) ||
    user.role.includes(ROLE.SALES)
  );
}

export function canCreateCustomer(user) {
  return (
    user.role.includes(ROLE.ADMIN) ||
    user.role.includes(ROLE.MANAGER) ||
    user.role.includes(ROLE.SALES)
  );
}

export function canEditCustomer(user) {
  return (
    user.role.includes(ROLE.ADMIN) ||
    user.role.includes(ROLE.MANAGER) ||
    user.role.includes(ROLE.SALES)
  );
}

export function canDeleteCustomer(user, customer) {
  return (
    user.role.includes(ROLE.ADMIN) ||
    user.role.includes(ROLE.MANAGER) ||
    customer.created.id === user._id
  );
}
