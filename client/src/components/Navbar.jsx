import {
  Settings,
  ChevronDown,
  Zap,
  LogOut,
  User,
} from "lucide-react";

function Navbar() {
  const user = JSON.parse(localStorage.getItem("user"));

  const userName = user?.name || "User";
  const userEmail = user?.email || "user@example.com";
  const firstLetter = userName.charAt(0).toUpperCase();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "/login";
  };

  return (
    <header className="sticky top-0 z-50 h-20 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="h-full px-5 lg:px-8 flex items-center justify-between">

        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-purple-600 to-violet-500 flex items-center justify-center shadow-lg shadow-purple-200">
            <Zap
              className="text-white"
              size={24}
              fill="currentColor"
            />
          </div>

          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
              Task<span className="text-purple-600">Flow</span>
            </h1>

            <p className="hidden sm:block text-[11px] text-gray-400 font-medium tracking-wide">
              GET THINGS DONE
            </p>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3 sm:gap-5">

          {/* Settings */}
          <a
            href="/profile"
            className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-400 hover:text-purple-600 hover:bg-purple-50 transition-all duration-200"
            title="Settings"
          >
            <Settings size={21} />
          </a>

          {/* Divider */}
          <div className="hidden sm:block h-8 w-px bg-gray-200" />

          {/* User */}
          <div className="relative group">

            <button className="flex items-center gap-3 rounded-xl px-2 py-1.5 hover:bg-gray-50 transition-all">

              {/* Avatar */}
              <div className="relative">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-orange-400 to-orange-500 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                  {firstLetter}
                </div>

                <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full" />
              </div>

              {/* User information */}
              <div className="hidden md:block text-left max-w-[170px]">
                <p className="font-semibold text-gray-800 truncate">
                  {userName}
                </p>

                <p className="text-xs text-gray-400 truncate">
                  {userEmail}
                </p>
              </div>

              <ChevronDown
                size={17}
                className="hidden sm:block text-gray-400 group-hover:text-purple-600 transition"
              />
            </button>

            {/* Dropdown */}
            <div className="invisible opacity-0 group-hover:visible group-hover:opacity-100 absolute right-0 top-[58px] w-64 bg-white rounded-2xl shadow-xl shadow-gray-200/60 border border-gray-100 p-2 transition-all duration-200">

              {/* Dropdown user */}
              <div className="px-4 py-3 border-b border-gray-100 mb-1">
                <p className="font-semibold text-gray-800">
                  {userName}
                </p>

                <p className="text-xs text-gray-400 mt-1 truncate">
                  {userEmail}
                </p>
              </div>

              {/* Profile */}
              <a
                href="/profile"
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-purple-50 hover:text-purple-600 transition"
              >
                <div className="w-9 h-9 rounded-lg bg-purple-50 flex items-center justify-center">
                  <User size={17} />
                </div>

                <div>
                  <p className="text-sm font-medium">
                    Profile Settings
                  </p>
                  <p className="text-xs text-gray-400">
                    Manage your account
                  </p>
                </div>
              </a>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition"
              >
                <div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center">
                  <LogOut size={17} />
                </div>

                <div className="text-left">
                  <p className="text-sm font-medium">
                    Logout
                  </p>
                  <p className="text-xs text-red-300">
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