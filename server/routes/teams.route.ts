// server/routes/teams.route.ts
import express from "express";
import { googleAuth, getCurrentTeam } from "../controllers/teams.controller";
import { authenticateFirebase } from "../middleware/authMiddleware";

const router = express.Router();

// Public routes
router.post("/auth/google", googleAuth);

// Protected routes
router.get("/current", authenticateFirebase, getCurrentTeam);

export default router;
