import express from "express";
import cookieParser from "cookie-parser";
import { swaggerDocs } from "./config/swagger.js";

import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.route.js";
import gameRoutes from "./routes/game.routes.js";

const app = express();

app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/games", gameRoutes);

swaggerDocs(app);

export default app;