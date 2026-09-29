import { useEffect, useMemo, useState } from "react";
import API_URL from "../config.js";

import {
  Search,
  ListTodo,
  Loader2,
  CheckCircle2,
  Circle,
  CalendarDays,
  Trash2,
  PlayCircle,
  Clock3,
} from "lucide-react";

import Layout from "../components/Layout.jsx";

function InProgressTasks() {
  const [tasks, setTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  // =========================
  // FETCH TASKS
  // =========================

  const fetchTasks = async () => {
    try {
      const response = await fetch(
        `${API_URL}/api/tasks`,
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

      // Only in-progress tasks
      const inProgressTasks = (
        data.tasks || []
      ).filter(
        (task) => task.status === "in-progress"
      );

      setTasks(inProgressTasks);
    } catch (error) {
      console.error(
        "In-progress tasks error:",
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
        `${API_URL}/api/tasks/${taskId}/toggle`,
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
        `${API_URL}/api/tasks/${taskId}`,
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

  // =========================
  // SEARCH
  // =========================

  const filteredTasks = useMemo(() => {
    const search = searchTerm
      .toLowerCase()
      .trim();

    if (!search) {
      return tasks;
    }

    return tasks.filter((task) => {
      return (
        task.title
          ?.toLowerCase()
          .includes(search) ||
        task.description
          ?.toLowerCase()
          .includes(search)
      );
    });
  }, [tasks, searchTerm]);

  // =========================
  // FORMAT DATE
  // =========================

  const formatDueDate = (date) => {
    if (!date) {
      return "No due date";
    }

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );
  };

  // =========================
  // PRIORITY
  // =========================

  const getPriorityClass = (priority) => {
    if (priority === "high") {
      return "bg-red-50 text-red-600";
    }

    if (priority === "medium") {
      return "bg-amber-50 text-amber-600";
    }

    return "bg-blue-50 text-blue-600";
  };

  return (
    <Layout activePage="In Progress">

      <div className="mx-auto w-full max-w-[1500px]">

        {/* =================================
            SEARCH
        ================================== */}

        <div className="mb-5">
          <div className="relative w-full max-w-[470px]">

            <Search
              size={18}
              className="
                absolute
                left-3.5
                top-1/2
                -translate-y-1/2
                text-gray-400
              "
            />

            <input
              type="text"
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(
                  event.target.value
                )
              }
              placeholder="Search in-progress tasks..."
              className="
                h-10
                w-full
                rounded-full
                border
                border-gray-100
                bg-white
                pl-10
                pr-4
                text-sm
                text-gray-700
                shadow-sm
                outline-none
                transition
                placeholder:text-gray-400
                focus:border-purple-300
                focus:ring-2
                focus:ring-purple-100
              "
            />

          </div>
        </div>

        {/* =================================
            PAGE HEADER
        ================================== */}

        <section
          className="
            mb-5
            flex
            items-center
            justify-between
            gap-4
            rounded-2xl
            border
            border-purple-100
            bg-gradient-to-r
            from-purple-50
            via-white
            to-violet-50
            px-5
            py-4
            shadow-sm
          "
        >

          <div className="flex min-w-0 items-center gap-3">

            <div
              className="
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                rounded-xl
                bg-purple-100
              "
            >
              <PlayCircle
                size={21}
                className="text-purple-600"
              />
            </div>

            <div className="min-w-0">

              <h1
                className="
                  truncate
                  text-xl
                  font-bold
                  tracking-tight
                  text-gray-900
                  sm:text-2xl
                "
              >
                In Progress
              </h1>

              <p
                className="
                  mt-0.5
                  text-xs
                  text-gray-500
                  sm:text-sm
                "
              >
                Tasks that are currently being worked on.
              </p>

            </div>

          </div>

          <div
            className="
              shrink-0
              rounded-full
              bg-purple-50
              px-3
              py-1.5
              text-xs
              font-semibold
              text-purple-600
            "
          >
            {tasks.length} in progress
          </div>

        </section>

        {/* =================================
            CONTENT
        ================================== */}

        {loading ? (

          <section
            className="
              rounded-2xl
              border
              border-gray-200
              bg-white
              p-8
              text-center
              shadow-sm
            "
          >

            <Loader2
              className="
                mx-auto
                animate-spin
                text-purple-600
              "
              size={27}
            />

            <p
              className="
                mt-3
                text-sm
                text-gray-500
              "
            >
              Loading in-progress tasks...
            </p>

          </section>

        ) : (

          <section
            className="
              overflow-hidden
              rounded-2xl
              border
              border-gray-200
              bg-white
              shadow-sm
            "
          >

            {/* TASK HEADER */}

            <div
              className="
                flex
                items-center
                justify-between
                border-b
                border-gray-100
                px-4
                py-3.5
                sm:px-5
              "
            >

              <div className="flex items-center gap-2">

                <Clock3
                  size={19}
                  className="text-purple-600"
                />

                <h2
                  className="
                    text-base
                    font-bold
                    text-gray-900
                    sm:text-lg
                  "
                >
                  My In-Progress Tasks
                </h2>

              </div>

              <span
                className="
                  text-xs
                  text-gray-400
                "
              >
                {filteredTasks.length} shown
              </span>

            </div>

            {/* EMPTY STATE */}

            {filteredTasks.length === 0 ? (

              <div
                className="
                  px-5
                  py-12
                  text-center
                "
              >

                <div
                  className="
                    mx-auto
                    flex
                    h-11
                    w-11
                    items-center
                    justify-center
                    rounded-full
                    bg-purple-50
                  "
                >
                  <CheckCircle2
                    size={21}
                    className="text-purple-500"
                  />
                </div>

                <h3
                  className="
                    mt-3
                    text-sm
                    font-semibold
                    text-gray-700
                  "
                >
                  {searchTerm
                    ? "No tasks found"
                    : "No tasks in progress"}
                </h3>

                <p
                  className="
                    mt-1
                    text-xs
                    text-gray-400
                  "
                >
                  {searchTerm
                    ? "Try a different search term."
                    : "Start a pending task to see it here."}
                </p>

              </div>

            ) : (

              /* TASK LIST */

              <div className="divide-y divide-gray-100">

                {filteredTasks.map((task) => (

                  <div
                    key={task._id}
                    className="
                      group
                      flex
                      min-h-[68px]
                      items-center
                      gap-3
                      px-4
                      py-2.5
                      transition
                      hover:bg-gray-50
                      sm:px-5
                    "
                  >

                    {/* COMPLETE */}

                    <button
                      type="button"
                      onClick={() =>
                        handleComplete(
                          task._id
                        )
                      }
                      className="shrink-0"
                      title="Mark as completed"
                      aria-label="Mark task as completed"
                    >
                      <Circle
                        size={21}
                        className="
                          text-purple-300
                          transition
                          group-hover:text-purple-500
                        "
                      />
                    </button>

                    {/* TASK DETAILS */}

                    <div
                      className="
                        min-w-0
                        flex-1
                      "
                    >

                      <div
                        className="
                          flex
                          min-w-0
                          items-center
                          gap-2
                        "
                      >

                        <h3
                          className="
                            min-w-0
                            truncate
                            text-sm
                            font-semibold
                            text-gray-800
                          "
                        >
                          {task.title}
                        </h3>

                        <span
                          className="
                            shrink-0
                            rounded-full
                            bg-purple-50
                            px-2.5
                            py-0.5
                            text-[10px]
                            font-medium
                            text-purple-600
                          "
                        >
                          In Progress
                        </span>

                        <span
                          className={`
                            hidden
                            shrink-0
                            rounded-full
                            px-2.5
                            py-0.5
                            text-[10px]
                            font-medium
                            capitalize
                            sm:inline-flex
                            ${getPriorityClass(
                              task.priority
                            )}
                          `}
                        >
                          {task.priority}
                        </span>

                      </div>

                      <div
                        className="
                          mt-1
                          flex
                          items-center
                          gap-3
                        "
                      >

                        {task.description && (
                          <p
                            className="
                              hidden
                              max-w-[420px]
                              truncate
                              text-xs
                              text-gray-400
                              sm:block
                            "
                          >
                            {task.description}
                          </p>
                        )}

                        <div
                          className="
                            flex
                            shrink-0
                            items-center
                            gap-1
                            text-[11px]
                            text-gray-400
                          "
                        >
                          <CalendarDays size={12} />

                          <span>
                            {formatDueDate(
                              task.dueDate
                            )}
                          </span>
                        </div>

                      </div>

                    </div>

                    {/* DELETE */}

                    <button
                      type="button"
                      onClick={() =>
                        handleDelete(
                          task._id
                        )
                      }
                      className="
                        shrink-0
                        rounded-md
                        p-1.5
                        text-gray-300
                        transition
                        hover:bg-red-50
                        hover:text-red-500
                      "
                      title="Delete task"
                      aria-label="Delete task"
                    >
                      <Trash2 size={16} />
                    </button>

                  </div>

                ))}

              </div>

            )}

          </section>

        )}

      </div>

    </Layout>
  );
}

export default InProgressTasks;
