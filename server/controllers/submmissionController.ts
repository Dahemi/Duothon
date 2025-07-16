import { Request, Response } from 'express';
import Submission from '../models/submissionModel';

export const createSubmission = async (req: Request, res: Response) => {
  try {
    const submission = new Submission({
      team: req.body.team,
      challenge: req.body.challenge,
      type: req.body.type,
      code: req.body.code,
      language: req.body.language,
      output: req.body.output,
      isCorrect: req.body.isCorrect,
      githubLink: req.body.githubLink
    });

    const savedSubmission = await submission.save();
    res.status(201).json(savedSubmission);
  } catch (error) {
    res.status(500).json({ 
      message: "Error creating submission",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
};

export const getSubmissions = async (req: Request, res: Response) => {
  try {
    const submissions = await Submission.find()
      .populate('team', 'name')
      .populate('challenge', 'title');
    res.status(200).json(submissions);
  } catch (error) {
    res.status(500).json({ 
      message: "Error fetching submissions",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
};

export const getSubmissionById = async (req: Request, res: Response) => {
  try {
    const submission = await Submission.findById(req.params.id)
      .populate('team', 'name')
      .populate('challenge', 'title');
    
    if (!submission) {
      return res.status(404).json({ message: "Submission not found" });
    }
    
    res.status(200).json(submission);
  } catch (error) {
    res.status(500).json({ 
      message: "Error fetching submission",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
};

export const updateSubmissionStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { isCorrect } = req.body;

    const submission = await Submission.findByIdAndUpdate(
      id,
      { isCorrect },
      { new: true }
    );

    if (!submission) {
      return res.status(404).json({ message: "Submission not found" });
    }

    res.status(200).json(submission);
  } catch (error) {
    res.status(500).json({ 
      message: "Error updating submission",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
};