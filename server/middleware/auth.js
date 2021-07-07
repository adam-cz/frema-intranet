import 'dotenv/config.js';
import jwt from 'jsonwebtoken';

//AUTH Middleware
export const authenticateToken = (req, res, next) => {
  const token = req.cookies.jwt_token;
  if (!token) return res.sendStatus(401);
  //Verify token, if OK, save user and call next()
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

export function authenticateRole(role) {
  return (req, res, next) => {
    if (!req.user.role.includes(role)) {
      res.status(401);
      return res.send('Not allowed');
    }
    next();
  };
}
