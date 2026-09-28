import { useState } from "react";
import API_URL from "../config.js";
import {
  User,
  Mail,
  Lock,
  Zap,
  Loader2,
} from "lucide-react";

import { Link } from "react-router-dom";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/api/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message || "Registration failed"
        );
        return;
      }

      alert("Account created successfully!");

      window.location.href = "/login";
    } catch (error) {
      console.error(
        "Registration error:",
        error
      );

      alert("Unable to connect to server");
    } finally {
      setLoading(false);
    }
  };

  return (
    // <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-7 sm:py-10">
       <div className="min-h-screen bg-gray-50 flex items-center justify-center px-3 py-6 sm:px-4 sm:py-10">
      <div className="w-full max-w-sm sm:max-w-md">

        {/* =========================
            LOGO
        ========================= */}

        <div className="flex justify-center mb-5">

          <div className="flex items-center gap-2.5">

            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-purple-600 flex items-center justify-center">
              <Zap
                className="text-white"
                size={23}
                fill="currentColor"
              />
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-purple-600">
              TaskFlow
            </h1>

          </div>

        </div>

        {/* =========================
            CARD
        ========================= */}

        {/* <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-7"> */}
           <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 md:p-7">
          {/* =========================
              HEADING
          ========================= */}

          <div className="text-center mb-6">

            {/* <h2 className="text-2xl sm:text-3xl font-bold text-gray-900"> */}
             <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
              Create Account
            </h2>

            <p className="text-sm text-gray-500 mt-1.5">
              Join TaskFlow and manage your tasks easily
            </p>

          </div>

          {/* =========================
              FORM
          ========================= */}

          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >

            {/* Name */}

            <div>

              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Full Name
              </label>

              <div className="relative">

                <User
                  size={17}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  required
                  className="w-full h-11 pl-10 pr-3.5 text-sm border border-gray-200 rounded-xl outline-none text-gray-800 transition focus:border-purple-500 focus:ring-4 focus:ring-purple-50"
                />

              </div>

            </div>

            {/* Email */}

            <div>

              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Email
              </label>

              <div className="relative">

                <Mail
                  size={17}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                  className="w-full h-11 pl-10 pr-3.5 text-sm border border-gray-200 rounded-xl outline-none text-gray-800 transition focus:border-purple-500 focus:ring-4 focus:ring-purple-50"
                />

              </div>

            </div>

            {/* Password */}

            <div>

              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Password
              </label>

              <div className="relative">

                <Lock
                  size={17}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                  required
                  minLength={6}
                  className="w-full h-11 pl-10 pr-3.5 text-sm border border-gray-200 rounded-xl outline-none text-gray-800 transition focus:border-purple-500 focus:ring-4 focus:ring-purple-50"
                />

              </div>

              <p className="text-xs text-gray-400 mt-1.5">
                Password must contain at least 6 characters.
              </p>

            </div>

            {/* =========================
                BUTTON
            ========================= */}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition flex items-center justify-center gap-2"
            >

              {loading ? (
                <>
                  <Loader2
                    size={17}
                    className="animate-spin"
                  />

                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}

            </button>

          </form>

          {/* =========================
              LOGIN
          ========================= */}

          <p className="text-center text-sm text-gray-500 mt-6">

            Already have an account?{" "}

            <Link
              to="/login"
              className="text-purple-600 font-semibold hover:text-purple-700 transition"
            >
              Login
            </Link>

          </p>

        </div>

      </div>

    </div>
  );
}

export default Register;
