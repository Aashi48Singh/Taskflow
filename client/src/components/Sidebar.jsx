import { useEffect, useState } from "react";

import {
  LayoutDashboard,
  ListTodo,
  CheckCircle2,
  Lightbulb,
  ArrowRight,
} from "lucide-react";

function Sidebar({ activePage }) {
  // =========================
  // USER
  // =========================

  const [userName, setUserName] = useState("User");

  const updateUser = () => {
    try {
      const storedUser = JSON.parse(
        localStorage.getItem("user")
      );

      setUserName(storedUser?.name || "User");
    } catch (error) {
      console.error("User data error:", error);
      setUserName("User");
    }
  };

  useEffect(() => {
    updateUser();

    const handleProfileUpdate = () => {
      updateUser();
    };

    window.addEventListener(
      "profileUpdated",
      handleProfileUpdate
    );

    return () => {
      window.removeEventListener(
        "profileUpdated",
        handleProfileUpdate
      );
    };
  }, []);

  const firstLetter =
    userName.charAt(0).toUpperCase() || "U";

  // =========================
  // PRODUCTIVITY
  // =========================

  const [productivity, setProductivity] = useState(0);

  const fetchProductivity = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setProductivity(0);
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
        console.error(
          "Productivity error:",
          data.message
        );
        return;
      }

      const tasks = data.tasks || [];

      const totalTasks = tasks.length;

      const completedTasks = tasks.filter(
        (task) => task.status === "completed"
      ).length;

      const percentage =
        totalTasks === 0
          ? 0
          : Math.round(
              (completedTasks / totalTasks) * 100
            );

      setProductivity(percentage);
    } catch (error) {
      console.error(
        "Productivity fetch error:",
        error
      );
    }
  };

  useEffect(() => {
    fetchProductivity();

    const handleTaskUpdate = () => {
      fetchProductivity();
    };

    window.addEventListener(
      "taskUpdated",
      handleTaskUpdate
    );

    return () => {
      window.removeEventListener(
        "taskUpdated",
        handleTaskUpdate
      );
    };
  }, []);

  // =========================
  // NAVIGATION
  // =========================

  const menuItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Pending Tasks",
      path: "/pending",
      icon: ListTodo,
    },
    {
      name: "Completed Tasks",
      path: "/completed",
      icon: CheckCircle2,
    },
  ];

  // =========================
  // PRO TIPS
  // =========================

  const tips = [
    {
      title: "Plan your day",
      text: "Start with your most important task.",
    },
    {
      title: "Stay focused",
      text: "Complete one task before starting another.",
    },
    {
      title: "Set priorities",
      text: "Focus on your high-priority tasks first.",
    },
    {
      title: "Use due dates",
      text: "Give important tasks a clear deadline.",
    },
    {
      title: "Track your progress",
      text: "Completing small tasks keeps your productivity moving.",
    },
    {
      title: "Keep it clean",
      text: "Delete tasks you no longer need.",
    },
  ];

  const [tipIndex, setTipIndex] = useState(0);

  const handleNextTip = () => {
    setTipIndex((currentIndex) => {
      if (currentIndex >= tips.length - 1) {
        return 0;
      }

      return currentIndex + 1;
    });
  };

  const currentTip = tips[tipIndex];

  // =========================
  // SIDEBAR
  // =========================

  return (
    <aside className="hidden md:flex w-80 bg-white border-r border-gray-200 min-h-[calc(100vh-80px)] flex-col">

      {/* ========================= */}
      {/* USER SECTION */}
      {/* ========================= */}

      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center gap-4">

          <div className="w-14 h-14 rounded-full bg-purple-600 text-white flex items-center justify-center text-xl font-bold">
            {firstLetter}
          </div>

          <div className="min-w-0">

            <h2 className="font-bold text-xl text-gray-800 truncate">
              Hey, {userName}
            </h2>

            <p className="text-purple-500 text-sm mt-1">
              ✨ Let's crush some tasks!
            </p>

          </div>

        </div>
      </div>

      {/* ========================= */}
      {/* PRODUCTIVITY */}
      {/* ========================= */}

      <div className="p-6">

        <div className="border border-purple-100 bg-purple-50 rounded-2xl p-4">

          <div className="flex justify-between items-center mb-3">

            <span className="text-sm font-semibold text-purple-600">
              PRODUCTIVITY
            </span>

            <span className="bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-sm font-medium">
              {productivity}%
            </span>

          </div>

          <div className="h-2 bg-purple-100 rounded-full overflow-hidden">

            <div
              className="h-full bg-purple-600 rounded-full transition-all duration-500"
              style={{
                width: `${productivity}%`,
              }}
            />

          </div>

        </div>

      </div>

      {/* ========================= */}
      {/* NAVIGATION */}
      {/* ========================= */}

      <nav className="px-5 space-y-2">

        {menuItems.map((item) => {
          const Icon = item.icon;

          const isActive =
            activePage === item.name;

          return (
            <a
              key={item.name}
              href={item.path}
              className={`flex items-center gap-4 px-5 py-4 rounded-xl font-medium transition ${
                isActive
                  ? "bg-purple-50 text-purple-600 border-l-4 border-purple-600"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <Icon size={22} />

              <span>{item.name}</span>
            </a>
          );
        })}

      </nav>

      {/* ========================= */}
      {/* PRO TIP */}
      {/* ========================= */}

      <div className="mt-auto p-5">

        <div className="bg-purple-50 border border-purple-100 rounded-2xl p-5">

          {/* Header */}

          <div className="flex items-center gap-3 mb-4">

            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">

              <Lightbulb
                className="text-purple-600"
                size={22}
              />

            </div>

            <div>
              <h3 className="font-semibold text-gray-800">
                Pro Tip
              </h3>

              <p className="text-xs text-gray-400">
                Productivity tip
              </p>
            </div>

          </div>

          {/* Tip */}

          <div className="mb-4">

            <h4 className="font-semibold text-gray-800 mb-1">
              {currentTip.title}
            </h4>

            <p className="text-sm text-gray-500 leading-relaxed">
              {currentTip.text}
            </p>

          </div>

          {/* Next Tip Button */}

          <button
            type="button"
            onClick={handleNextTip}
            className="w-full flex items-center justify-center gap-2 bg-white border border-purple-200 text-purple-600 hover:bg-purple-100 py-2.5 px-3 rounded-xl text-sm font-semibold transition-all duration-200"
          >
            Next Tip

            <ArrowRight size={16} />

          </button>

          {/* Tip Counter */}

          <p className="text-center text-xs text-gray-400 mt-3">
            {tipIndex + 1} of {tips.length}
          </p>

        </div>

      </div>

    </aside>
  );
}

export default Sidebar;