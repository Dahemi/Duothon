import mongoose from "mongoose";

const teamSchema = new mongoose.Schema({
  teamName: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true }, // for OAuth
  authProvider: { type: String, enum: ["google", "github"], required: true },
  createdAt: { type: Date, default: Date.now },
  challengesSolved: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Challenge" },
  ],
  buildathonSubmissions: [
    {
      challengeId: { type: mongoose.Schema.Types.ObjectId, ref: "Challenge" },
      githubLink: String,
      submittedAt: Date,
    },
  ],
});

export default mongoose.model("Team", teamSchema);
