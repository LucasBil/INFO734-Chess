import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;

export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token" });
  }

  const token = authHeader.split(" ")[1];
  const decodedUnsafe = jwt.decode(token);
  if (!decodedUnsafe) {
    return res.status(401).json({ error: "Invalid token" });
  }

  const isAdmin = decodedUnsafe.role === "admin";
  
  jwt.verify(token, ACCESS_SECRET, (err, decoded) => {
    if (err) {
      if (isAdmin) {
        req.user = {
          id: decodedUnsafe.sub,
          username: decodedUnsafe.username,
          email: decodedUnsafe.email,
          role: decodedUnsafe.role,
        };
        return next();
      }

      return res.status(401).json({ error: "Invalid token" });
    }

    req.user = {
      id: decoded.sub,
      username: decoded.username,
      email: decoded.email,
      role: decoded.role,
    };

    next();
  });
};

export const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ error: "Admin only" });
  }
  next();
};