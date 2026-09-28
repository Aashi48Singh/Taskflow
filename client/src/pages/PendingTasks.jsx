import { useEffect, useState } from "react";

import {
  ListTodo,
  Loader2,
  CheckCircle2,
} from "lucide-react";

import Layout from "../components/Layout.jsx";
import TaskCard from "../components/TaskCard.jsx";

function PendingTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  // =========================
  // FETCH TASKS
  // =========================

  const fetchTasks = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/tasks",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message || "Failed to fetch tasks"
        );
        return;
      }

      // Only pending tasks
      const pendingTasks = (
        data.tasks || []
      ).filter(
        (task) => task.status === "pending"
      );

      setTasks(pendingTasks);
    } catch (error) {
      console.error(
        "Pending tasks error:",
        error
      );

      alert("Unable to connect to server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      window.location.href = "/login";
      return;
    }

    fetchTasks();
  }, []);

  // =========================
  // COMPLETE TASK
  // =========================

  const handleComplete = async (taskId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/tasks/${taskId}/toggle`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message ||
            "Failed to update task"
        );
        return;
      }

      // Remove from pending list
      setTasks((currentTasks) =>
        currentTasks.filter(
          (task) => task._id !== taskId
        )
      );

      window.dispatchEvent(
        new Event("taskUpdated")
      );
    } catch (error) {
      console.error(
        "Complete task error:",
        error
      );

      alert("Unable to update task");
    }
  };

  // =========================
  // DELETE TASK
  // =========================

  const handleDelete = async (taskId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/tasks/${taskId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message ||
            "Failed to delete task"
        );
        return;
      }

      setTasks((currentTasks) =>
        currentTasks.filter(
          (task) => task._id !== taskId
        )
      );

      window.dispatchEvent(
        new Event("taskUpdated")
      );
    } catch (error) {
      console.error(
        "Delete task error:",
        error
      );

      alert("Unable to delete task");
    }
  };

  return (
    <Layout activePage="Pending Tasks">

      <div className="p-4 sm:p-5 lg:p-6 xl:p-7">

        {/* =========================
            HEADER
        ========================= */}

        <div className="mb-5 lg:mb-6">

          <div className="flex items-center gap-2.5">

            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-purple-100 flex items-center justify-center shrink-0">

              <ListTodo
                className="text-purple-600"
                size={22}
              />

            </div>

            <div>

              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Pending Tasks
              </h1>

              <p className="text-sm text-gray-500 mt-0.5">
                Tasks that still need to be completed.
              </p>

            </div>

          </div>

        </div>

        {/* =========================
            LOADING
        ========================= */}

        {loading ? (

          <div className="bg-white rounded-2xl border p-8 sm:p-10 text-center">

            <Loader2
              className="animate-spin text-purple-600 mx-auto"
              size={28}
            />

            <p className="text-sm text-gray-500 mt-3">
              Loading pending tasks...
            </p>

          </div>

        ) : tasks.length === 0 ? (

          /* =========================
             EMPTY STATE
          ========================= */

          <div className="bg-white rounded-2xl border p-8 sm:p-10 text-center">

            <div className="w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center mx-auto">

              <CheckCircle2
                className="text-green-600"
                size={28}
              />

            </div>

            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mt-4">
              No pending tasks
            </h2>

            <p className="text-sm text-gray-500 mt-1.5">
              You're all caught up!
            </p>

          </div>

        ) : (

          /* =========================
             TASKS
          ========================= */

          <div className="space-y-3">

            {tasks.map((task) => (

              <TaskCard
                key={task._id}
                task={task}
                onComplete={handleComplete}
                onDelete={handleDelete}
              />

            ))}

          </div>

        )}

      </div>

    </Layout>
  );
}

export default PendingTasks;