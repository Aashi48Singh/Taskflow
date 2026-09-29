import { useEffect, useState } from "react";
import API_URL from "../config.js";
import {
  LayoutDashboard,
  ListTodo,
  PlayCircle,
  CheckCircle2,
  Lightbulb,
  ArrowRight,
} from "lucide-react";

function Sidebar({ activePage, onNavigate }) {
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
      name: "In Progress",
      path: "/in-progress",
      icon: PlayCircle,
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
    <aside
      className="
        flex
        w-full
        md:w-64
        lg:w-72
        bg-white
        border-r
        border-gray-200
        min-h-full
        md:min-h-[calc(100vh-64px)]
        flex-col
        shrink-0
      "
    >

      {/* ========================= */}
      {/* USER SECTION */}
      {/* ========================= */}

      <div className="p-4 sm:p-5 lg:p-5 border-b border-gray-100">
        <div className="flex items-center gap-3">

          <div
            className="
              w-10
              h-10
              sm:w-11
              sm:h-11
              rounded-full
              bg-purple-600
              text-white
              flex
              items-center
              justify-center
              text-base
              sm:text-lg
              font-bold
              shrink-0
            "
          >
            {firstLetter}
          </div>

          <div className="min-w-0 flex-1">

            <h2
              className="
                font-bold
                text-base
                sm:text-lg
                text-gray-800
                truncate
              "
            >
              Hey, {userName}
            </h2>

            <p className="text-purple-500 text-xs sm:text-sm mt-0.5 truncate">
              ✨ Let's crush some tasks!
            </p>

          </div>

        </div>
      </div>

      {/* ========================= */}
      {/* PRODUCTIVITY */}
      {/* ========================= */}

      <div className="p-4 sm:p-5">

        <div className="border border-purple-100 bg-purple-50 rounded-xl p-3 sm:p-3.5">

          <div className="flex justify-between items-center mb-2.5">

            <span className="text-xs font-semibold text-purple-600">
              PRODUCTIVITY
            </span>

            <span className="bg-purple-100 text-purple-600 px-2 sm:px-2.5 py-0.5 rounded-full text-xs font-medium">
              {productivity}%
            </span>

          </div>

          <div className="h-1.5 bg-purple-100 rounded-full overflow-hidden">

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

      <nav className="px-3 sm:px-4 space-y-1.5">

        {menuItems.map((item) => {
          const Icon = item.icon;

          const isActive =
            activePage === item.name;

          return (
            <a
              key={item.name}
              href={item.path}
              onClick={onNavigate}
              className={`
                flex
                items-center
                gap-3
                px-3
                sm:px-3.5
                py-3
                rounded-lg
                text-sm
                font-medium
                transition
                ${
                  isActive
                    ? "bg-purple-50 text-purple-600 border-l-4 border-purple-600"
                    : "text-gray-600 hover:bg-gray-50"
                }
              `}
            >
              <Icon
                size={19}
                className="shrink-0"
              />

              <span className="truncate">
                {item.name}
              </span>

            </a>
          );
        })}

      </nav>

      {/* ========================= */}
      {/* PRO TIP */}
      {/* ========================= */}

      <div className="mt-auto p-4 sm:p-5">

        <div className="bg-purple-50 border border-purple-100 rounded-xl p-3.5 sm:p-4">

          <div className="flex items-center gap-2.5 mb-3">

            <div
              className="
                w-8
                h-8
                sm:w-9
                sm:h-9
                rounded-lg
                bg-purple-100
                flex
                items-center
                justify-center
                shrink-0
              "
            >
              <Lightbulb
                className="text-purple-600"
                size={19}
              />
            </div>

            <div className="min-w-0">

              <h3 className="text-sm font-semibold text-gray-800">
                Pro Tip
              </h3>

              <p className="text-[11px] text-gray-400">
                Productivity tip
              </p>

            </div>

          </div>

          <div className="mb-3">

            <h4 className="text-sm font-semibold text-gray-800 mb-1">
              {currentTip.title}
            </h4>

            <p className="text-xs text-gray-500 leading-relaxed">
              {currentTip.text}
            </p>

          </div>

          <button
            type="button"
            onClick={handleNextTip}
            className="
              w-full
              flex
              items-center
              justify-center
              gap-2
              bg-white
              border
              border-purple-200
              text-purple-600
              hover:bg-purple-100
              py-2
              px-3
              rounded-lg
              text-xs
              font-semibold
              transition-all
              duration-200
            "
          >
            Next Tip

            <ArrowRight
              size={15}
              className="shrink-0"
            />

          </button>

          <p className="text-center text-[11px] text-gray-400 mt-2">
            {tipIndex + 1} of {tips.length}
          </p>

        </div>

      </div>

    </aside>
  );
}

export default Sidebar;