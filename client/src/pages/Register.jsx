import { useState } from "react";
import { User, Mail, Lock, Zap } from "lucide-react";
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
        "http://localhost:5000/api/auth/register",
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
        alert(data.message || "Registration failed");
        return;
      }

      alert("Account created successfully!");

      window.location.href = "/login";
    } catch (error) {
      console.error("Registration error:", error);

      alert("Unable to connect to server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">

      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="flex justify-center mb-6">

          <div className="flex items-center gap-3">

            <div className="w-12 h-12 rounded-xl bg-purple-600 flex items-center justify-center">
              <Zap className="text-white" size={27} />
            </div>

            <h1 className="text-3xl font-bold text-purple-600">
              TaskFlow
            </h1>

          </div>

        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">

          {/* Heading */}
          <div className="text-center mb-8">

            <h2 className="text-3xl font-bold text-gray-900">
              Create Account
            </h2>

            <p className="text-gray-500 mt-2">
              Join TaskFlow and manage your tasks easily
            </p>

          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {/* Name */}
            <div>

              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>

              <div className="relative">

                <User
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  required
                  className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                />

              </div>

            </div>

            {/* Email */}
            <div>

              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>

              <div className="relative">

                <Mail
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                  className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                />

              </div>

            </div>

            {/* Password */}
            <div>

              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>

              <div className="relative">

                <Lock
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                  required
                  minLength={6}
                  className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                />

              </div>

            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white font-semibold py-3 rounded-xl transition"
            >
              {loading
                ? "Creating Account..."
                : "Create Account"}
            </button>

          </form>

          {/* Login */}
          <p className="text-center text-sm text-gray-500 mt-7">

            Already have an account?{" "}

            {/* <a
              href="/login"
              className="text-purple-600 font-semibold hover:text-purple-700"
            >
              Login
            </a> */}

             <Link
    to="/login"
    className="text-purple-600 font-semibold hover:text-purple-700 cursor-pointer"
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