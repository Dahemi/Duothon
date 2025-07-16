import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema({
  team: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
  challenge: { type: mongoose.Schema.Types.ObjectId, ref: 'Challenge' },
  type: { type: String, enum: ['algorithmic', 'buildathon'], required: true },
  code: String, // for algorithmic
  language: String,
  output: String,
  isCorrect: Boolean,
  githubLink: String, // for buildathon
  submittedAt: { type: Date, default: Date.now }
});

export default mongoose.model('Submission', submissionSchema);