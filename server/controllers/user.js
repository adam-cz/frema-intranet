import 'dotenv/config.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import User from '../models/user.js';
import RefreshTokens from '../models/refreshToken.js';
import * as config from '../config/user.js';

const generateAccessToken = (userData) => {
  return jwt.sign(userData, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: config.ACCESS_TOKEN_EXPIRE,
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
    await RefreshTokens.create({
      token: refreshToken,
    });
    res
      .status(201)
      .cookie('jwt_token', accessToken, {
        expires: new Date(Date.now() + config.ACCESS_TOKEN_EXPIRE),
        httpOnly: false,
      })
      .cookie('refresh_token', refreshToken, { httpOnly: true })
      .json({
        user: newUser,
        accessToken,
        expiresIn: config.ACCESS_TOKEN_EXPIRE - 1000,
      });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

//LOGIN function
export const signIn = async (req, res) => {
  const { email, password } = req.body;
  try {
    //Fetch user, if doesnt exists - 400
    let user = await User.findOne({ email }).lean();
    if (!user) return res.status(400).json({ message: 'User doesnt exists' });
    //check password, if invalid - 400
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect)
      return res.status(400).json({ message: 'Invalid credentials' });
    //generate access token with user ID
    const accessToken = generateAccessToken({ _id: user._id });
    //generate refresh token. Expiration date is set automaticly
    const refreshToken = jwt.sign(
      { _id: user._id },
      process.env.REFRESH_TOKEN_SECRET
    );
    await RefreshTokens.create({
      token: refreshToken,
      user: user._id,
    });
    //delete password from user var and set some additional data
    delete user.password;
    user = {
      ...user,
      accessToken,
      expiresIn: config.ACCESS_TOKEN_EXPIRE - 1000,
    };
    //response - set status, access and refresh cookie and send user data to frontend
    res
      .status(201)
      .cookie('jwt_token', accessToken, {
        expires: new Date(Date.now() + config.ACCESS_TOKEN_EXPIRE),
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
    //delete refresh token from db and erase cookies
    await RefreshTokens.deleteOne({ token: req.cookies.refresh_token });
    res
      .status(204)
      .cookie('jwt_token', { expires: Date.now() })
      .cookie('refresh_token', { expires: Date.now() });
  } catch (err) {
    res.json({ message: err });
  }
};

//Refresh token function
export const refreshToken = async (req, res) => {
  let refreshToken = req.cookies.refresh_token;
  if (refreshToken == null) return res.sendStatus(401);
  //chceck for refresh token in database and if exists, verify, then decode
  if (!(await RefreshTokens.findOne({ token: refreshToken })))
    return res.sendStatus(403);
  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, decoded) => {
      if (err) return res.sendStatus(403);
      //find decoded user ID in db and generate new access token
      let user;
      try {
        user = await User.findOne({ _id: decoded._id }).lean();
      } catch {
        return res.sendStatus(403);
      }
      const accessToken = generateAccessToken({ _id: user._id });
      //Update expiration on current refresh token (automaticly expiring after some time)
      await RefreshTokens.findOneAndUpdate(
        { token: refreshToken },
        { expireAt: Date.now() }
      );
      //delte password form user data and add some other info
      delete user.password;
      user = {
        ...user,
        accessToken,
        expiresIn: config.ACCESS_TOKEN_EXPIRE - 1000,
      };
      //response - set new access token cookie and send user info
      res
        .cookie('jwt_token', accessToken, {
          expires: new Date(Date.now() + config.ACCESS_TOKEN_EXPIRE),
          httpOnly: false,
        })
        .json(user)
        .status(201);
    }
  );
};
