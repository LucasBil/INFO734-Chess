import express from "express";
import * as authController from "../controllers/auth.controller.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication endpoints
 */

/**
 * @swagger
 * /auth/register:
 *  post:
 *    tags: [Auth]
 *    summary: Register new user
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - username
 *              - email
 *              - password
 *            properties:
 *              username:
 *                type: string
 *                example: "lucas74"
 *              email:
 *                type: string
 *                example: "lucas@example.com"
 *              password:
 *                type: string
 *                example: "SuperPassword123!"
 *    responses:
 *      201:
 *        description: User created
 */
router.post("/register", authController.register);

/**
 * @swagger
 * /auth/login:
 *  post:
 *    tags: [Auth]
 *    summary: Login user
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - identifier
 *              - password
 *            properties:
 *              identifier:
 *                type: string
 *                example: "lucas74"
 *              password:
 *                type: string
 *                example: "SuperPassword123!"
 *    responses:
 *      200:
 *        description: Returns access token and sets refresh cookie
 */
router.post("/login", authController.login);

/**
 * @swagger
 * /auth/refresh:
 *  post:
 *    tags: [Auth]
 *    summary: Refresh access token using refresh cookie
 *    responses:
 *      200:
 *        description: New access token
 */
router.post("/refresh", authController.refresh);

/**
 * @swagger
 * /auth/logout:
 *  post:
 *    tags: [Auth]
 *    summary: Logout user and revoke refresh token
 */
router.post("/logout", authController.logout);

export default router;
