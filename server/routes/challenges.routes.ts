import express from 'express';
import {
  getAllChallenges,
  createChallenge,
  updateChallenge,
  deleteChallenge
} from '../controllers/challenges.controller';

const router = express.Router();


// Challenge management routes
router.get('/challenges', getAllChallenges);
router.post('/challenges', createChallenge);
router.put('/challenges/:id', updateChallenge);
router.delete('/challenges/:id', deleteChallenge);

export default router;
