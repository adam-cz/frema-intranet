import 'dotenv/config.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import User from '../models/user.js';
import RefreshTokens from '../models/refreshToken.js';

const expiresIn = 1000 * 60 * 5;

const generateAccessToken = (userData) => {
  return jwt.sign(userData, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn,
  });
};

//REGISTER function
export const signUp = async (req, res) => {
  //Vyndat vše co bude potřeba z req.body
  const { email, heslo } = req.body;
  try {
    const userExists = await User.findOne({ Email: email });
    if (userExists)
      return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(heslo, 10);
    const newUser = await User.create({
      Email: email,
      Heslo: hashedPassword,
    });

    const accessToken = generateAccessToken({ username: newUser.Email });
    const refreshToken = jwt.sign(
      { username: newUser.Email },
      process.env.REFRESH_TOKEN_SECRET
    );
    await RefreshTokens.create({ token: refreshToken });
    res
      .status(201)
      .cookie('jwt_token', accessToken, {
        expires: new Date(Date.now() + expiresIn),
        httpOnly: false,
      })
      .cookie('refresh_token', refreshToken, { httpOnly: true })
      .json({ user: newUser, accessToken, expiresIn: expiresIn - 1000 });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

//LOGIN function
export const signIn = async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email }).lean();
    if (!user) return res.status(400).json({ message: 'User doesnt exists' });
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect)
      return res.status(400).json({ message: 'Invalid credentials' });

    const accessToken = generateAccessToken({ _id: user._id });
    const refreshToken = jwt.sign(
      { _id: user._id },
      process.env.REFRESH_TOKEN_SECRET
    );
    delete user.password;
    user = { ...user, accessToken, expiresIn: expiresIn - 1000 };
    await RefreshTokens.create({ token: refreshToken });
    res
      .status(201)
      .cookie('jwt_token', accessToken, {
        expires: new Date(Date.now() + expiresIn),
        httpOnly: false,
      })
      .cookie('refresh_token', refreshToken, { httpOnly: true })
      .json(user);
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

//SIGN OUT function
export const signOut = async (req, res) => {
  try {
    await User.deleteOne({ token: req.body.token });
    res.sendStatus(204);
  } catch (err) {
    res.json({ message: err });
  }
};

//Refresh token function
export const refreshToken = async (req, res) => {
  const refreshToken = req.cookies.refresh_token;
  if (refreshToken == null) return res.sendStatus(401);
  if (!(await RefreshTokens.findOne({ token: refreshToken })))
    return res.sendStatus(403);
  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, decoded) => {
      if (err) return res.sendStatus(403);
      let user;
      try {
        user = await User.findOne({ _id: decoded._id }).lean();
      } catch {
        return res.sendStatus(403);
      }
      const accessToken = generateAccessToken({ _id: user._id });
      delete user.password;
      user = { ...user, accessToken, expiresIn: expiresIn - 1000 };
      res
        .cookie('jwt_token', accessToken, {
          expires: new Date(Date.now() + expiresIn),
          httpOnly: false,
        })
        .json(user)
        .status(201);
    }
  );
};
