import Notification from "../models/Notification.js";

const createNotification = async ({
  user,
  task = null,
  type,
  title,
  message,
  reminderKey = null,
}) => {
  try {
    // Prevent duplicate reminder notifications
    if (reminderKey) {
      const existingNotification = await Notification.findOne({
        reminderKey,
      });

      if (existingNotification) {
        return existingNotification;
      }
    }

    const notification = await Notification.create({
      user,
      task,
      type,
      title,
      message,
      reminderKey,
    });

    return notification;
  } catch (error) {
    console.error("Create notification error:", error);
    return null;
  }
};

export default createNotification;