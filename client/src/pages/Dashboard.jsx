import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Plus,
  CheckCircle2,
  Clock3,
  Circle,
  Trash2,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  X,
  ListTodo,
  Target,
} from "lucide-react";

import Layout from "../components/Layout.jsx";
import StatsCard from "../components/StatsCard.jsx";
import API_URL from "../config.js";

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // ==========================================
  // TOP FILTER
  // All / Today / Week / High / Medium / Low
  // ==========================================

  const [datePriorityFilter, setDatePriorityFilter] =
    useState("all");

  // ==========================================
  // STATUS FILTER
  // All / Pending / In Progress / Completed
  // ==========================================

  const [statusFilter, setStatusFilter] =
    useState("all");

  const [showModal, setShowModal] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("low");
  const [dueDate, setDueDate] = useState("");

  const [loading, setLoading] = useState(false);

  const [currentDate, setCurrentDate] = useState(
    new Date()
  );

  const token = localStorage.getItem("token");

  // ==========================================
  // USER NAME
  // ==========================================

  const [userName] = useState(() => {
    try {
      const storedUser = JSON.parse(
        localStorage.getItem("user") || "null"
      );

      return storedUser?.name || "User";
    } catch {
      return "User";
    }
  });

  // ==========================================
  // FETCH TASKS
  // ==========================================

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

      if (response.ok) {
        setTasks(data.tasks || []);
      } else {
        console.error(
          "Fetch tasks error:",
          data.message
        );
      }
    } catch (error) {
      console.error(
        "Fetch tasks error:",
        error
      );
    }
  };

  useEffect(() => {
    if (token) {
      fetchTasks();
    }
  }, [token]);

  // ==========================================
  // CREATE TASK
  // ==========================================

  const handleCreateTask = async (event) => {
    event.preventDefault();

    if (!title.trim()) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/api/tasks`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: title.trim(),
            description: description.trim(),
            priority,
            dueDate: dueDate || null,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setTasks((current) => [
          data.task,
          ...current,
        ]);

        setTitle("");
        setDescription("");
        setPriority("low");
        setDueDate("");
        setShowModal(false);
      } else {
        alert(
          data.message ||
            "Failed to create task"
        );
      }
    } catch (error) {
      console.error(
        "Create task error:",
        error
      );

      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // COMPLETE / UNCOMPLETE TASK
  // ==========================================

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

      if (response.ok) {
        setTasks((current) =>
          current.map((task) =>
            task._id === taskId
              ? data.task
              : task
          )
        );
      } else {
        alert(
          data.message ||
            "Failed to update task"
        );
      }
    } catch (error) {
      console.error(
        "Toggle task error:",
        error
      );
    }
  };

  // ==========================================
  // DELETE TASK
  // ==========================================

  const handleDelete = async (taskId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmDelete) {
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

      if (response.ok) {
        setTasks((current) =>
          current.filter(
            (task) => task._id !== taskId
          )
        );
      } else {
        alert(
          data.message ||
            "Failed to delete task"
        );
      }
    } catch (error) {
      console.error(
        "Delete task error:",
        error
      );
    }
  };

  // ==========================================
  // TASK STATISTICS
  // ==========================================

  const totalTasks = tasks.length;

  const completedTasks = tasks.filter(
    (task) => task.status === "completed"
  ).length;

  const pendingTasks = tasks.filter(
    (task) => task.status === "pending"
  ).length;

  const inProgressTasks = tasks.filter(
    (task) => task.status === "in-progress"
  ).length;

  const completionPercentage =
    totalTasks === 0
      ? 0
      : Math.round(
          (completedTasks / totalTasks) * 100
        );

  // ==========================================
  // STAT CARD CLICK
  // ==========================================

  const handleStatusCardClick = (status) => {
    setDatePriorityFilter("all");
    setStatusFilter(status);
  };

  // ==========================================
  // SEARCH + TOP FILTER + STATUS FILTER
  // ==========================================

  const filteredTasks = useMemo(() => {
    const search = searchTerm
      .toLowerCase()
      .trim();

    const now = new Date();

    // ------------------------------------------
    // START OF CURRENT WEEK
    // Monday
    // ------------------------------------------

    const startOfWeek = new Date(now);

    const currentDay =
      startOfWeek.getDay();

    const mondayOffset =
      currentDay === 0
        ? -6
        : 1 - currentDay;

    startOfWeek.setDate(
      startOfWeek.getDate() +
        mondayOffset
    );

    startOfWeek.setHours(
      0,
      0,
      0,
      0
    );

    // ------------------------------------------
    // END OF CURRENT WEEK
    // Sunday
    // ------------------------------------------

    const endOfWeek = new Date(
      startOfWeek
    );

    endOfWeek.setDate(
      endOfWeek.getDate() + 6
    );

    endOfWeek.setHours(
      23,
      59,
      59,
      999
    );

    // ------------------------------------------
    // SAME DAY
    // ------------------------------------------

    const isSameDay = (
      date1,
      date2
    ) => {
      return (
        date1.getFullYear() ===
          date2.getFullYear() &&
        date1.getMonth() ===
          date2.getMonth() &&
        date1.getDate() ===
          date2.getDate()
      );
    };

    // ------------------------------------------
    // FILTER
    // ------------------------------------------

    return tasks.filter((task) => {
      // SEARCH
      const matchesSearch =
        !search ||
        task.title
          ?.toLowerCase()
          .includes(search) ||
        task.description
          ?.toLowerCase()
          .includes(search);

      // ----------------------------------------
      // TOP FILTER
      // ----------------------------------------

      let matchesTopFilter = true;

      if (
        datePriorityFilter === "today"
      ) {
        if (!task.dueDate) {
          matchesTopFilter = false;
        } else {
          matchesTopFilter = isSameDay(
            new Date(task.dueDate),
            now
          );
        }
      }

      if (
        datePriorityFilter === "week"
      ) {
        if (!task.dueDate) {
          matchesTopFilter = false;
        } else {
          const taskDate = new Date(
            task.dueDate
          );

          matchesTopFilter =
            taskDate >= startOfWeek &&
            taskDate <= endOfWeek;
        }
      }

      if (
        datePriorityFilter === "high"
      ) {
        matchesTopFilter =
          task.priority === "high";
      }

      if (
        datePriorityFilter === "medium"
      ) {
        matchesTopFilter =
          task.priority === "medium";
      }

      if (
        datePriorityFilter === "low"
      ) {
        matchesTopFilter =
          task.priority === "low";
      }

      // ----------------------------------------
      // STATUS FILTER
      // ----------------------------------------

      let matchesStatusFilter = true;

      if (
        statusFilter === "pending"
      ) {
        matchesStatusFilter =
          task.status === "pending";
      }

      if (
        statusFilter === "in-progress"
      ) {
        matchesStatusFilter =
          task.status === "in-progress";
      }

      if (
        statusFilter === "completed"
      ) {
        matchesStatusFilter =
          task.status === "completed";
      }

      return (
        matchesSearch &&
        matchesTopFilter &&
        matchesStatusFilter
      );
    });
  }, [
    tasks,
    searchTerm,
    datePriorityFilter,
    statusFilter,
  ]);

  // ==========================================
  // CALENDAR
  // ==========================================

  const year =
    currentDate.getFullYear();

  const month =
    currentDate.getMonth();

  const firstDay = new Date(
    year,
    month,
    1
  ).getDay();

  const daysInMonth = new Date(
    year,
    month + 1,
    0
  ).getDate();

  const calendarDays = [];

  for (
    let i = 0;
    i < firstDay;
    i++
  ) {
    calendarDays.push(null);
  }

  for (
    let day = 1;
    day <= daysInMonth;
    day++
  ) {
    calendarDays.push(day);
  }

  const monthName =
    currentDate.toLocaleString(
      "default",
      {
        month: "long",
      }
    );

  const previousMonth = () => {
    setCurrentDate(
      new Date(
        year,
        month - 1,
        1
      )
    );
  };

  const nextMonth = () => {
    setCurrentDate(
      new Date(
        year,
        month + 1,
        1
      )
    );
  };

  // ==========================================
  // TODAY
  // ==========================================

  const today = new Date();

  const isToday = (day) => {
    if (!day) {
      return false;
    }

    return (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    );
  };

  // ==========================================
  // TASK DATE
  // ==========================================

  const hasTaskOnDate = (day) => {
    if (!day) {
      return false;
    }

    return tasks.some((task) => {
      if (!task.dueDate) {
        return false;
      }

      const date = new Date(
        task.dueDate
      );

      return (
        date.getDate() === day &&
        date.getMonth() === month &&
        date.getFullYear() === year
      );
    });
  };

  // ==========================================
  // FORMAT DUE DATE
  // ==========================================

  const formatDueDate = (date) => {
    if (!date) {
      return "No due date";
    }

    return new Date(
      date
    ).toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );
  };

  // ==========================================
  // PRIORITY STYLE
  // ==========================================

  const getPriorityClass = (
    taskPriority
  ) => {
    if (
      taskPriority === "high"
    ) {
      return "bg-red-50 text-red-600";
    }

    if (
      taskPriority === "medium"
    ) {
      return "bg-amber-50 text-amber-600";
    }

    return "bg-blue-50 text-blue-600";
  };

  // ==========================================
  // RETURN
  // ==========================================

  return (
    <Layout activePage="Dashboard">

      <div className="mx-auto w-full max-w-[1500px]">

        {/* =====================================
            SEARCH
        ====================================== */}

        <div className="mb-4">

          <div className="relative w-full max-w-[470px]">

            <Search
              size={17}
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
              placeholder="Search tasks..."
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

        {/* =====================================
            MAIN GRID
        ====================================== */}

        <div
          className="
            grid
            grid-cols-1
            gap-4
            xl:grid-cols-[minmax(0,1fr)_330px]
          "
        >

          {/* ===================================
              LEFT CONTENT
          =================================== */}

          <div className="min-w-0">

            {/* =================================
                WELCOME
            ================================== */}

            <section
              className="
                mb-4
                overflow-hidden
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

              <div
                className="
                  flex
                  items-center
                  justify-between
                  gap-4
                "
              >

                <div className="min-w-0">

                  {/* 👋 REMOVED */}

                  <h1
                    className="
                      truncate
                      text-2xl
                      font-bold
                      tracking-tight
                      text-gray-900
                    "
                  >
                    Hello, {userName}!
                  </h1>

                  <p
                    className="
                      mt-1
                      text-sm
                      text-gray-500
                    "
                  >
                    Stay organized, get things
                    done.
                  </p>

                </div>

                <button
                  type="button"
                  onClick={() =>
                    setShowModal(true)
                  }
                  className="
                    hidden
                    shrink-0
                    items-center
                    gap-1.5
                    rounded-lg
                    bg-purple-600
                    px-3.5
                    py-2
                    text-xs
                    font-semibold
                    text-white
                    shadow-sm
                    transition
                    hover:bg-purple-700
                    sm:flex
                  "
                >
                  <Plus size={16} />
                  Add Task
                </button>

              </div>

            </section>

            {/* =================================
                STATS
            ================================== */}

            <section
              className="
                mb-4
                grid
                grid-cols-2
                gap-3
                lg:grid-cols-4
              "
            >

              <StatsCard
                title="Total Tasks"
                value={totalTasks}
                icon={ListTodo}
                iconBg="bg-purple-100"
                iconColor="text-purple-600"
                active={
                  statusFilter === "all" &&
                  datePriorityFilter === "all"
                }
                onClick={() =>
                  handleStatusCardClick("all")
                }
              />

              <StatsCard
                title="Completed"
                value={completedTasks}
                icon={CheckCircle2}
                iconBg="bg-green-100"
                iconColor="text-green-600"
                active={
                  statusFilter === "completed"
                }
                onClick={() =>
                  handleStatusCardClick(
                    "completed"
                  )
                }
              />

              <StatsCard
                title="In Progress"
                value={inProgressTasks}
                icon={Clock3}
                iconBg="bg-orange-100"
                iconColor="text-orange-600"
                active={
                  statusFilter === "in-progress"
                }
                onClick={() =>
                  handleStatusCardClick(
                    "in-progress"
                  )
                }
              />

              <StatsCard
                title="Pending"
                value={pendingTasks}
                icon={Target}
                iconBg="bg-red-100"
                iconColor="text-red-500"
                active={
                  statusFilter === "pending"
                }
                onClick={() =>
                  handleStatusCardClick(
                    "pending"
                  )
                }
              />

            </section>

            {/* =================================
                TOP FILTERS
            ================================== */}

            <section
              className="
                mb-4
                overflow-hidden
                rounded-xl
                border
                border-gray-200
                bg-white
                shadow-sm
              "
            >

              <div
                className="
                  flex
                  flex-col
                  gap-3
                  px-4
                  py-3
                  sm:flex-row
                  sm:items-center
                  sm:justify-between
                "
              >

                <div className="flex items-center gap-2">

                  <Target
                    size={19}
                    className="text-purple-600"
                  />

                  <h2
                    className="
                      text-base
                      font-semibold
                      text-gray-900
                    "
                  >
                    All Tasks
                  </h2>

                </div>

                <div
                  className="
                    flex
                    w-full
                    overflow-x-auto
                    rounded-lg
                    bg-purple-50
                    p-1
                    sm:w-auto
                  "
                >

                  {[
                    {
                      value: "all",
                      label: "All",
                    },
                    {
                      value: "today",
                      label: "Today",
                    },
                    {
                      value: "week",
                      label: "Week",
                    },
                    {
                      value: "high",
                      label: "High",
                    },
                    {
                      value: "medium",
                      label: "Medium",
                    },
                    {
                      value: "low",
                      label: "Low",
                    },
                  ].map((item) => (

                    <button
                      key={item.value}
                      type="button"
                      onClick={() =>
                        setDatePriorityFilter(
                          item.value
                        )
                      }
                      className={`
                        whitespace-nowrap
                        rounded-md
                        px-3
                        py-1.5
                        text-xs
                        font-medium
                        transition
                        ${
                          datePriorityFilter ===
                          item.value
                            ? "bg-purple-600 text-white shadow-sm"
                            : "text-gray-600 hover:text-gray-900"
                        }
                      `}
                    >
                      {item.label}
                    </button>

                  ))}

                </div>

              </div>

            </section>

            {/* =================================
                MY TASKS
            ================================== */}

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
                  flex-col
                  gap-3
                  border-b
                  border-gray-100
                  px-4
                  py-3
                "
              >

                <div
                  className="
                    flex
                    items-center
                    justify-between
                    gap-3
                  "
                >

                  <div className="flex items-center gap-2">

                    <ListTodo
                      size={19}
                      className="text-purple-600"
                    />

                    <h2
                      className="
                        text-base
                        font-bold
                        text-gray-900
                      "
                    >
                      My Tasks
                    </h2>

                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setShowModal(true)
                    }
                    className="
                      flex
                      items-center
                      gap-1.5
                      rounded-lg
                      bg-purple-600
                      px-3
                      py-2
                      text-xs
                      font-semibold
                      text-white
                      transition
                      hover:bg-purple-700
                      sm:hidden
                    "
                  >
                    <Plus size={15} />
                    Add Task
                  </button>

                </div>

                {/* STATUS FILTERS */}

                <div
                  className="
                    flex
                    w-full
                    overflow-x-auto
                    rounded-lg
                    bg-gray-50
                    p-1
                  "
                >

                  {[
                    {
                      value: "all",
                      label: "All",
                    },
                    {
                      value: "pending",
                      label: "Pending",
                    },
                    {
                      value: "in-progress",
                      label: "In Progress",
                    },
                    {
                      value: "completed",
                      label: "Completed",
                    },
                  ].map((item) => (

                    <button
                      key={item.value}
                      type="button"
                      onClick={() =>
                        setStatusFilter(
                          item.value
                        )
                      }
                      className={`
                        flex-1
                        whitespace-nowrap
                        rounded-md
                        px-3
                        py-1.5
                        text-xs
                        font-medium
                        transition
                        ${
                          statusFilter ===
                          item.value
                            ? "bg-purple-600 text-white shadow-sm"
                            : "text-gray-500 hover:text-gray-800"
                        }
                      `}
                    >
                      {item.label}
                    </button>

                  ))}

                </div>

              </div>

              {/* TASK LIST */}

              <div className="divide-y divide-gray-100">

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
                        h-10
                        w-10
                        items-center
                        justify-center
                        rounded-full
                        bg-purple-50
                      "
                    >
                      <ListTodo
                        size={20}
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
                      No tasks found
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
                        : "Create your first task to get started."}
                    </p>

                  </div>

                ) : (

                  filteredTasks.map((task) => (

                    <div
                      key={task._id}
                      className="
                        group
                        flex
                        min-h-[66px]
                        items-center
                        gap-3
                        px-4
                        py-2.5
                        transition
                        hover:bg-gray-50
                        sm:px-5
                      "
                    >

                      {/* CHECKBOX */}

                      <button
                        type="button"
                        onClick={() =>
                          handleComplete(
                            task._id
                          )
                        }
                        className="shrink-0"
                        title={
                          task.status ===
                          "completed"
                            ? "Mark as pending"
                            : "Mark as completed"
                        }
                      >

                        {task.status ===
                        "completed" ? (

                          <CheckCircle2
                            size={21}
                            className="text-green-500"
                          />

                        ) : (

                          <Circle
                            size={21}
                            className="
                              text-gray-300
                              transition
                              group-hover:text-purple-400
                            "
                          />

                        )}

                      </button>

                      {/* TASK INFO */}

                      <div className="min-w-0 flex-1">

                        <div
                          className="
                            flex
                            min-w-0
                            items-center
                            gap-2
                          "
                        >

                          <h3
                            className={`
                              min-w-0
                              truncate
                              text-sm
                              font-semibold
                              ${
                                task.status ===
                                "completed"
                                  ? "text-gray-400 line-through"
                                  : "text-gray-800"
                              }
                            `}
                          >
                            {task.title}
                          </h3>

                          <span
                            className={`
                              shrink-0
                              rounded-full
                              px-2.5
                              py-0.5
                              text-[10px]
                              font-medium
                              capitalize
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
                                max-w-[400px]
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

                            <CalendarDays
                              size={12}
                            />

                            <span>
                              {formatDueDate(
                                task.dueDate
                              )}
                            </span>

                          </div>

                        </div>

                      </div>

                      {/* STATUS */}

                      {task.status ===
                        "in-progress" && (

                        <span
                          className="
                            hidden
                            shrink-0
                            rounded-full
                            bg-orange-50
                            px-2.5
                            py-1
                            text-[10px]
                            font-medium
                            text-orange-600
                            sm:inline-flex
                          "
                        >
                          In Progress
                        </span>

                      )}

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

                  ))

                )}

              </div>

            </section>

          </div>

          {/* ===================================
              RIGHT SIDE
          =================================== */}

          <aside className="space-y-4">

            {/* =================================
                CALENDAR
            ================================== */}

            <section
              className="
                rounded-2xl
                border
                border-gray-200
                bg-white
                p-4
                shadow-sm
              "
            >

              <div
                className="
                  mb-3
                  flex
                  items-center
                  justify-between
                "
              >

                <h2
                  className="
                    text-base
                    font-bold
                    text-gray-900
                  "
                >
                  {monthName} {year}
                </h2>

                <div className="flex gap-1">

                  <button
                    type="button"
                    onClick={previousMonth}
                    className="
                      rounded-md
                      p-1
                      text-gray-400
                      transition
                      hover:bg-gray-100
                      hover:text-gray-700
                    "
                    aria-label="Previous month"
                  >
                    <ChevronLeft size={16} />
                  </button>

                  <button
                    type="button"
                    onClick={nextMonth}
                    className="
                      rounded-md
                      p-1
                      text-gray-400
                      transition
                      hover:bg-gray-100
                      hover:text-gray-700
                    "
                    aria-label="Next month"
                  >
                    <ChevronRight size={16} />
                  </button>

                </div>

              </div>

              <div
                className="
                  grid
                  grid-cols-7
                  text-center
                "
              >

                {[
                  "Sun",
                  "Mon",
                  "Tue",
                  "Wed",
                  "Thu",
                  "Fri",
                  "Sat",
                ].map((day) => (

                  <div
                    key={day}
                    className="
                      py-1.5
                      text-[10px]
                      font-semibold
                      text-gray-400
                    "
                  >
                    {day.slice(0, 1)}
                  </div>

                ))}

                {calendarDays.map(
                  (day, index) => (

                    <div
                      key={index}
                      className="
                        flex
                        h-8
                        items-center
                        justify-center
                      "
                    >

                      {day && (

                        <div
                          className={`
                            relative
                            flex
                            h-7
                            w-7
                            items-center
                            justify-center
                            rounded-full
                            text-[11px]
                            transition
                            ${
                              isToday(day)
                                ? "bg-purple-600 font-semibold text-white"
                                : "text-gray-700 hover:bg-purple-50 hover:text-purple-600"
                            }
                          `}
                        >

                          {day}

                          {hasTaskOnDate(day) &&
                            !isToday(day) && (

                              <span
                                className="
                                  absolute
                                  bottom-0.5
                                  h-1
                                  w-1
                                  rounded-full
                                  bg-purple-500
                                "
                              />

                            )}

                        </div>

                      )}

                    </div>

                  )
                )}

              </div>

            </section>

            {/* =================================
                TASK PROGRESS
            ================================== */}

            <section
              className="
                rounded-2xl
                border
                border-gray-200
                bg-white
                p-4
                shadow-sm
              "
            >

              <div
                className="
                  flex
                  items-center
                  justify-between
                "
              >

                <h2
                  className="
                    text-base
                    font-bold
                    text-gray-900
                  "
                >
                  Task Progress
                </h2>

                <span
                  className="
                    text-sm
                    font-bold
                    text-purple-600
                  "
                >
                  {completionPercentage}%
                </span>

              </div>

              <div
                className="
                  mt-4
                  flex
                  items-center
                  gap-5
                "
              >

                {/* CIRCULAR PROGRESS */}

                <div
                  className="
                    relative
                    h-24
                    w-24
                    shrink-0
                  "
                >

                  <svg
                    className="
                      h-24
                      w-24
                      -rotate-90
                    "
                    viewBox="0 0 100 100"
                  >

                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="10"
                      className="text-gray-100"
                    />

                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="10"
                      strokeLinecap="round"
                      className="
                        text-purple-600
                        transition-all
                        duration-500
                      "
                      strokeDasharray={251.2}
                      strokeDashoffset={
                        251.2 -
                        (251.2 *
                          completionPercentage) /
                          100
                      }
                    />

                  </svg>

                  <div
                    className="
                      absolute
                      inset-0
                      flex
                      items-center
                      justify-center
                    "
                  >

                    <span
                      className="
                        text-lg
                        font-bold
                        text-gray-800
                      "
                    >
                      {completionPercentage}%
                    </span>

                  </div>

                </div>

                {/* PROGRESS DETAILS */}

                <div
                  className="
                    min-w-0
                    flex-1
                    space-y-2.5
                  "
                >

                  <div
                    className="
                      flex
                      items-center
                      justify-between
                      gap-2
                    "
                  >

                    <div className="flex items-center gap-2">

                      <span
                        className="
                          h-2.5
                          w-2.5
                          rounded-full
                          bg-green-500
                        "
                      />

                      <span
                        className="
                          text-xs
                          text-gray-500
                        "
                      >
                        Completed
                      </span>

                    </div>

                    <span
                      className="
                        text-xs
                        font-semibold
                        text-gray-700
                      "
                    >
                      {completedTasks}
                    </span>

                  </div>

                  <div
                    className="
                      flex
                      items-center
                      justify-between
                      gap-2
                    "
                  >

                    <div className="flex items-center gap-2">

                      <span
                        className="
                          h-2.5
                          w-2.5
                          rounded-full
                          bg-orange-500
                        "
                      />

                      <span
                        className="
                          text-xs
                          text-gray-500
                        "
                      >
                        In Progress
                      </span>

                    </div>

                    <span
                      className="
                        text-xs
                        font-semibold
                        text-gray-700
                      "
                    >
                      {inProgressTasks}
                    </span>

                  </div>

                  <div
                    className="
                      flex
                      items-center
                      justify-between
                      gap-2
                    "
                  >

                    <div className="flex items-center gap-2">

                      <span
                        className="
                          h-2.5
                          w-2.5
                          rounded-full
                          bg-red-500
                        "
                      />

                      <span
                        className="
                          text-xs
                          text-gray-500
                        "
                      >
                        Pending
                      </span>

                    </div>

                    <span
                      className="
                        text-xs
                        font-semibold
                        text-gray-700
                      "
                    >
                      {pendingTasks}
                    </span>

                  </div>

                  <div
                    className="
                      flex
                      items-center
                      justify-between
                      gap-2
                      border-t
                      border-gray-100
                      pt-1
                    "
                  >

                    <span
                      className="
                        text-xs
                        text-gray-400
                      "
                    >
                      Total
                    </span>

                    <span
                      className="
                        text-xs
                        font-bold
                        text-gray-800
                      "
                    >
                      {totalTasks}
                    </span>

                  </div>

                </div>

              </div>

            </section>

            {/* =================================
                FOCUS CARD
            ================================== */}

            <section
              className="
                rounded-2xl
                border
                border-purple-100
                bg-gradient-to-br
                from-purple-50
                to-white
                p-4
                shadow-sm
              "
            >

              <div className="flex items-start gap-3">

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
                    text-purple-600
                  "
                >
                  <Target size={19} />
                </div>

                <div className="min-w-0">

                  <h3
                    className="
                      text-sm
                      font-bold
                      leading-5
                      text-gray-800
                    "
                  >
                    Focus on progress,
                    <br />
                    not perfection.
                  </h3>

                  <div
                    className="
                      mt-3
                      h-0.5
                      w-10
                      rounded-full
                      bg-purple-500
                    "
                  />

                </div>

              </div>

            </section>

          </aside>

        </div>

      </div>

      {/* =====================================
          ADD TASK MODAL
      ====================================== */}

      {showModal && (

        <div
          className="
            fixed
            inset-0
            z-[100]
            flex
            items-center
            justify-center
            bg-black/50
            p-4
          "
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              setShowModal(false);
            }
          }}
        >

          <div
            className="
              max-h-[90vh]
              w-full
              max-w-lg
              overflow-y-auto
              rounded-2xl
              bg-white
              shadow-2xl
            "
          >

            {/* MODAL HEADER */}

            <div
              className="
                flex
                items-center
                justify-between
                border-b
                border-gray-100
                px-5
                py-4
              "
            >

              <div>

                <h2
                  className="
                    text-lg
                    font-bold
                    text-gray-900
                  "
                >
                  Add New Task
                </h2>

                <p
                  className="
                    mt-0.5
                    text-xs
                    text-gray-400
                  "
                >
                  Create a new task for your
                  workspace.
                </p>

              </div>

              <button
                type="button"
                onClick={() =>
                  setShowModal(false)
                }
                className="
                  rounded-lg
                  p-2
                  text-gray-400
                  transition
                  hover:bg-gray-100
                  hover:text-gray-700
                "
                aria-label="Close modal"
              >
                <X size={18} />
              </button>

            </div>

            {/* FORM */}

            <form
              onSubmit={handleCreateTask}
              className="space-y-4 p-5"
            >

              {/* TITLE */}

              <div>

                <label
                  className="
                    mb-1.5
                    block
                    text-sm
                    font-medium
                    text-gray-700
                  "
                >
                  Task Title
                </label>

                <input
                  type="text"
                  value={title}
                  onChange={(event) =>
                    setTitle(
                      event.target.value
                    )
                  }
                  placeholder="Enter task title"
                  required
                  className="
                    w-full
                    rounded-lg
                    border
                    border-gray-200
                    px-3
                    py-2.5
                    text-sm
                    outline-none
                    transition
                    focus:border-purple-500
                    focus:ring-2
                    focus:ring-purple-100
                  "
                />

              </div>

              {/* DESCRIPTION */}

              <div>

                <label
                  className="
                    mb-1.5
                    block
                    text-sm
                    font-medium
                    text-gray-700
                  "
                >
                  Description
                </label>

                <textarea
                  value={description}
                  onChange={(event) =>
                    setDescription(
                      event.target.value
                    )
                  }
                  placeholder="Enter task description"
                  rows="3"
                  className="
                    w-full
                    resize-none
                    rounded-lg
                    border
                    border-gray-200
                    px-3
                    py-2.5
                    text-sm
                    outline-none
                    transition
                    focus:border-purple-500
                    focus:ring-2
                    focus:ring-purple-100
                  "
                />

              </div>

              {/* PRIORITY */}

              <div>

                <label
                  className="
                    mb-1.5
                    block
                    text-sm
                    font-medium
                    text-gray-700
                  "
                >
                  Priority
                </label>

                <select
                  value={priority}
                  onChange={(event) =>
                    setPriority(
                      event.target.value
                    )
                  }
                  className="
                    w-full
                    rounded-lg
                    border
                    border-gray-200
                    px-3
                    py-2.5
                    text-sm
                    outline-none
                    transition
                    focus:border-purple-500
                    focus:ring-2
                    focus:ring-purple-100
                  "
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

                <label
                  className="
                    mb-1.5
                    block
                    text-sm
                    font-medium
                    text-gray-700
                  "
                >
                  Due Date
                </label>

                <input
                  type="date"
                  value={dueDate}
                  onChange={(event) =>
                    setDueDate(
                      event.target.value
                    )
                  }
                  className="
                    w-full
                    rounded-lg
                    border
                    border-gray-200
                    px-3
                    py-2.5
                    text-sm
                    outline-none
                    transition
                    focus:border-purple-500
                    focus:ring-2
                    focus:ring-purple-100
                  "
                />

              </div>

              {/* BUTTONS */}

              <div
                className="
                  flex
                  flex-col-reverse
                  gap-2.5
                  pt-1
                  sm:flex-row
                  sm:justify-end
                "
              >

                <button
                  type="button"
                  onClick={() =>
                    setShowModal(false)
                  }
                  className="
                    rounded-lg
                    border
                    border-gray-200
                    px-4
                    py-2.5
                    text-sm
                    font-medium
                    text-gray-600
                    transition
                    hover:bg-gray-50
                  "
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="
                    rounded-lg
                    bg-purple-600
                    px-5
                    py-2.5
                    text-sm
                    font-semibold
                    text-white
                    transition
                    hover:bg-purple-700
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                  "
                >
                  {loading
                    ? "Adding..."
                    : "Add Task"}
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