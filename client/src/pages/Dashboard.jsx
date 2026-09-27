import { useEffect, useMemo, useState } from "react";

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
        "http://localhost:5000/api/tasks",
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
        "http://localhost:5000/api/tasks",
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
    // ALL
    if (activeFilter === "All") {
      return true;
    }

    // COMPLETED
    if (activeFilter === "Completed") {
      return task.status === "completed";
    }

    // PENDING
    if (activeFilter === "Pending") {
      return task.status === "pending";
    }

    // HIGH PRIORITY
    if (activeFilter === "High") {
      return task.priority === "high";
    }

    // MEDIUM PRIORITY
    if (activeFilter === "Medium") {
      return task.priority === "medium";
    }

    // LOW PRIORITY
    if (activeFilter === "Low") {
      return task.priority === "low";
    }

    // TODAY
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

    // NEXT 7 DAYS
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
      <div className="p-5 lg:p-7 xl:p-8">

        {/* =================================
            MAIN TWO COLUMN LAYOUT
        ================================= */}

        <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_440px] gap-7">

          {/* =================================
              LEFT SIDE
          ================================= */}

          <div className="min-w-0">

            {/* HEADER */}

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 mb-7">
              <div>
                <div className="flex items-center gap-3">
                  <Home
                    className="text-purple-600"
                    size={29}
                  />

                  <h2 className="text-3xl font-bold text-gray-900">
                    Task Overview
                  </h2>
                </div>

                <p className="text-gray-500 mt-2 ml-10">
                  Manage your tasks efficiently
                </p>
              </div>

              <button
                onClick={() => setShowModal(true)}
                className="flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-5 py-3 rounded-xl font-semibold shadow-sm transition"
              >
                <Plus size={19} />
                Add New Task
              </button>
            </div>

            {/* =================================
                PRIORITY STAT CARDS
            ================================= */}

           <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">

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

            <div className="mt-5 bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">

              <div className="flex items-center gap-3 mb-5">
                <Filter
                  className="text-purple-600"
                  size={21}
                />

                <h3 className="font-semibold text-lg">
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
                    className={`px-5 py-2 rounded-lg text-sm font-medium transition ${
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

            <div className="mt-5 space-y-4">

              {loading ? (
                <div className="bg-white rounded-2xl border p-10 text-center">
                  <p className="text-gray-500">
                    Loading tasks...
                  </p>
                </div>
              ) : filteredTasks.length === 0 ? (
                <div className="bg-white rounded-2xl border p-10 text-center">

                  <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Plus
                      className="text-purple-600"
                      size={25}
                    />
                  </div>

                  <h3 className="text-xl font-semibold text-gray-800">
                    No tasks found
                  </h3>

                  <p className="text-gray-500 mt-2">
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

          <div className="space-y-5">

            {/* =================================
                TASK STATISTICS
            ================================= */}

            <div className="bg-white rounded-2xl border border-purple-100 p-5 shadow-sm">

              <div className="flex items-center gap-2 mb-5">
                <TrendingUp
                  className="text-purple-600"
                  size={20}
                />

                <h3 className="font-semibold text-lg">
                  Task Statistics
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-3">

                {/* TOTAL */}
         <button
  type="button"
  onClick={() => setActiveFilter("All")}
  className={`w-full text-left border rounded-xl p-4 transition ${
    activeFilter === "All"
      ? "border-purple-500 ring-2 ring-purple-100"
      : "border-purple-100 hover:border-purple-300"
  }`}
>
  <div className="flex items-center gap-3">

    <div className="w-9 h-9 rounded-lg bg-purple-50 flex items-center justify-center">
      <ListTodo
        className="text-purple-500"
        size={18}
      />
    </div>

    <div>
      <p className="text-xl font-bold text-gray-900">
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
  className={`w-full text-left border rounded-xl p-4 transition ${
    activeFilter === "Completed"
      ? "border-green-500 ring-2 ring-green-100"
      : "border-green-100 hover:border-green-300"
  }`}
>
  <div className="flex items-center gap-3">

    <div className="w-9 h-9 rounded-lg bg-green-50 flex items-center justify-center">
      <CheckCircle2
        className="text-green-500"
        size={18}
      />
    </div>

    <div>
      <p className="text-xl font-bold text-gray-900">
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
  className={`w-full text-left border rounded-xl p-4 transition ${
    activeFilter === "Pending"
      ? "border-purple-500 ring-2 ring-purple-100"
      : "border-purple-100 hover:border-purple-300"
  }`}
>
  <div className="flex items-center gap-3">

    <div className="w-9 h-9 rounded-lg bg-purple-50 flex items-center justify-center">
      <Clock3
        className="text-purple-500"
        size={18}
      />
    </div>

    <div>
      <p className="text-xl font-bold text-gray-900">
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
  className={`w-full text-left border rounded-xl p-4 transition ${
    activeFilter === "Completed"
      ? "border-purple-500 ring-2 ring-purple-100"
      : "border-purple-100 hover:border-purple-300"
  }`}
>
  <div className="flex items-center gap-3">

    <div className="w-9 h-9 rounded-lg bg-purple-50 flex items-center justify-center">
      <TrendingUp
        className="text-purple-500"
        size={18}
      />
    </div>

    <div>
      <p className="text-xl font-bold text-gray-900">
        {completionRate}%
      </p>

      <p className="text-xs text-gray-500">
        Completion Rate
      </p>
    </div>

  </div>
</button>
</div>
              {/* =================================
                  PROGRESS
              ================================= */}

              <div className="mt-6">

                <div className="flex items-center justify-between mb-2">

                  <p className="text-sm font-semibold text-gray-700">
                    Task Progress
                  </p>

                  <span className="text-xs font-medium bg-purple-100 text-purple-600 px-2.5 py-1 rounded-full">
                    {completedTasks}/{totalTasks}
                  </span>

                </div>

                <div className="h-2.5 bg-purple-100 rounded-full overflow-hidden">

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

            <div className="bg-white rounded-2xl border border-purple-100 p-5 shadow-sm">

              <div className="flex items-center gap-2 mb-5">

                <Clock3
                  className="text-purple-600"
                  size={20}
                />

                <h3 className="font-semibold text-lg">
                  Recent Activity
                </h3>

              </div>

              {recentTasks.length === 0 ? (
                <div className="py-8 text-center">

                  <p className="text-sm text-gray-500">
                    No recent activity
                  </p>

                </div>
              ) : (
                <div className="space-y-5">

                  {recentTasks.map((task) => (
                    <div
                      key={task._id}
                      className="flex items-center justify-between gap-3"
                    >

                      <div className="min-w-0">

                        <p className="font-medium text-gray-800 truncate">
                          {task.title}
                        </p>

                        <p className="text-xs text-gray-400 mt-1">
                          {formatActivityDate(
                            task.createdAt
                          )}
                        </p>

                      </div>

                      <span
                        className={`shrink-0 px-3 py-1 rounded-full text-xs font-medium ${
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

            <div className="flex items-center justify-between p-6 border-b">

              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Add New Task
                </h2>

                <p className="text-gray-500 text-sm mt-1">
                  Create a new task for your workflow
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100"
              >
                <X size={20} />
              </button>

            </div>

            <form
              onSubmit={handleCreateTask}
              className="p-6 space-y-5"
            >

              {/* TITLE */}

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Task Title
                </label>

                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Learn React"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                />
              </div>

              {/* DESCRIPTION */}

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description
                </label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe your task..."
                  rows="3"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none resize-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                />
              </div>

              {/* PRIORITY */}

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Priority
                </label>

                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
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
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Due Date
                </label>

                <input
                  type="date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                />
              </div>

              {/* BUTTONS */}

              <div className="flex gap-3 pt-2">

                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 border border-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white py-3 rounded-xl font-semibold"
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