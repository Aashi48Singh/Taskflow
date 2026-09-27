import { useEffect, useState } from "react";

import {
  CheckCircle2,
  Loader2,
  Trophy,
} from "lucide-react";

import Layout from "../components/Layout.jsx";
import TaskCard from "../components/TaskCard.jsx";

function CompletedTasks() {
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

      // Only completed tasks
      const completedTasks =
        (data.tasks || []).filter(
          (task) =>
            task.status === "completed"
        );

      setTasks(completedTasks);

    } catch (error) {
      console.error(
        "Completed tasks error:",
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
  // MARK AS PENDING
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

      // Remove from completed list
      setTasks((currentTasks) =>
        currentTasks.filter(
          (task) => task._id !== taskId
        )
      );

    } catch (error) {
      console.error(
        "Update task error:",
        error
      );

      alert("Unable to update task");
    }
  };

  // =========================
  // DELETE
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

    } catch (error) {
      console.error(
        "Delete task error:",
        error
      );

      alert("Unable to delete task");
    }
  };

  return (
    <Layout activePage="Completed Tasks">

      <div className="p-6 lg:p-8">

        {/* HEADER */}

        <div className="mb-8">

          <div className="flex items-center gap-3">

            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">

              <CheckCircle2
                className="text-green-600"
                size={25}
              />

            </div>

            <div>

              <h1 className="text-3xl font-bold text-gray-900">
                Completed Tasks
              </h1>

              <p className="text-gray-500 mt-1">
                Tasks you have successfully completed.
              </p>

            </div>

          </div>

        </div>

        {/* LOADING */}

        {loading ? (

          <div className="bg-white rounded-2xl border p-12 text-center">

            <Loader2
              className="animate-spin text-purple-600 mx-auto"
              size={35}
            />

            <p className="text-gray-500 mt-4">
              Loading completed tasks...
            </p>

          </div>

        ) : tasks.length === 0 ? (

          /* EMPTY */

          <div className="bg-white rounded-2xl border p-12 text-center">

            <div className="w-16 h-16 rounded-2xl bg-purple-100 flex items-center justify-center mx-auto">

              <Trophy
                className="text-purple-600"
                size={32}
              />

            </div>

            <h2 className="text-xl font-semibold text-gray-800 mt-5">
              No completed tasks
            </h2>

            <p className="text-gray-500 mt-2">
              Complete a task and it will appear here.
            </p>

          </div>

        ) : (

          /* TASKS */

          <div className="space-y-4">

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

export default CompletedTasks;