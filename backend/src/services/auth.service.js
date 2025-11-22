import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import dotenv from "dotenv";
dotenv.config();

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
const ACCESS_EXPIRES = process.env.ACCESS_TOKEN_EXPIRES;
const REFRESH_EXPIRES = process.env.REFRESH_TOKEN_EXPIRES;

export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

export const comparePassword = (password, hash) => {
  return bcrypt.compare(password, hash);
};

export const generateAccessToken = (payload) => {
  return jwt.sign(payload, ACCESS_SECRET, { expiresIn: ACCESS_EXPIRES });
};

export const generateRefreshToken = (payload) => {
  return jwt.sign(payload, REFRESH_SECRET, { expiresIn: REFRESH_EXPIRES });
};

export const saveRefreshToken = async (userId, token) => {
  const user = await User.findById(userId);
  user.refreshTokens.push({ token });
  await user.save();
};

export const removeRefreshToken = async (userId, token) => {
  await User.findByIdAndUpdate(userId, {
    $pull: { refreshTokens: { token } },
  });
};

export const findUserByRefreshToken = async (token) => {
  return User.findOne({ "refreshTokens.token": token });
};

export const createUser = async ({ username, email, password }) => {
  const hashed = await hashPassword(password);
  const user = new User({ username, email, password: hashed });
  return user.save();
};

export const findUserByCredentials = async (usernameOrEmail, password) => {
  const user = await User.findOne({
    $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
  });
  if (!user) return null;
  const ok = await comparePassword(password, user.password);
  if (!ok) return null;
  return user;
};
