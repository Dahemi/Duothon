import mongoose, { Document, Schema } from 'mongoose';

export interface IChallenge extends Document {
  title: string;
  algorithmicProblem: {
    description: string;
    inputFormat: string;
    outputFormat: string;
    constraints: string;
    examples: Array<{
      input: string;
      output: string;
      explanation?: string;
    }>;
  };
  buildathonProblem: {
    description: string;
    requirements: string[];
    techStack?: string[];
    deliverables: string[];
  };
  correctFlag: string;
  createdAt: Date;
  updatedAt: Date;
}

const ChallengeSchema: Schema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  algorithmicProblem: {
    description: {
      type: String,
      required: true
    },
    inputFormat: {
      type: String,
      required: true
    },
    outputFormat: {
      type: String,
      required: true
    },
    constraints: {
      type: String,
      required: true
    },
    examples: [{
      input: {
        type: String,
        required: true
      },
      output: {
        type: String,
        required: true
      },
      explanation: {
        type: String
      }
    }]
  },
  buildathonProblem: {
    description: {
      type: String,
      required: true
    },
    requirements: [{
      type: String,
      required: true
    }],
    techStack: [{
      type: String
    }],
    deliverables: [{
      type: String,
      required: true
    }]
  },
  correctFlag: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

export default mongoose.model<IChallenge>('Challenge', ChallengeSchema);
