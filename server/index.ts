import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import * as dotenv from "dotenv";
import path from "path";
import submissionRoutes from './routes/submissionRoute';

// Load .env file from server directory
dotenv.config({ path: path.join(__dirname, ".env") });

const app = express();

app.use(cors());
app.use(express.json());

//ROutes
app.use('/api/submissions', submissionRoutes);
app.get("/", (req, res) => res.send("API Running"));

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("MONGO_URI environment variable is not defined");
  process.exit(1);
}

mongoose
  .connect(MONGO_URI)
  .then(() => app.listen(PORT, () => console.log(`Server running on ${PORT}`)))
  .catch((err) => console.error(err));
