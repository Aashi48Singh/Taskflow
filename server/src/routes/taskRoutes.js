import express from "express";
import Task from "../models/Task.js";
import authMiddleware from "../middleware/authMiddleware.js";
import createNotification from "../utils/createNotification.js";

const router = express.Router();

// ========================================
// CREATE TASK
// ========================================

router.post("/", authMiddleware, async (req, res) => {
  try {
    const {
      title,
      description,
      priority,
      dueDate,
    } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        message: "Task title is required",
      });
    }

    const task = await Task.create({
      title: title.trim(),
      description: description || "",
      priority: priority || "low",
      dueDate: dueDate || null,
      user: req.userId,
    });

    await createNotification({
      user: req.userId,
      task: task._id,
      type: "task_created",
      title: "Task created",
      message: `"${task.title}" has been added to your tasks.`,
    });

    res.status(201).json({
      message: "Task created successfully",
      task,
    });
  } catch (error) {
    console.error("Create task error:", error);

    res.status(500).json({
      message: "Failed to create task",
      error: error.message,
    });
  }
});

// ========================================
// GET USER TASKS
// ========================================

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
    console.error("Fetch tasks error:", error);

    res.status(500).json({
      message: "Failed to fetch tasks",
      error: error.message,
    });
  }
});

// ========================================
// MOVE TASK TO IN PROGRESS
// ========================================

router.patch(
  "/:id/start",
  authMiddleware,
  async (req, res) => {
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

      task.status = "in-progress";

      await task.save();

      await createNotification({
        user: req.userId,
        task: task._id,
        type: "task_created",
        title: "Task started",
        message: `"${task.title}" is now in progress.`,
      });

      res.json({
        message: "Task moved to in progress",
        task,
      });
    } catch (error) {
      console.error(
        "Start task error:",
        error
      );

      res.status(500).json({
        message: "Failed to start task",
        error: error.message,
      });
    }
  }
);

// ========================================
// TOGGLE TASK STATUS
// ========================================

router.patch(
  "/:id/toggle",
  authMiddleware,
  async (req, res) => {
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

      /*
        Pending → Completed
        In Progress → Completed
        Completed → Pending
      */

      if (
        task.status === "pending" ||
        task.status === "in-progress"
      ) {
        task.status = "completed";
      } else {
        task.status = "pending";
      }

      await task.save();

      if (task.status === "completed") {
        await createNotification({
          user: req.userId,
          task: task._id,
          type: "task_completed",
          title: "Task completed 🎉",
          message: `"${task.title}" has been completed.`,
        });
      }

      res.json({
        message: "Task status updated",
        task,
      });
    } catch (error) {
      console.error(
        "Toggle task error:",
        error
      );

      res.status(500).json({
        message: "Failed to update task",
        error: error.message,
      });
    }
  }
);

// ========================================
// DELETE TASK
// ========================================

router.delete(
  "/:id",
  authMiddleware,
  async (req, res) => {
    try {
      const task =
        await Task.findOneAndDelete({
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
      console.error(
        "Delete task error:",
        error
      );

      res.status(500).json({
        message: "Failed to delete task",
        error: error.message,
      });
    }
  }
);

export default router;