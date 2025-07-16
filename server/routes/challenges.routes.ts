import express from "express";
import {
  getAllChallenges,
  createChallenge,
  updateChallenge,
  deleteChallenge,
  getActiveChallenges,
} from "../controllers/challenges.controller";

const router = express.Router();
router.get("/active", getActiveChallenges);

// Challenge management routes
router.get("/challenges", getAllChallenges);
router.post("/challenges", createChallenge);
router.put("/challenges/:id", updateChallenge);
router.delete("/challenges/:id", deleteChallenge);

export default router;
