import { Request, Response } from "express";
import Challenge from "../models/challenges.models";

// GET all challenges
export const getAllChallenges = async (req: Request, res: Response) => {
  try {
    const challenges = await Challenge.find().sort({ createdAt: -1 });
    res.json(challenges);
  } catch (error) {
    console.error("Error fetching challenges:", error);
    res.status(500).json({ message: "Failed to fetch challenges", error });
  }
};

// POST create challenge
export const createChallenge = async (req: Request, res: Response) => {
  try {
    const { title, algorithmicProblem, buildathonProblem, correctFlag } =
      req.body;

    // Validate required fields
    if (!title || !algorithmicProblem || !buildathonProblem || !correctFlag) {
      return res.status(400).json({
        message:
          "Missing required fields: title, algorithmicProblem, buildathonProblem, correctFlag",
      });
    }

    const challenge = new Challenge({
      title,
      algorithmicProblem,
      buildathonProblem,
      correctFlag,
    });

    await challenge.save();
    res
      .status(201)
      .json({ message: "Challenge created successfully", challenge });
  } catch (error) {
    console.error("Error creating challenge:", error);
    res.status(500).json({ message: "Failed to create challenge", error });
  }
};

// PUT update challenge
export const updateChallenge = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updated = await Challenge.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res.status(404).json({ message: "Challenge not found" });
    }

    res.json({ message: "Challenge updated successfully", challenge: updated });
  } catch (error) {
    console.error("Error updating challenge:", error);
    res.status(500).json({ message: "Failed to update challenge", error });
  }
};

// DELETE challenge
export const deleteChallenge = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const deleted = await Challenge.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Challenge not found" });
    }

    res.json({ message: "Challenge deleted successfully" });
  } catch (error) {
    console.error("Error deleting challenge:", error);
    res.status(500).json({ message: "Failed to delete challenge", error });
  }
};

export const getActiveChallenges = async (req: Request, res: Response) => {
  try {
    const challenges = await Challenge.find().sort({ createdAt: -1 });
    res.json(challenges);
  } catch (error) {
    console.error("Error fetching active challenges:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch active challenges", error });
  }
};
