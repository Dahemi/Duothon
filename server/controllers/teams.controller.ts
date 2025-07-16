// server/controllers/teams.controller.ts
import { Request, Response } from "express";
import Team from "../models/teams.model";
import { AuthRequest } from "../middleware/authMiddleware";

export const googleAuth = async (req: Request, res: Response) => {
  try {
    const { email, teamName, authProvider } = req.body;

    if (!email || !teamName) {
      return res
        .status(400)
        .json({ message: "Email and team name are required" });
    }

    // Check if team already exists
    let team = await Team.findOne({ email });

    if (team) {
      return res.json({ team });
    }

    // Check if team name is already taken
    const existingTeam = await Team.findOne({ teamName });
    if (existingTeam) {
      return res.status(400).json({ message: "Team name already exists" });
    }

    // Create new team
    team = await Team.create({
      email,
      teamName,
      authProvider: authProvider || "google",
    });

    res.status(201).json({ team });
  } catch (error) {
    console.error("Error in Google Auth:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getCurrentTeam = async (req: AuthRequest, res: Response) => {
  try {
    const team = await Team.findOne({ email: req.user?.email });
    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }
    res.json({ team });
  } catch (error) {
    console.error("Error getting current team:", error);
    res.status(500).json({ message: "Server error" });
  }
};
