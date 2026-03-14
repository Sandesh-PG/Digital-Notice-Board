import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./config/db.js";
import noticeRoutes from "./routes/noticeRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import timetableRoutes from "./routes/timetableRoutes.js";

dotenv.config();

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/notices", noticeRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/timetables", timetableRoutes);

app.get("/", (req, res) => {
  res.send("Digital Notice Board API running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});