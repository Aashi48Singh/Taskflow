import { useState } from "react";

import {
  ArrowLeft,
  User,
  Mail,
  Lock,
  Shield,
  LogOut,
  Loader2,
  CheckCircle2,
} from "lucide-react";

import Layout from "../components/Layout.jsx";

function Profile() {
  const storedUser = JSON.parse(
    localStorage.getItem("user")
  );

  const token = localStorage.getItem("token");

  // =========================
  // PERSONAL INFORMATION
  // =========================

  const [name, setName] = useState(
    storedUser?.name || ""
  );

  const [email, setEmail] = useState(
    storedUser?.email || ""
  );

  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");

  const [error, setError] = useState("");

  // =========================
  // CHANGE PASSWORD
  // =========================

  const [currentPassword, setCurrentPassword] =
    useState("");

  const [newPassword, setNewPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [changingPassword, setChangingPassword] =
    useState(false);

  const [passwordMessage, setPasswordMessage] =
    useState("");

  const [passwordError, setPasswordError] =
    useState("");

  // =========================
  // SAVE PROFILE
  // =========================

  const handleSaveChanges = async (event) => {
    event.preventDefault();

    setMessage("");
    setError("");

    if (!name.trim() || !email.trim()) {
      setError("Name and email are required.");
      return;
    }

    try {
      setSaving(true);

      const response = await fetch(
        "http://localhost:5000/api/auth/profile",
        {
          method: "PATCH",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            name: name.trim(),
            email: email.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message ||
            "Failed to update profile."
        );
        return;
      }

      // Updated user save in localStorage
      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      setName(data.user.name);
      setEmail(data.user.email);

      setMessage(
        "Profile updated successfully!"
      );

      // Navbar / Sidebar ko update karne ke liye
      window.dispatchEvent(
        new Event("profileUpdated")
      );
    } catch (error) {
      console.error(
        "Profile update error:",
        error
      );

      setError(
        "Unable to connect to server."
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // CHANGE PASSWORD
  // =========================

  const handleChangePassword = async (
    event
  ) => {
    event.preventDefault();

    setPasswordMessage("");
    setPasswordError("");

    if (
      !currentPassword ||
      !newPassword ||
      !confirmPassword
    ) {
      setPasswordError(
        "Please fill all password fields."
      );
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError(
        "New password must be at least 6 characters."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError(
        "New password and confirm password do not match."
      );
      return;
    }

    try {
      setChangingPassword(true);

      const response = await fetch(
        "http://localhost:5000/api/auth/change-password",
        {
          method: "PATCH",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            currentPassword,
            newPassword,
            confirmPassword,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setPasswordError(
          data.message ||
            "Failed to change password."
        );
        return;
      }

      setPasswordMessage(
        "Password changed successfully!"
      );

      // Fields clear karna
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error(
        "Change password error:",
        error
      );

      setPasswordError(
        "Unable to connect to server."
      );
    } finally {
      setChangingPassword(false);
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
  // UI
  // =========================

  return (
    <Layout activePage="">
      <div className="p-6 lg:p-8">

        {/* Back to Dashboard */}
        <a
          href="/dashboard"
          className="flex items-center gap-2 text-gray-600 hover:text-purple-600 mb-8"
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </a>

        {/* Header */}
        <div className="flex items-center gap-5 mb-8">

          <div className="w-20 h-20 rounded-full bg-purple-600 text-white flex items-center justify-center text-3xl font-bold">
            {name.charAt(0).toUpperCase() ||
              "U"}
          </div>

          <div>
            <h1 className="text-4xl font-bold text-gray-900">
              Account Settings
            </h1>

            <p className="text-gray-500 mt-1">
              Manage your profile and security
              settings
            </p>
          </div>

        </div>

        {/* Profile Success Message */}
        {message && (
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-green-700">
            <CheckCircle2 size={20} />

            <span>{message}</span>
          </div>
        )}

        {/* Profile Error Message */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-600">
            {error}
          </div>
        )}

        {/* Main Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">

          {/* ================================= */}
          {/* PERSONAL INFORMATION */}
          {/* ================================= */}

          <div className="bg-white rounded-2xl border p-8">

            <div className="flex items-center gap-3 mb-7">

              <User className="text-purple-600" />

              <h2 className="text-2xl font-semibold">
                Personal Information
              </h2>

            </div>

            <form
              onSubmit={handleSaveChanges}
              className="space-y-5"
            >

              {/* Name */}
              <div className="flex items-center gap-3 border rounded-xl px-4 py-4">

                <User
                  className="text-purple-500"
                  size={20}
                />

                <input
                  type="text"
                  value={name}
                  onChange={(event) =>
                    setName(
                      event.target.value
                    )
                  }
                  placeholder="Your Name"
                  className="outline-none flex-1 text-gray-800"
                />

              </div>

              {/* Email */}
              <div className="flex items-center gap-3 border rounded-xl px-4 py-4">

                <Mail
                  className="text-purple-500"
                  size={20}
                />

                <input
                  type="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(
                      event.target.value
                    )
                  }
                  placeholder="Your Email"
                  className="outline-none flex-1 text-gray-800"
                />

              </div>

              {/* Save */}
              <button
                type="submit"
                disabled={saving}
                className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-60 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
              >
                {saving ? (
                  <>
                    <Loader2
                      size={18}
                      className="animate-spin"
                    />

                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>

            </form>
          </div>

          {/* ================================= */}
          {/* SECURITY */}
          {/* ================================= */}

          <div className="bg-white rounded-2xl border p-8">

            <div className="flex items-center gap-3 mb-7">

              <Shield className="text-purple-600" />

              <h2 className="text-2xl font-semibold">
                Security
              </h2>

            </div>

            {/* Password Success */}
            {passwordMessage && (
              <div className="mb-5 flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-green-700">
                <CheckCircle2 size={20} />

                <span>
                  {passwordMessage}
                </span>
              </div>
            )}

            {/* Password Error */}
            {passwordError && (
              <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-600">
                {passwordError}
              </div>
            )}

            <form
              onSubmit={handleChangePassword}
              className="space-y-5"
            >

              {/* Current Password */}
              <div className="flex items-center gap-3 border rounded-xl px-4 py-4">

                <Lock
                  className="text-purple-500"
                  size={20}
                />

                <input
                  type="password"
                  placeholder="Current Password"
                  value={currentPassword}
                  onChange={(event) =>
                    setCurrentPassword(
                      event.target.value
                    )
                  }
                  className="outline-none flex-1"
                />

              </div>

              {/* New Password */}
              <div className="flex items-center gap-3 border rounded-xl px-4 py-4">

                <Lock
                  className="text-purple-500"
                  size={20}
                />

                <input
                  type="password"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(event) =>
                    setNewPassword(
                      event.target.value
                    )
                  }
                  className="outline-none flex-1"
                />

              </div>

              {/* Confirm Password */}
              <div className="flex items-center gap-3 border rounded-xl px-4 py-4">

                <Lock
                  className="text-purple-500"
                  size={20}
                />

                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(event) =>
                    setConfirmPassword(
                      event.target.value
                    )
                  }
                  className="outline-none flex-1"
                />

              </div>

              {/* Change Password */}
              <button
                type="submit"
                disabled={changingPassword}
                className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-60 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
              >
                {changingPassword ? (
                  <>
                    <Loader2
                      size={18}
                      className="animate-spin"
                    />

                    Changing Password...
                  </>
                ) : (
                  "Change Password"
                )}
              </button>

            </form>

            {/* ================================= */}
            {/* DANGER ZONE */}
            {/* ================================= */}

            <div className="border-t mt-8 pt-8">

              <h3 className="text-red-600 font-semibold mb-4">
                Danger Zone
              </h3>

              <button
                type="button"
                onClick={handleLogout}
                className="w-full border border-red-200 text-red-600 py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-red-50"
              >
                <LogOut size={18} />

                Logout
              </button>

            </div>

          </div>

        </div>
      </div>
    </Layout>
  );
}

export default Profile;