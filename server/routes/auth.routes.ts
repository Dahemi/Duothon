import express from "express";
import { login, verifyToken } from "../controllers/auth.controller";
import { authenticateToken } from "../middleware/authMiddleware";

const router = express.Router();

// POST /api/auth/login - Login
router.post("/login", login);

// GET /api/auth/verify - Verify token
router.get("/verify", authenticateToken, verifyToken);

export default router;
