import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API_URL from "../config.js";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Zap,
  Check,
  Circle,
} from "lucide-react";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleLogin = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!email.trim() || !password) {
      setError(
        "Please enter your email and password."
      );
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim(),
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message ||
            "Invalid email or password."
        );
        return;
      }

      localStorage.setItem(
        "token",
        data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      setSuccess(
        "Login successful! Opening your dashboard..."
      );

      setTimeout(() => {
        navigate("/dashboard");
      }, 600);
    } catch (error) {
      console.error("Login error:", error);

      setError(
        "Unable to connect to server. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-white to-indigo-100 flex items-center justify-center p-3 sm:p-4">

      {/* Decorative Background */}

      <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* <div className="absolute -top-20 -left-20 w-64 h-48 sm:w-80 sm:h-80 bg-purple-300/30 rounded-full blur-3xl" /> */}
         <div className="absolute -top-20 -left-20 w-48 h-48 sm:w-64 sm:h-64 lg:w-80 lg:h-80 bg-purple-300/30 rounded-full blur-3xl" />
        {/* <div className="absolute -bottom-24 -right-24 w-72 h-72 sm:w-96 sm:h-96 bg-indigo-300/30 rounded-full blur-3xl" /> */}
      <div className="absolute -bottom-20 -right-20 w-56 h-56 sm:w-72 sm:h-72 lg:w-96 lg:h-96 bg-indigo-300/30 rounded-full blur-3xl" />
      </div>

      {/* Main Container */}

      <div className="relative w-full max-w-5xl bg-white/90 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden border border-white">

        <div className="grid grid-cols-1 lg:grid-cols-2">

          {/* ================================= */}
          {/* LEFT SIDE */}
          {/* ================================= */}

          <div className="hidden lg:flex relative bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 p-8 xl:p-10 text-white flex-col justify-between min-h-[580px] overflow-hidden">

            {/* Decorative circles */}

            <div className="absolute -top-20 -right-20 w-60 h-60 border border-white/10 rounded-full" />

            <div className="absolute -bottom-28 -left-28 w-80 h-80 border border-white/10 rounded-full" />

            <div className="relative z-10">

              {/* Logo */}

              <div className="flex items-center gap-2.5">

                <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20">

                  <Zap
                    size={23}
                    className="text-white"
                    fill="currentColor"
                  />

                </div>

                <div>

                  <h1 className="text-xl font-bold">
                    TaskFlow
                  </h1>

                  <p className="text-purple-200 text-[11px]">
                    Smart Task Management
                  </p>

                </div>

              </div>

              {/* Hero */}

              <div className="mt-14">

                <p className="text-purple-200 text-xs font-medium uppercase tracking-widest mb-3">
                  Welcome back
                </p>

                <h2 className="text-4xl xl:text-[42px] font-bold leading-tight">
                  Get things done.
                  <br />
                  <span className="text-purple-200">
                    Stay in control.
                  </span>
                </h2>

                <p className="text-purple-100 text-sm mt-5 max-w-md leading-relaxed">
                  Organize your tasks, track your
                  progress, and turn your daily
                  workload into meaningful progress.
                </p>

              </div>

              {/* Mini Task Preview */}

              <div className="mt-9 bg-white/10 backdrop-blur-md border border-white/10 rounded-xl p-4 max-w-md">

                <div className="flex items-center justify-between mb-3">

                  <span className="text-xs font-semibold">
                    Today's Progress
                  </span>

                  <span className="text-purple-200 text-xs">
                    Stay productive
                  </span>

                </div>

                <div className="space-y-2.5">

                  <div className="flex items-center gap-2.5 bg-white/10 rounded-lg p-2.5">

                    <CheckCircle2
                      size={17}
                      className="text-green-300"
                    />

                    <span className="text-xs flex-1">
                      Complete project tasks
                    </span>

                    <span className="text-[11px] text-green-200">
                      Done
                    </span>

                  </div>

                  <div className="flex items-center gap-2.5 bg-white/10 rounded-lg p-2.5">

                    <Circle
                      size={17}
                      className="text-white/60"
                    />

                    <span className="text-xs flex-1">
                      Review today's schedule
                    </span>

                    <span className="text-[11px] text-purple-200">
                      Pending
                    </span>

                  </div>

                </div>

              </div>

            </div>

            {/* Bottom */}

            <div className="relative z-10 flex items-center gap-5 text-xs text-purple-200">

              <div className="flex items-center gap-1.5">
                <Check size={14} />
                Simple
              </div>

              <div className="flex items-center gap-1.5">
                <Check size={14} />
                Fast
              </div>

              <div className="flex items-center gap-1.5">
                <Check size={14} />
                Organized
              </div>

            </div>

          </div>

          {/* ================================= */}
          {/* RIGHT SIDE - LOGIN */}
          {/* ================================= */}

          <div className="p-4 sm:p-6 lg:p-8 xl:p-10 xl:p-12 flex flex-col justify-center">

            {/* Mobile Logo */}

            <div className="lg:hidden flex justify-center mb-6">

              <div className="flex items-center gap-2.5">

                <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center">

                  <Zap
                    size={22}
                    fill="currentColor"
                  />

                </div>

                <div>

                  <h1 className="text-xl font-bold text-purple-600">
                    TaskFlow
                  </h1>

                  <p className="text-[11px] text-gray-400">
                    Smart Task Management
                  </p>

                </div>

              </div>

            </div>

            {/* Heading */}

            <div className="mb-6">

              <p className="text-purple-600 font-semibold text-xs sm:text-sm mb-1.5">
                YOUR WORKSPACE
              </p>

              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                Welcome back 
              </h2>

              <p className="text-sm text-gray-500 mt-2">
                Sign in to continue managing
                your tasks.
              </p>

            </div>

            {/* Error */}

            {error && (
              <div className="mb-4 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-red-600">

                <AlertCircle
                  size={17}
                  className="mt-0.5 shrink-0"
                />

                <p className="text-xs sm:text-sm">
                  {error}
                </p>

              </div>
            )}

            {/* Success */}

            {success && (
              <div className="mb-4 flex items-start gap-2.5 rounded-xl border border-green-200 bg-green-50 px-3.5 py-2.5 text-green-700">

                <CheckCircle2
                  size={17}
                  className="mt-0.5 shrink-0"
                />

                <p className="text-xs sm:text-sm">
                  {success}
                </p>

              </div>
            )}

            {/* Form */}

            <form
              onSubmit={handleLogin}
              className="space-y-4"
            >

              {/* Email */}

              <div>

                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">
                  Email address
                </label>

                <div className="relative">

                  <Mail
                    size={17}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="email"
                    value={email}
                    onChange={(event) =>
                      setEmail(
                        event.target.value
                      )
                    }
                    placeholder="you@example.com"
                    className="w-full border border-gray-200 rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-gray-800 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                  />

                </div>

              </div>

              {/* Password */}

              <div>

                <div className="flex items-center justify-between mb-1.5">

                  <label className="block text-xs sm:text-sm font-semibold text-gray-700">
                    Password
                  </label>

                </div>

                <div className="relative">

                  <Lock
                    size={17}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    value={password}
                    onChange={(event) =>
                      setPassword(
                        event.target.value
                      )
                    }
                    placeholder="Enter your password"
                    className="w-full border border-gray-200 rounded-xl pl-10 pr-11 py-2.5 text-sm text-gray-800 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        !showPassword
                      )
                    }
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-600 transition"
                  >
                    {showPassword ? (
                      <EyeOff size={17} />
                    ) : (
                      <Eye size={17} />
                    )}
                  </button>

                </div>

              </div>

              {/* Login Button */}

              <button
                type="submit"
                disabled={loading}
                className="group w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-60 text-white py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-200 shadow-lg shadow-purple-200 hover:shadow-purple-300"
              >

                {loading ? (
                  <>
                    <Loader2
                      size={17}
                      className="animate-spin"
                    />

                    Logging in...
                  </>
                ) : (
                  <>
                    Sign In

                    <ArrowRight
                      size={17}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </>
                )}

              </button>

            </form>

            {/* Divider */}

            <div className="flex items-center gap-3 my-5">

              <div className="flex-1 h-px bg-gray-200" />

              <span className="text-[10px] text-gray-400">
                NEW TO TASKFLOW?
              </span>

              <div className="flex-1 h-px bg-gray-200" />

            </div>

            {/* Register */}

            <Link
              to="/register"
              className="w-full border border-purple-200 text-purple-600 hover:bg-purple-50 py-2.5 rounded-xl text-sm font-semibold text-center transition"
            >
              Create an Account
            </Link>

            {/* Footer */}

            <p className="text-center text-[11px] text-gray-400 mt-6">
              Organize better. Work smarter. 
            </p>

          </div>

        </div>

      </div>
    </div>
  );
}

export default Login;