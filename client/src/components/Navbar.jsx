import { useEffect, useState } from "react";
import API_URL from "../config.js";
import {
  Settings,
  ChevronDown,
  Zap,
  LogOut,
  User,
  Bell,
  Check,
  Trash2,
  Menu,
  X,
} from "lucide-react";

function Navbar({ onMenuClick }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  });

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const [notificationOpen, setNotificationOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const userName = user?.name || "User";
  const userEmail = user?.email || "user@example.com";

  const firstLetter = userName.charAt(0).toUpperCase();

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

    window.addEventListener("profileUpdated", updateUser);

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
        `${API_URL}/api/notifications`,
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

      setNotifications(data.notifications || []);
      setUnreadCount(data.unreadCount || 0);
    } catch (error) {
      console.error(
        "Notification fetch error:",
        error
      );
    }
  };

  useEffect(() => {
    fetchNotifications();


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
        `${API_URL}/api/notifications/${notificationId}/read`,
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
        `${API_URL}/api/notifications/read-all`,
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

      const notification = notifications.find(
        (item) => item._id === notificationId
      );

      const response = await fetch(
        `${API_URL}/api/notifications/${notificationId}`,
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
          (item) => item._id !== notificationId
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

  // =========================
  // TOGGLE NOTIFICATIONS
  // =========================

  const toggleNotifications = () => {
    setNotificationOpen((current) => !current);
    setUserMenuOpen(false);

    if (!notificationOpen) {
      fetchNotifications();
    }
  };

  // =========================
  // TOGGLE USER MENU
  // =========================

  const toggleUserMenu = () => {
    setUserMenuOpen((current) => !current);
    setNotificationOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 h-16 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="h-full px-3 sm:px-5 lg:px-6 flex items-center justify-between gap-2">

        {/* ========================= */}
        {/* LEFT SIDE */}
        {/* ========================= */}

        <div className="flex min-w-0 items-center gap-2 sm:gap-2.5">

          {/* MOBILE MENU */}

          <button
            type="button"
            onClick={onMenuClick}
            className="md:hidden shrink-0 w-9 h-9 rounded-lg flex items-center justify-center text-gray-600 hover:text-purple-600 hover:bg-purple-50 active:bg-purple-100 transition"
            aria-label="Open navigation menu"
          >
            <Menu size={22} />
          </button>

          {/* LOGO */}

          <a
            href="/dashboard"
            className="flex min-w-0 items-center gap-2 sm:gap-2.5"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 shrink-0 rounded-xl bg-gradient-to-br from-purple-600 to-violet-500 flex items-center justify-center shadow-md shadow-purple-200">
              <Zap
                className="text-white"
                size={20}
                fill="currentColor"
              />
            </div>

            <div className="min-w-0">
              <h1 className="text-lg sm:text-xl lg:text-2xl font-bold tracking-tight text-gray-900 leading-none">
                Task
                <span className="text-purple-600">
                  Flow
                </span>
              </h1>

              <p className="hidden sm:block text-[9px] text-gray-400 font-medium tracking-wide mt-0.5">
                GET THINGS DONE
              </p>
            </div>
          </a>
        </div>

        {/* ========================= */}
        {/* RIGHT SIDE */}
        {/* ========================= */}

        <div className="flex shrink-0 items-center gap-1 sm:gap-2 lg:gap-3">

          {/* ========================= */}
          {/* NOTIFICATIONS */}
          {/* ========================= */}

          <div className="relative">
         
         
            <button
              type="button"
              onClick={toggleNotifications}
              className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center text-gray-400 hover:text-purple-600 hover:bg-purple-50 active:bg-purple-100 transition"
              title="Notifications"
              aria-label="Notifications"
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

         
            {/* NOTIFICATION DROPDOWN */}


            {notificationOpen && (
              <>
                <button
                  type="button"
                  aria-label="Close notifications"
                  onClick={() =>
                    setNotificationOpen(false)
                  }
                  className="fixed inset-0 z-40 cursor-default bg-transparent md:hidden"
                />

                <div className="absolute right-0 top-11 z-50 w-[calc(100vw-16px)] sm:w-[340px] max-w-[340px] bg-white rounded-xl shadow-xl shadow-gray-200/60 border border-gray-100 overflow-hidden">

                  {/* Header */}

                  <div className="px-3.5 sm:px-4 py-3 border-b border-gray-100 flex items-center justify-between gap-3">

                    <div className="min-w-0">
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
                        className="shrink-0 text-[11px] sm:text-xs font-medium text-purple-600 hover:text-purple-700"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  {/* Notifications */}

                  <div className="max-h-[60vh] sm:max-h-[360px] overflow-y-auto">

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
                                  <Check size={16} />
                                ) : (
                                  <Bell size={15} />
                                )}
                              </div>

                              {/* Content */}

                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2">
                                  <p className="text-xs font-semibold text-gray-800 break-words">
                                    {
                                      notification.title
                                    }
                                  </p>

                                  {!notification.read && (
                                    <span className="w-2 h-2 bg-purple-600 rounded-full mt-1 shrink-0" />
                                  )}
                                </div>

                                <p className="text-xs text-gray-500 mt-1 leading-relaxed break-words">
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
                                    className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition"
                                    title="Delete notification"
                                    aria-label="Delete notification"
                                  >
                                    <Trash2 size={13} />
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
              </>
           
           )}
          </div>

          {/* ========================= */}
          {/* SETTINGS */}
          {/* ========================= */}

          <a
            href="/profile"
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center text-gray-400 hover:text-purple-600 hover:bg-purple-50 active:bg-purple-100 transition-all duration-200"
            title="Settings"
            aria-label="Settings"
          >
            <Settings size={19} />
          </a>

          {/* Divider */}

          <div className="hidden sm:block h-7 w-px bg-gray-200" />

          {/* ========================= */}
          {/* USER */}
          {/* ========================= */}

          <div className="relative">

            <button
              type="button"
              onClick={toggleUserMenu}
              className="flex items-center gap-1.5 sm:gap-2.5 rounded-lg px-1 py-1 sm:px-1.5 hover:bg-gray-50 active:bg-gray-100 transition-all"
              aria-label="Open user menu"
            >

              {/* Avatar */}

              <div className="relative shrink-0">
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
                className={`hidden sm:block text-gray-400 transition-transform ${
                  userMenuOpen
                    ? "rotate-180 text-purple-600"
                    : ""
                }`}
              />
            </button>

            {/* ========================= */}
            {/* USER DROPDOWN */}
            {/* ========================= */}

            {userMenuOpen && (
              <>
                <button
                  type="button"
                  aria-label="Close user menu"
                  onClick={() =>
                    setUserMenuOpen(false)
                  }
                  className="fixed inset-0 z-40 cursor-default bg-transparent"
                />

                <div className="absolute right-0 top-[48px] z-50 w-[calc(100vw-24px)] max-w-60 bg-white rounded-xl shadow-xl shadow-gray-200/60 border border-gray-100 p-1.5">

                  <div className="px-3.5 py-2.5 border-b border-gray-100 mb-1">
                    <p className="text-sm font-semibold text-gray-800 truncate">
                      {userName}
                    </p>

                    <p className="text-[11px] text-gray-400 mt-0.5 truncate">
                      {userEmail}
                    </p>
                  </div>

                  {/* Profile */}

                  <a
                    href="/profile"
                    onClick={() =>
                      setUserMenuOpen(false)
                    }
                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-gray-600 hover:bg-purple-50 hover:text-purple-600 active:bg-purple-50 transition"
                  >
                    <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center shrink-0">
                      <User size={16} />
                    </div>

                    <div className="min-w-0">
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
                    type="button"
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-red-500 hover:bg-red-50 active:bg-red-50 transition"
                  >
                    <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center shrink-0">
                      <LogOut size={16} />
                    </div>

                    <div className="text-left min-w-0">
                      <p className="text-sm font-medium">
                        Logout
                      </p>

                      <p className="text-[11px] text-red-300">
                        Sign out of TaskFlow
                      </p>
                    </div>
                  </button>
                </div>
              </>
            )}
          </div>
       
        </div>
     
      </div>
   
    </header>
  );
}

export default Navbar;