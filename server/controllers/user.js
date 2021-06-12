import 'dotenv/config.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import Users from '../models/zamestnanci.js';
import RefreshTokens from '../models/refreshToken.js';

const generateAccessToken = (user) => {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: '15s',
  });
};

//REGISTER function
export const signUp = async (req, res) => {
  //Vyndat vše co bude potřeba z req.body
  const { email, heslo } = req.body;
  try {
    const userExists = await Users.findOne({ Email: email });
    if (userExists)
      return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(heslo, 10);
    const newUser = await Users.create({
      Email: email,
      Heslo: hashedPassword,
    });

    const accessToken = generateAccessToken({ username: newUser.Email });
    const refreshToken = jwt.sign(newUser, process.env.REFRESH_TOKEN_SECRET);
    await RefreshTokens.create({ token: refreshToken });
    res.status(201).json({ user: newUser, accessToken, refreshToken });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

//LOGIN function
export const signIn = async (req, res) => {
  //Vyndat vše co bude potřeba z req.body
  const { email, heslo } = req.body;
  try {
    const userExists = await Users.findOne({ Email: email });
    if (!userExists)
      return res.status(400).json({ message: 'User doesnt exists' });
    const isPasswordCorrect = await bcrypt.compare(heslo, userExists.Heslo);
    if (!isPasswordCorrect)
      return res.status(400).json({ message: 'Invalid credentials' });

    const accessToken = generateAccessToken({ username: userExists.Email });
    const refreshToken = jwt.sign(
      { username: userExists.Email },
      process.env.REFRESH_TOKEN_SECRET
    );

    await RefreshTokens.create({ token: refreshToken });
    res.status(201).json({ user: userExists, accessToken, refreshToken });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

//SIGN OUT function
export const signOut = async (req, res) => {
  try {
    await Users.deleteOne({ token: req.body.token });
    res.sendStatus(204);
  } catch (err) {
    res.json({ message: err });
  }
};

//Refresh token function
export const refreshToken = async (req, res) => {
  const refreshToken = req.body.token;
  if (refreshToken == null) return res.sendStatus(401);
  if (!(await RefreshTokens.findOne({ token: refreshToken })))
    return res.sendStatus(403);
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    const accessToken = generateAccessToken({ username: user.username });
    res.json({ accessToken });
  });
};
