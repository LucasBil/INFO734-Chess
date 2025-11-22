import express from "express";
import { authenticate, adminOnly  } from "../middleware/auth.middleware.js";

import {
  create,
  getAll,
  getOne,
  update,
  deleteOne,
  addMove,
} from "../controllers/game.controller.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Games
 *   description: Game management (Chess sessions)
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Move:
 *       type: object
 *       properties:
 *         fen:
 *           type: string
 *           example: "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1"
 *         date:
 *           type: string
 *           format: date-time
 *           example: "2025-02-10T10:00:00Z"
 *
 *     Game:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         sessionId:
 *           type: string
 *           example: "session-123"
 *         white:
 *           type: string
 *           description: User ID
 *         black:
 *           type: string
 *           description: User ID
 *         moves:
 *           type: array
 *           items:
 *             $ref: "#/components/schemas/Move"
 *         result:
 *           type: string
 *           example: "white"
 *         createdAt:
 *           type: string
 *           format: date-time
 *
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */


/**
 * @swagger
 * /games:
 *   get:
 *     tags: [Games]
 *     summary: Get all games (public)
 *     responses:
 *       200:
 *         description: List of all games
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/Game"
 */
router.get("/", getAll);

/**
 * @swagger
 * /games/{id}:
 *   get:
 *     tags: [Games]
 *     summary: Get one game by ID (public)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Game data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Game"
 *       404:
 *         description: Game not found
 */
router.get("/:id", getOne);

/**
 * @swagger
 * /games:
 *   post:
 *     tags: [Games]
 *     summary: Create a new game (admin only)
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [sessionId, white, black]
 *             properties:
 *               sessionId:
 *                 type: string
 *                 example: "session-987"
 *               white:
 *                 type: string
 *                 description: User ID
 *               black:
 *                 type: string
 *                 description: User ID
 *     responses:
 *       201:
 *         description: Game created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Game"
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin only
 */
router.post("/", authenticate, adminOnly, create);

/**
 * @swagger
 * /games/{id}:
 *   put:
 *     tags: [Games]
 *     summary: Update a game (admin only)
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/Game"
 *     responses:
 *       200:
 *         description: Game updated
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin only
 *       404:
 *         description: Game not found
 */
router.put("/:id", authenticate, adminOnly, update);

/**
 * @swagger
 * /games/{id}:
 *   delete:
 *     tags: [Games]
 *     summary: Delete a game (admin only)
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Game deleted
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin only
 *       404:
 *         description: Game not found
 */
router.delete("/:id", authenticate, adminOnly, deleteOne);

/**
 * @swagger
 * /games/{id}/move:
 *   post:
 *     tags: [Games]
 *     summary: Add a move to a game (admin only)
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [fen]
 *             properties:
 *               fen:
 *                 type: string
 *                 example: "rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2"
 *     responses:
 *       200:
 *         description: Move added
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin only
 *       404:
 *         description: Game not found
 */
router.post("/:id/move", authenticate, adminOnly, addMove);

export default router;
