import {
  canCreateRecord,
  canDeleteRecord,
  canEditRecord,
  canViewRecords,
} from '../permissions/crm.js';

export function authGetRecords(req, res, next) {
  if (!canViewRecords(req.user)) {
    res.status(403);
    return res.send('Not Allowed');
  }
  next();
}

export function authCreateRecord(req, res, next) {
  if (!canCreateRecord(req.user)) {
    res.status(403);
    return res.send('Not Allowed');
  }
  next();
}

export function authEditRecord(req, res, next) {
  if (!canEditRecord(req.user, req.params.recordID)) {
    res.status(403);
    return res.send('Not Allowed');
  }
  next();
}

export function authDeleteRecord(req, res, next) {
  if (!canDeleteRecord(req.user, req.params.recordID)) {
    res.status(403);
    return res.send('Not Allowed');
  }
  next();
}
