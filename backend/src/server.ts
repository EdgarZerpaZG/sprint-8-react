import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./db";
import usersRouter from "./routes/users";

dotenv.config();

export const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/users", usersRouter);

// Health-check
app.get("/", (req, res) => {
  res.json({ message: "Backend running ✔" });
});

const PORT = process.env.PORT || 4000;

connectDB().then(() => {
  app.listen(PORT, () =>
    console.log(`🚀 Server running on http://localhost:${PORT}`)
  );
});