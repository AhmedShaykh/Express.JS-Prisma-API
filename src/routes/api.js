import ProfileController from "../controllers/ProfileController.js";
import AuthController from "../controllers/AuthController.js";
import NewsController from "../controllers/NewsController.js";
import authMiddleware from "../middleware/Authenticate.js";
import { Router } from "express";

const router = Router();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User created successfully
 *       400:
 *         description: Email already taken or validation error
 *       500:
 *         description: Internal server error
 */

router.post("/auth/register", AuthController.register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Log in a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Log in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 access_token:
 *                   type: string
 *       400:
 *         description: Invalid credentials or validation error
 *       500:
 *         description: Internal server error
 */

router.post("/auth/login", AuthController.login);

/**
 * @swagger
 * /profile:
 *   get:
 *     summary: Get authenticated user's profile
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns the authenticated user's profile
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                 user:
 *                   type: object
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

router.get("/profile", authMiddleware, ProfileController.index);

/**
 * @swagger
 * /profile/{id}:
 *   put:
 *     summary: Update profile picture
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - profile
 *             properties:
 *               profile:
 *                 type: string
 *                 format: binary
 *                 description: Profile image file
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       400:
 *         description: Invalid file or missing profile image
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

router.put("/profile/:id", authMiddleware, ProfileController.update);

/**
 * @swagger
 * /api/news:
 *   get:
 *     summary: Get all news
 *     tags: [News]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: A list of news
 *       500:
 *         description: Internal server error
 */

router.get("/news", NewsController.index);

/**
 * @swagger
 * /api/news:
 *   post:
 *     summary: Create a news article
 *     tags: [News]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - image
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: News created successfully
 *       400:
 *         description: Validation failed
 *       500:
 *         description: Internal server error
 */

router.post("/news", authMiddleware, NewsController.store);

/**
 * @swagger
 * /api/news/{id}:
 *   get:
 *     summary: Get a single news article
 *     tags: [News]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: News details
 *       404:
 *         description: News not found
 *       500:
 *         description: Internal server error
 */

router.get("/news/:id", NewsController.show);

/**
 * @swagger
 * /api/news/{id}:
 *   put:
 *     summary: Update a news article
 *     tags: [News]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: News updated successfully
 *       400:
 *         description: Validation failed
 *       404:
 *         description: News not found
 *       500:
 *         description: Internal server error
 */

router.put("/news/:id", authMiddleware, NewsController.update);

/**
 * @swagger
 * /api/news/{id}:
 *   delete:
 *     summary: Delete a news article
 *     tags: [News]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: News deleted successfully
 *       404:
 *         description: News not found
 *       500:
 *         description: Internal server error
 */

router.delete("/news/:id", authMiddleware, NewsController.destroy);

export default router;