import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors"; // ← ADD THIS (use import, not require)
import { swaggerDocs } from "./config/swagger.js";

import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.route.js";
import gameRoutes from "./routes/game.routes.js";

const app = express();

// CORS configuration - ADD THIS BEFORE OTHER MIDDLEWARE
const corsOptions = {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions)); // ← ADD THIS

// Other middleware
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/games", gameRoutes);

swaggerDocs(app);

export default app;