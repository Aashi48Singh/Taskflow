import Task from "../models/Task.js";
import createNotification from "./createNotification.js";

const checkTaskDeadlines = async () => {
  try {
    const now = new Date();

    const tasks = await Task.find({
      status: "pending",
      dueDate: { $ne: null },
    });

    for (const task of tasks) {
      const dueDate = new Date(task.dueDate);

      const diffMs = dueDate.getTime() - now.getTime();
      const diffMinutes = diffMs / (1000 * 60);

      // 1 day before
      if (diffMinutes <= 24 * 60 && diffMinutes > 23 * 60) {
        await createNotification({
          user: task.user,
          task: task._id,
          type: "one_day_before",
          title: "Task due tomorrow",
          message: `"${task.title}" is due tomorrow.`,
          reminderKey: `${task._id}-one-day`,
        });
      }

      // 1 hour before
      if (diffMinutes <= 60 && diffMinutes > 59) {
        await createNotification({
          user: task.user,
          task: task._id,
          type: "one_hour_before",
          title: "Task due in 1 hour",
          message: `"${task.title}" is due in about 1 hour.`,
          reminderKey: `${task._id}-one-hour`,
        });
      }

      // Deadline reached
      if (diffMinutes <= 0 && diffMinutes > -1) {
        await createNotification({
          user: task.user,
          task: task._id,
          type: "deadline",
          title: "Task deadline reached",
          message: `"${task.title}" has reached its deadline.`,
          reminderKey: `${task._id}-deadline`,
        });
      }

      // Overdue
      if (diffMinutes <= -1) {
        await createNotification({
          user: task.user,
          task: task._id,
          type: "overdue",
          title: "Task overdue",
          message: `"${task.title}" is overdue.`,
          reminderKey: `${task._id}-overdue`,
        });
      }
    }
  } catch (error) {
    console.error("Reminder service error:", error);
  }
};

export default checkTaskDeadlines;