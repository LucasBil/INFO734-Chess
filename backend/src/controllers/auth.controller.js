import {
  createUser,
  findUserByCredentials,
  generateAccessToken,
  generateRefreshToken,
  saveRefreshToken,
  removeRefreshToken,
  findUserByRefreshToken,
} from "../services/auth.service.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
const ACCESS_EXPIRES = process.env.ACCESS_TOKEN_EXPIRES;

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = await createUser({ username, email, password });
    res.status(201).json({ id: user._id, username: user.username, email: user.email });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { identifier, password } = req.body;
    console.log(identifier, password);
    const user = await findUserByCredentials(identifier, password);
    console.log(user);
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const payload = { sub: user._id, username: user.username };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    await saveRefreshToken(user._id, refreshToken);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ accessToken, expiresIn: ACCESS_EXPIRES });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const refresh = async (req, res) => {
  try {
    const token = req.cookies?.refreshToken;
    if (!token) return res.status(401).json({ error: "No token" });

    jwt.verify(token, REFRESH_SECRET, async (err, decoded) => {
      if (err) return res.status(401).json({ error: "Invalid token" });

      const user = await findUserByRefreshToken(token);
      if (!user) return res.status(401).json({ error: "Token revoked" });

      const payload = { sub: decoded.sub, username: decoded.username };
      const accessToken = generateAccessToken(payload);
      res.json({ accessToken, expiresIn: ACCESS_EXPIRES });
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const logout = async (req, res) => {
  try {
    const token = req.cookies?.refreshToken;
    if (token) {
      const user = await findUserByRefreshToken(token);
      if (user) await removeRefreshToken(user._id, token);
    }
    res.clearCookie("refreshToken", { httpOnly: true, sameSite: "strict" });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
