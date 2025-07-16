import express from "express";
import { authenticateToken, requireAdmin } from "../middleware/authMiddleware";

// Extend Express Request type to include 'user'
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

const router = express.Router();

// Admin dashboard route
router.get("/dashboard", authenticateToken, requireAdmin, (req, res) => {
  res.json({
    success: true,
    message: "Welcome to admin dashboard",
    user: req.user,
  });
});

// Get all teams (admin only)
router.get("/teams", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const Team = require("../models/teams.model").default;
    const teams = await Team.find({}).sort({ createdAt: -1 });
    res.json({
      success: true,
      teams,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching teams",
      error,
    });
  }
});

export default router;
