import { useEffect, useState } from "react";

import {
  Settings,
  ChevronDown,
  Zap,
  LogOut,
  User,
  Bell,
  Check,
  Trash2,
} from "lucide-react";

function Navbar() {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem("user")
      );
    } catch {
      return null;
    }
  });

  const [notifications, setNotifications] = useState(
    []
  );

  const [unreadCount, setUnreadCount] = useState(0);

  const [notificationOpen, setNotificationOpen] =
    useState(false);

  const userName = user?.name || "User";
  const userEmail =
    user?.email || "user@example.com";

  const firstLetter = userName
    .charAt(0)
    .toUpperCase();

  // =========================
  // UPDATE USER
  // =========================

  useEffect(() => {
    const updateUser = () => {
      try {
        const storedUser = JSON.parse(
          localStorage.getItem("user")
        );

        setUser(storedUser);
      } catch {
        setUser(null);
      }
    };

    window.addEventListener(
      "profileUpdated",
      updateUser
    );

    return () => {
      window.removeEventListener(
        "profileUpdated",
        updateUser
      );
    };
  }, []);

  // =========================
  // FETCH NOTIFICATIONS
  // =========================

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        return;
      }

      const response = await fetch(
        "http://localhost:5000/api/notifications",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error(
          "Notification error:",
          data.message
        );
        return;
      }

      setNotifications(
        data.notifications || []
      );

      setUnreadCount(
        data.unreadCount || 0
      );
    } catch (error) {
      console.error(
        "Notification fetch error:",
        error
      );
    }
  };

  useEffect(() => {
    fetchNotifications();

    // Check for new notifications every minute
    const interval = setInterval(() => {
      fetchNotifications();
    }, 60 * 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  // =========================
  // MARK AS READ
  // =========================

  const markAsRead = async (notificationId) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5000/api/notifications/${notificationId}/read`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        return;
      }

      setNotifications((current) =>
        current.map((notification) =>
          notification._id === notificationId
            ? {
                ...notification,
                read: true,
              }
            : notification
        )
      );

      setUnreadCount((current) =>
        Math.max(0, current - 1)
      );
    } catch (error) {
      console.error(
        "Mark notification error:",
        error
      );
    }
  };

  // =========================
  // MARK ALL AS READ
  // =========================

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:5000/api/notifications/read-all",
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        return;
      }

      setNotifications((current) =>
        current.map((notification) => ({
          ...notification,
          read: true,
        }))
      );

      setUnreadCount(0);
    } catch (error) {
      console.error(
        "Mark all notifications error:",
        error
      );
    }
  };

  // =========================
  // DELETE NOTIFICATION
  // =========================

  const deleteNotification = async (
    notificationId
  ) => {
    try {
      const token = localStorage.getItem("token");

      const notification =
        notifications.find(
          (item) =>
            item._id === notificationId
        );

      const response = await fetch(
        `http://localhost:5000/api/notifications/${notificationId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        return;
      }

      setNotifications((current) =>
        current.filter(
          (item) =>
            item._id !== notificationId
        )
      );

      if (notification && !notification.read) {
        setUnreadCount((current) =>
          Math.max(0, current - 1)
        );
      }
    } catch (error) {
      console.error(
        "Delete notification error:",
        error
      );
    }
  };

  // =========================
  // LOGOUT
  // =========================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "/login";
  };

  // =========================
  // NOTIFICATION ICON
  // =========================

  const getNotificationIcon = (type) => {
    if (type === "task_completed") {
      return "bg-green-100 text-green-600";
    }

    if (type === "one_day_before") {
      return "bg-blue-100 text-blue-600";
    }

    if (type === "one_hour_before") {
      return "bg-orange-100 text-orange-600";
    }

    if (type === "deadline") {
      return "bg-red-100 text-red-600";
    }

    if (type === "overdue") {
      return "bg-red-100 text-red-600";
    }

    return "bg-purple-100 text-purple-600";
  };

  return (
    <header className="sticky top-0 z-50 h-16 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">

      <div className="h-full px-4 sm:px-5 lg:px-6 flex items-center justify-between">

        {/* ========================= */}
        {/* LOGO */}
        {/* ========================= */}

        <div className="flex items-center gap-2.5">

          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-purple-600 to-violet-500 flex items-center justify-center shadow-md shadow-purple-200">

            <Zap
              className="text-white"
              size={21}
              fill="currentColor"
            />

          </div>

          <div>

            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900 leading-none">
              Task
              <span className="text-purple-600">
                Flow
              </span>
            </h1>

            <p className="hidden sm:block text-[9px] text-gray-400 font-medium tracking-wide mt-0.5">
              GET THINGS DONE
            </p>

          </div>

        </div>

        {/* ========================= */}
        {/* RIGHT SIDE */}
        {/* ========================= */}

        <div className="flex items-center gap-1.5 sm:gap-3">

          {/* ========================= */}
          {/* NOTIFICATIONS */}
          {/* ========================= */}

          <div className="relative">

            <button
              type="button"
              onClick={() => {
                setNotificationOpen(
                  (current) => !current
                );

                if (!notificationOpen) {
                  fetchNotifications();
                }
              }}
              className="relative w-9 h-9 rounded-lg flex items-center justify-center text-gray-400 hover:text-purple-600 hover:bg-purple-50 transition"
              title="Notifications"
            >

              <Bell size={19} />

              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[17px] h-[17px] px-1 bg-red-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center border-2 border-white">
                  {unreadCount > 99
                    ? "99+"
                    : unreadCount}
                </span>
              )}

            </button>

            {/* ========================= */}
            {/* NOTIFICATION DROPDOWN */}
            {/* ========================= */}

            {notificationOpen && (
              <div className="absolute right-0 top-11 w-[340px] max-w-[calc(100vw-24px)] bg-white rounded-xl shadow-xl shadow-gray-200/60 border border-gray-100 overflow-hidden">

                {/* Header */}

                <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">

                  <div>

                    <h3 className="text-sm font-semibold text-gray-800">
                      Notifications
                    </h3>

                    <p className="text-[11px] text-gray-400 mt-0.5">
                      {unreadCount > 0
                        ? `${unreadCount} unread notification${
                            unreadCount > 1
                              ? "s"
                              : ""
                          }`
                        : "You're all caught up"}
                    </p>

                  </div>

                  {unreadCount > 0 && (
                    <button
                      type="button"
                      onClick={markAllAsRead}
                      className="text-xs font-medium text-purple-600 hover:text-purple-700"
                    >
                      Mark all read
                    </button>
                  )}

                </div>

                {/* Notifications */}

                <div className="max-h-[360px] overflow-y-auto">

                  {notifications.length === 0 ? (

                    <div className="px-5 py-8 text-center">

                      <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center mx-auto">

                        <Bell
                          size={18}
                          className="text-purple-500"
                        />

                      </div>

                      <p className="text-sm font-medium text-gray-700 mt-3">
                        No notifications
                      </p>

                      <p className="text-xs text-gray-400 mt-1">
                        You're all caught up!
                      </p>

                    </div>

                  ) : (

                    notifications.map(
                      (notification) => (
                        <div
                          key={notification._id}
                          className={`px-3.5 py-3 border-b border-gray-50 hover:bg-gray-50 transition ${
                            !notification.read
                              ? "bg-purple-50/40"
                              : ""
                          }`}
                        >

                          <div className="flex gap-2.5">

                            {/* Icon */}

                            <div
                              className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${getNotificationIcon(
                                notification.type
                              )}`}
                            >
                              {notification.type ===
                              "task_completed" ? (
                                <Check
                                  size={16}
                                />
                              ) : (
                                <Bell
                                  size={15}
                                />
                              )}
                            </div>

                            {/* Content */}

                            <div className="flex-1 min-w-0">

                              <div className="flex items-start justify-between gap-2">

                                <p className="text-xs font-semibold text-gray-800">
                                  {
                                    notification.title
                                  }
                                </p>

                                {!notification.read && (
                                  <span className="w-2 h-2 bg-purple-600 rounded-full mt-1 shrink-0" />
                                )}

                              </div>

                              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                                {
                                  notification.message
                                }
                              </p>

                              <div className="flex items-center gap-3 mt-2">

                                {!notification.read && (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      markAsRead(
                                        notification._id
                                      )
                                    }
                                    className="text-[11px] text-purple-600 font-medium hover:text-purple-700"
                                  >
                                    Mark as read
                                  </button>
                                )}

                                <button
                                  type="button"
                                  onClick={() =>
                                    deleteNotification(
                                      notification._id
                                    )
                                  }
                                  className="text-gray-400 hover:text-red-500 transition"
                                  title="Delete notification"
                                >
                                  <Trash2
                                    size={13}
                                  />
                                </button>

                              </div>

                            </div>

                          </div>

                        </div>
                      )
                    )

                  )}

                </div>

              </div>
            )}

          </div>

          {/* Settings */}

          <a
            href="/profile"
            className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-400 hover:text-purple-600 hover:bg-purple-50 transition-all duration-200"
            title="Settings"
          >
            <Settings size={19} />
          </a>

          {/* Divider */}

          <div className="hidden sm:block h-7 w-px bg-gray-200" />

          {/* ========================= */}
          {/* USER */}
          {/* ========================= */}

          <div className="relative group">

            <button className="flex items-center gap-2.5 rounded-lg px-1.5 py-1 hover:bg-gray-50 transition-all">

              {/* Avatar */}

              <div className="relative">

                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-500 text-white flex items-center justify-center font-bold text-base shadow-sm">
                  {firstLetter}
                </div>

                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />

              </div>

              {/* User information */}

              <div className="hidden md:block text-left max-w-[160px]">

                <p className="text-sm font-semibold text-gray-800 truncate">
                  {userName}
                </p>

                <p className="text-[11px] text-gray-400 truncate">
                  {userEmail}
                </p>

              </div>

              <ChevronDown
                size={16}
                className="hidden sm:block text-gray-400 group-hover:text-purple-600 transition"
              />

            </button>

            {/* ========================= */}
            {/* USER DROPDOWN */}
            {/* ========================= */}

            <div className="invisible opacity-0 group-hover:visible group-hover:opacity-100 absolute right-0 top-[48px] w-60 bg-white rounded-xl shadow-xl shadow-gray-200/60 border border-gray-100 p-1.5 transition-all duration-200">

              <div className="px-3.5 py-2.5 border-b border-gray-100 mb-1">

                <p className="text-sm font-semibold text-gray-800">
                  {userName}
                </p>

                <p className="text-[11px] text-gray-400 mt-0.5 truncate">
                  {userEmail}
                </p>

              </div>

              {/* Profile */}

              <a
                href="/profile"
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-gray-600 hover:bg-purple-50 hover:text-purple-600 transition"
              >

                <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center shrink-0">
                  <User size={16} />
                </div>

                <div>

                  <p className="text-sm font-medium">
                    Profile Settings
                  </p>

                  <p className="text-[11px] text-gray-400">
                    Manage your account
                  </p>

                </div>

              </a>

              {/* Logout */}

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-red-500 hover:bg-red-50 transition"
              >

                <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center shrink-0">
                  <LogOut size={16} />
                </div>

                <div className="text-left">

                  <p className="text-sm font-medium">
                    Logout
                  </p>

                  <p className="text-[11px] text-red-300">
                    Sign out of TaskFlow
                  </p>

                </div>

              </button>

            </div>

          </div>

        </div>

      </div>

    </header>
  );
}

export default Navbar;