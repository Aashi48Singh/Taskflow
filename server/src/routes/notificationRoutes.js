import express from "express";

import Notification from "../models/Notification.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();


// ============================================
// GET NOTIFICATIONS
// ============================================

router.get(
  "/",
  authMiddleware,
  async (req, res) => {
    try {
      const notifications =
        await Notification.find({
          user: req.userId,
        })
          .sort({
            createdAt: -1,
          })
          .limit(50);

      const unreadCount =
        await Notification.countDocuments({
          user: req.userId,
          read: false,
        });

      res.json({
        notifications,
        unreadCount,
      });
    } catch (error) {
      res.status(500).json({
        message:
          "Failed to fetch notifications",
        error: error.message,
      });
    }
  }
);


// ============================================
// MARK ONE AS READ
// ============================================

router.patch(
  "/:id/read",
  authMiddleware,
  async (req, res) => {
    try {
      const notification =
        await Notification.findOneAndUpdate(
          {
            _id: req.params.id,
            user: req.userId,
          },
          {
            read: true,
          },
          {
            new: true,
          }
        );

      if (!notification) {
        return res.status(404).json({
          message: "Notification not found",
        });
      }

      res.json({
        message: "Notification marked as read",
        notification,
      });
    } catch (error) {
      res.status(500).json({
        message:
          "Failed to update notification",
        error: error.message,
      });
    }
  }
);


// ============================================
// MARK ALL AS READ
// ============================================

router.patch(
  "/read-all",
  authMiddleware,
  async (req, res) => {
    try {
      await Notification.updateMany(
        {
          user: req.userId,
          read: false,
        },
        {
          read: true,
        }
      );

      res.json({
        message:
          "All notifications marked as read",
      });
    } catch (error) {
      res.status(500).json({
        message:
          "Failed to update notifications",
        error: error.message,
      });
    }
  }
);


// ============================================
// DELETE NOTIFICATION
// ============================================

router.delete(
  "/:id",
  authMiddleware,
  async (req, res) => {
    try {
      const notification =
        await Notification.findOneAndDelete({
          _id: req.params.id,
          user: req.userId,
        });

      if (!notification) {
        return res.status(404).json({
          message: "Notification not found",
        });
      }

      res.json({
        message:
          "Notification deleted successfully",
      });
    } catch (error) {
      res.status(500).json({
        message:
          "Failed to delete notification",
        error: error.message,
      });
    }
  }
);

export default router;