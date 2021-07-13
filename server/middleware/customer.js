import {
  canCreateCustomer,
  canDeleteCustomer,
  canEditCustomer,
  canViewCustomers,
} from '../permissions/customer.js';

export function authGetCustomers(req, res, next) {
  if (!canViewCustomers(req.user)) {
    res.status(403);
    return res.send('Not Allowed');
  }
  next();
}

export function authCreateCustomer(req, res, next) {
  if (!canCreateCustomer(req.user)) {
    res.status(403);
    return res.send('Not Allowed');
  }
  next();
}

export function authEditCustomer(req, res, next) {
  if (!canEditCustomer(req.user, req.params.customerID)) {
    res.status(403);
    return res.send('Not Allowed');
  }
  next();
}

export function authDeleteCustomer(req, res, next) {
  if (!canDeleteCustomer(req.user, req.params.customerID)) {
    res.status(403);
    return res.send('Not Allowed');
  }
  next();
}
