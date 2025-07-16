import { Request, Response } from 'express';
import Team from '../models/teams.model';

export const googleAuth = async (req: Request, res: Response) => {
  try {
    const { email, teamName, authProvider } = req.body;

    // Check if team already exists
    let team = await Team.findOne({ email });

    if (team) {
      return res.json({ team });
    }

    // Create new team
    team = await Team.create({
      email,
      teamName,
      authProvider,
    });

    res.status(201).json({ team });
  } catch (error) {
    console.error('Error in Google Auth:', error);
    res.status(500).json({ message: 'Server error' });
  }
};