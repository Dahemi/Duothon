import express from 'express';
import { googleAuth } from '../controllers/teams.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = express.Router();

// Public routes
router.post('/auth/google', googleAuth);

// Protected routes
router.get('/current', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const team = await Team.findOne({ email: req.user?.email });
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }
    res.json({ team });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;