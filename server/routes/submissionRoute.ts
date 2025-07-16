import express from 'express';
import { Router } from 'express';
import { 
  createSubmission, 
  getSubmissions, 
  getSubmissionById,
  updateSubmissionStatus 
} from '../controllers/submmissionController';

const router: Router = express.Router();

// Create new submission
router.post('/', createSubmission);

// Get all submissions
router.get('/', getSubmissions);

// Get submission by ID
router.get('/:id', getSubmissionById);

// Update submission status
router.patch('/:id/status', updateSubmissionStatus);

export default router;