import { canViewRecords } from '../permissions/production.js';

export function authGetData(req, res, next) {
  if (!canViewRecords(req.user)) {
    res.status(403);
    return res.send('Not Allowed');
  }
  next();
}
