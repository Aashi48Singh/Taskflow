import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";

import checkTaskDeadlines from "./utils/reminderService.js";

dotenv.config();

console.log("MONGO_URI:", process.env.MONGO_URI);

const app = express();

app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.json({
    message: "TaskFlow API is running",
  });
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/notifications", notificationRoutes);

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });

    // Check task deadlines immediately when server starts
    checkTaskDeadlines();

    // Check task deadlines every 1 minute
    setInterval(() => {
      checkTaskDeadlines();
    }, 60 * 1000);
  })
  .catch((error) => {
    console.error("MongoDB connection failed:");
    console.error(error.message);
  });