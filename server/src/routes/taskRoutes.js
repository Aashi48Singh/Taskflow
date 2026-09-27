import express from "express";
import Task from "../models/Task.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

/* =========================
   CREATE TASK
========================= */

router.post("/", authMiddleware, async (req, res) => {
  try {
    const {
      title,
      description,
      priority,
      dueDate,
    } = req.body;

    if (!title) {
      return res.status(400).json({
        message: "Task title is required",
      });
    }

    const task = await Task.create({
      title,
      description: description || "",
      priority: priority || "low",
      dueDate: dueDate || null,
      user: req.userId,
    });

    res.status(201).json({
      message: "Task created successfully",
      task,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create task",
      error: error.message,
    });
  }
});


/* =========================
   GET ALL USER TASKS
========================= */

router.get("/", authMiddleware, async (req, res) => {
  try {
    const tasks = await Task.find({
      user: req.userId,
    }).sort({
      createdAt: -1,
    });

    res.json({
      tasks,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch tasks",
      error: error.message,
    });
  }
});


/* =========================
   TOGGLE TASK STATUS
========================= */

router.patch("/:id/toggle", authMiddleware, async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.userId,
    });

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    task.status =
      task.status === "completed"
        ? "pending"
        : "completed";

    await task.save();

    res.json({
      message: "Task status updated",
      task,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update task",
      error: error.message,
    });
  }
});


/* =========================
   DELETE TASK
========================= */

router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.userId,
    });

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    res.json({
      message: "Task deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete task",
      error: error.message,
    });
  }
});


export default router;