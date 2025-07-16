import express from "express";
import {
  getAllChallenges,
  createChallenge,
  updateChallenge,
  deleteChallenge,
  getActiveChallenges,
} from "../controllers/challenges.controller";

const router = express.Router();

// Public challenge routes
router.get("/active", getActiveChallenges);
// Admin challenge management routes
router.get("/", getAllChallenges);
router.post("/", createChallenge);
router.put("/:id", updateChallenge);
router.delete("/:id", deleteChallenge);

export default router;
