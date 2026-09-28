import { useEffect, useMemo, useState } from "react";
import API_URL from "../config.js";
import {
  Home,
  Flame,
  Plus,
  Filter,
  X,
  CheckCircle2,
  ListTodo,
  Clock3,
  TrendingUp,
} from "lucide-react";

import Layout from "../components/Layout.jsx";
import StatsCard from "../components/StatsCard.jsx";
import TaskCard from "../components/TaskCard.jsx";

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "low",
    dueDate: "",
  });

  const token = localStorage.getItem("token");

  // =========================
  // FETCH TASKS
  // =========================

  const fetchTasks = async () => {
    try {
      if (!token) {
        window.location.href = "/login";
        return;
      }

      const response = await fetch(
        `${API_URL}/api/tasks`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to load tasks");
        return;
      }

      setTasks(data.tasks || []);
    } catch (error) {
      console.error("Fetch tasks error:", error);
      alert("Unable to connect to server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // =========================
  // FORM
  // =========================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // =========================
  // CREATE TASK
  // =========================

  const handleCreateTask = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      alert("Please enter task title");
      return;
    }

    try {
      setSaving(true);

      const response = await fetch(
        `${API_URL}/api/tasks`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: formData.title,
            description: formData.description,
            priority: formData.priority,
            dueDate: formData.dueDate || null,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to create task");
        return;
      }

      setTasks((previousTasks) => [
        data.task,
        ...previousTasks,
      ]);

      setFormData({
        title: "",
        description: "",
        priority: "low",
        dueDate: "",
      });

      setShowModal(false);

      window.dispatchEvent(new Event("taskUpdated"));
    } catch (error) {
      console.error("Create task error:", error);
      alert("Unable to connect to server");
    } finally {
      setSaving(false);
    }
  };

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
        alert(data.message || "Failed to update task");
        return;
      }

      setTasks((previousTasks) =>
        previousTasks.map((task) =>
          task._id === taskId ? data.task : task
        )
      );

      window.dispatchEvent(new Event("taskUpdated"));
    } catch (error) {
      console.error("Complete task error:", error);
      alert("Unable to update task");
    }
  };

  // =========================
  // DELETE TASK
  // =========================

  const handleDelete = async (taskId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmDelete) {
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
        alert(data.message || "Failed to delete task");
        return;
      }

      setTasks((previousTasks) =>
        previousTasks.filter(
          (task) => task._id !== taskId
        )
      );

      window.dispatchEvent(new Event("taskUpdated"));
    } catch (error) {
      console.error("Delete task error:", error);
      alert("Unable to delete task");
    }
  };

  // =========================
  // STATISTICS
  // =========================

  const totalTasks = tasks.length;

  const completedTasks = tasks.filter(
    (task) => task.status === "completed"
  ).length;

  const pendingTasks = tasks.filter(
    (task) => task.status === "pending"
  ).length;

  const lowPriority = tasks.filter(
    (task) => task.priority === "low"
  ).length;

  const mediumPriority = tasks.filter(
    (task) => task.priority === "medium"
  ).length;

  const highPriority = tasks.filter(
    (task) => task.priority === "high"
  ).length;

  const completionRate =
    totalTasks === 0
      ? 0
      : Math.round((completedTasks / totalTasks) * 100);

  // =========================
  // FILTER TASKS
  // =========================

  const filteredTasks = useMemo(() => {
    const now = new Date();

    return tasks.filter((task) => {
      if (activeFilter === "All") {
        return true;
      }

      if (activeFilter === "Completed") {
        return task.status === "completed";
      }

      if (activeFilter === "Pending") {
        return task.status === "pending";
      }

      if (activeFilter === "High") {
        return task.priority === "high";
      }

      if (activeFilter === "Medium") {
        return task.priority === "medium";
      }

      if (activeFilter === "Low") {
        return task.priority === "low";
      }

      if (activeFilter === "Today") {
        if (!task.dueDate) {
          return false;
        }

        const due = new Date(task.dueDate);

        return (
          due.getFullYear() === now.getFullYear() &&
          due.getMonth() === now.getMonth() &&
          due.getDate() === now.getDate()
        );
      }

      if (activeFilter === "Week") {
        if (!task.dueDate) {
          return false;
        }

        const due = new Date(task.dueDate);

        const startOfToday = new Date(now);
        startOfToday.setHours(0, 0, 0, 0);

        const sevenDaysLater = new Date(startOfToday);
        sevenDaysLater.setDate(
          sevenDaysLater.getDate() + 7
        );

        return (
          due >= startOfToday &&
          due <= sevenDaysLater
        );
      }

      return true;
    });
  }, [tasks, activeFilter]);

  // =========================
  // RECENT ACTIVITY
  // =========================

  const recentTasks = [...tasks]
    .sort(
      (a, b) =>
        new Date(b.createdAt) -
        new Date(a.createdAt)
    )
    .slice(0, 4);

  const formatActivityDate = (date) => {
    if (!date) {
      return "";
    }

    return new Date(date).toLocaleDateString(
      "en-US",
      {
        month: "numeric",
        day: "numeric",
        year: "numeric",
      }
    );
  };

  return (
    <Layout activePage="Dashboard">
      <div className="p-4 sm:p-5 lg:p-6 xl:p-7">

        {/* =================================
            MAIN TWO COLUMN LAYOUT
        ================================= */}

        <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_400px] gap-5 lg:gap-6">

          {/* =================================
              LEFT SIDE
          ================================= */}

          <div className="min-w-0">

            {/* HEADER */}

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 lg:mb-6">

              <div>
                <div className="flex items-center gap-2.5">

                  <Home
                    className="text-purple-600"
                    size={25}
                  />

                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                    Task Overview
                  </h2>

                </div>

                <p className="text-sm sm:text-base text-gray-500 mt-1.5 ml-9">
                  Manage your tasks efficiently
                </p>

              </div>

              <button
                onClick={() => setShowModal(true)}
                className="flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold shadow-sm transition"
              >
                <Plus size={18} />
                Add New Task
              </button>

            </div>

            {/* =================================
                PRIORITY STAT CARDS
            ================================= */}

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">

              <StatsCard
                title="Total Tasks"
                value={totalTasks}
                icon={Home}
                onClick={() => setActiveFilter("All")}
                active={activeFilter === "All"}
              />

              <StatsCard
                title="Low Priority"
                value={lowPriority}
                icon={Flame}
                iconBg="bg-green-100"
                iconColor="text-green-600"
                onClick={() => setActiveFilter("Low")}
                active={activeFilter === "Low"}
              />

              <StatsCard
                title="Medium Priority"
                value={mediumPriority}
                icon={Flame}
                iconBg="bg-orange-100"
                iconColor="text-orange-600"
                onClick={() => setActiveFilter("Medium")}
                active={activeFilter === "Medium"}
              />

              <StatsCard
                title="High Priority"
                value={highPriority}
                icon={Flame}
                iconBg="bg-red-100"
                iconColor="text-red-600"
                onClick={() => setActiveFilter("High")}
                active={activeFilter === "High"}
              />

            </div>

            {/* =================================
                FILTER BAR
            ================================= */}

            <div className="mt-4 bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">

              <div className="flex items-center gap-2.5 mb-4">

                <Filter
                  className="text-purple-600"
                  size={19}
                />

                <h3 className="font-semibold text-base">
                  All Tasks
                </h3>

              </div>

              <div className="flex gap-2 flex-wrap">

                {[
                  "All",
                  "Today",
                  "Week",
                  "High",
                  "Medium",
                  "Low",
                ].map((filter) => (
                  <button
                    key={filter}
                    onClick={() =>
                      setActiveFilter(filter)
                    }
                    className={`px-4 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition ${
                      activeFilter === filter
                        ? "bg-purple-100 text-purple-600 border border-purple-500"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {filter}
                  </button>
                ))}

              </div>
            </div>

            {/* =================================
                TASK LIST
            ================================= */}

            <div className="mt-4 space-y-3">

              {loading ? (
                <div className="bg-white rounded-2xl border p-8 text-center">
                  <p className="text-sm text-gray-500">
                    Loading tasks...
                  </p>
                </div>
              ) : filteredTasks.length === 0 ? (
                <div className="bg-white rounded-2xl border p-8 text-center">

                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">

                    <Plus
                      className="text-purple-600"
                      size={22}
                    />

                  </div>

                  <h3 className="text-lg font-semibold text-gray-800">
                    No tasks found
                  </h3>

                  <p className="text-sm text-gray-500 mt-1.5">
                    Try another filter or create a new task.
                  </p>

                </div>
              ) : (
                filteredTasks.map((task) => (
                  <TaskCard
                    key={task._id}
                    task={task}
                    onComplete={handleComplete}
                    onDelete={handleDelete}
                  />
                ))
              )}

            </div>

          </div>

          {/* =================================
              RIGHT SIDE
          ================================= */}

          <div className="space-y-4">

            {/* =================================
                TASK STATISTICS
            ================================= */}

            <div className="bg-white rounded-2xl border border-purple-100 p-4 shadow-sm">

              <div className="flex items-center gap-2 mb-4">

                <TrendingUp
                  className="text-purple-600"
                  size={19}
                />

                <h3 className="font-semibold text-base">
                  Task Statistics
                </h3>

              </div>

              <div className="grid grid-cols-2 gap-2.5">

                {/* TOTAL */}

                <button
                  type="button"
                  onClick={() => setActiveFilter("All")}
                  className={`w-full text-left border rounded-xl p-3 transition ${
                    activeFilter === "All"
                      ? "border-purple-500 ring-2 ring-purple-100"
                      : "border-purple-100 hover:border-purple-300"
                  }`}
                >

                  <div className="flex items-center gap-2.5">

                    <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">

                      <ListTodo
                        className="text-purple-500"
                        size={17}
                      />

                    </div>

                    <div>

                      <p className="text-lg font-bold text-gray-900">
                        {totalTasks}
                      </p>

                      <p className="text-xs text-gray-500">
                        Total Tasks
                      </p>

                    </div>

                  </div>

                </button>

                {/* COMPLETED */}

                <button
                  type="button"
                  onClick={() => setActiveFilter("Completed")}
                  className={`w-full text-left border rounded-xl p-3 transition ${
                    activeFilter === "Completed"
                      ? "border-green-500 ring-2 ring-green-100"
                      : "border-green-100 hover:border-green-300"
                  }`}
                >

                  <div className="flex items-center gap-2.5">

                    <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">

                      <CheckCircle2
                        className="text-green-500"
                        size={17}
                      />

                    </div>

                    <div>

                      <p className="text-lg font-bold text-gray-900">
                        {completedTasks}
                      </p>

                      <p className="text-xs text-gray-500">
                        Completed
                      </p>

                    </div>

                  </div>

                </button>

                {/* PENDING */}

                <button
                  type="button"
                  onClick={() => setActiveFilter("Pending")}
                  className={`w-full text-left border rounded-xl p-3 transition ${
                    activeFilter === "Pending"
                      ? "border-purple-500 ring-2 ring-purple-100"
                      : "border-purple-100 hover:border-purple-300"
                  }`}
                >

                  <div className="flex items-center gap-2.5">

                    <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">

                      <Clock3
                        className="text-purple-500"
                        size={17}
                      />

                    </div>

                    <div>

                      <p className="text-lg font-bold text-gray-900">
                        {pendingTasks}
                      </p>

                      <p className="text-xs text-gray-500">
                        Pending
                      </p>

                    </div>

                  </div>

                </button>

                {/* COMPLETION RATE */}

                <button
                  type="button"
                  onClick={() => setActiveFilter("Completed")}
                  className={`w-full text-left border rounded-xl p-3 transition ${
                    activeFilter === "Completed"
                      ? "border-purple-500 ring-2 ring-purple-100"
                      : "border-purple-100 hover:border-purple-300"
                  }`}
                >

                  <div className="flex items-center gap-2.5">

                    <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">

                      <TrendingUp
                        className="text-purple-500"
                        size={17}
                      />

                    </div>

                    <div>

                      <p className="text-lg font-bold text-gray-900">
                        {completionRate}%
                      </p>

                      <p className="text-xs text-gray-500">
                        Completion Rate
                      </p>

                    </div>

                  </div>

                </button>

              </div>

              {/* PROGRESS */}

              <div className="mt-5">

                <div className="flex items-center justify-between mb-2">

                  <p className="text-xs sm:text-sm font-semibold text-gray-700">
                    Task Progress
                  </p>

                  <span className="text-xs font-medium bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full">
                    {completedTasks}/{totalTasks}
                  </span>

                </div>

                <div className="h-2 bg-purple-100 rounded-full overflow-hidden">

                  <div
                    className="h-full bg-purple-600 rounded-full transition-all duration-500"
                    style={{
                      width: `${completionRate}%`,
                    }}
                  />

                </div>

              </div>

            </div>

            {/* =================================
                RECENT ACTIVITY
            ================================= */}

            <div className="bg-white rounded-2xl border border-purple-100 p-4 shadow-sm">

              <div className="flex items-center gap-2 mb-4">

                <Clock3
                  className="text-purple-600"
                  size={19}
                />

                <h3 className="font-semibold text-base">
                  Recent Activity
                </h3>

              </div>

              {recentTasks.length === 0 ? (
                <div className="py-6 text-center">

                  <p className="text-sm text-gray-500">
                    No recent activity
                  </p>

                </div>
              ) : (
                <div className="space-y-4">

                  {recentTasks.map((task) => (
                    <div
                      key={task._id}
                      className="flex items-center justify-between gap-3"
                    >

                      <div className="min-w-0">

                        <p className="text-sm font-medium text-gray-800 truncate">
                          {task.title}
                        </p>

                        <p className="text-xs text-gray-400 mt-0.5">
                          {formatActivityDate(
                            task.createdAt
                          )}
                        </p>

                      </div>

                      <span
                        className={`shrink-0 px-2.5 py-1 rounded-full text-xs font-medium ${
                          task.status === "completed"
                            ? "bg-green-100 text-green-600"
                            : "bg-purple-100 text-purple-600"
                        }`}
                      >
                        {task.status === "completed"
                          ? "Done"
                          : "Pending"}
                      </span>

                    </div>
                  ))}

                </div>
              )}

            </div>

          </div>
        </div>
      </div>

      {/* =================================
          ADD TASK MODAL
      ================================= */}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl">

            <div className="flex items-center justify-between p-5 border-b">

              <div>

                <h2 className="text-xl font-bold text-gray-900">
                  Add New Task
                </h2>

                <p className="text-gray-500 text-xs sm:text-sm mt-1">
                  Create a new task for your workflow
                </p>

              </div>

              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
              >
                <X size={18} />
              </button>

            </div>

            <form
              onSubmit={handleCreateTask}
              className="p-5 space-y-4"
            >

              {/* TITLE */}

              <div>

                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">
                  Task Title
                </label>

                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Learn React"
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                />

              </div>

              {/* DESCRIPTION */}

              <div>

                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">
                  Description
                </label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe your task..."
                  rows="3"
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm outline-none resize-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                />

              </div>

              {/* PRIORITY */}

              <div>

                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">
                  Priority
                </label>

                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                >

                  <option value="low">
                    Low
                  </option>

                  <option value="medium">
                    Medium
                  </option>

                  <option value="high">
                    High
                  </option>

                </select>

              </div>

              {/* DUE DATE */}

              <div>

                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">
                  Due Date
                </label>

                <input
                  type="date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                />

              </div>

              {/* BUTTONS */}

              <div className="flex gap-3 pt-1">

                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 border border-gray-200 text-gray-700 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white py-2.5 rounded-xl text-sm font-semibold"
                >
                  {saving
                    ? "Creating..."
                    : "Create Task"}
                </button>

              </div>

            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default Dashboard;