import sql, { pool } from '../utils/dochazka.js';

export const verifyCardId = (req, res) => {
  console.log(req.param.id);
};
