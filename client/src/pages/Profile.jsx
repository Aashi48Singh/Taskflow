import { useState } from "react";
import API_URL from "../config.js";
import {
  ArrowLeft,
  User,
  Mail,
  Lock,
  Shield,
  LogOut,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Save,
  KeyRound,
} from "lucide-react";

import Layout from "../components/Layout.jsx";

function Profile() {
  const storedUser = JSON.parse(
    localStorage.getItem("user")
  );

  const token = localStorage.getItem("token");

  // =========================================
  // PROFILE STATE
  // =========================================

  const [name, setName] = useState(
    storedUser?.name || ""
  );

  const [email, setEmail] = useState(
    storedUser?.email || ""
  );

  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");

  const [error, setError] = useState("");

  // =========================================
  // PASSWORD STATE
  // =========================================

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

  const [showCurrentPassword, setShowCurrentPassword] =
    useState(false);

  const [showNewPassword, setShowNewPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  // =========================================
  // SAVE PROFILE
  // =========================================

  const handleSaveChanges = async (event) => {
    event.preventDefault();

    setMessage("");
    setError("");

    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    try {
      setSaving(true);

      const response = await fetch(
        `${API_URL}/api/auth/profile`,
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

      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      setName(data.user.name);
      setEmail(data.user.email);

      setMessage(
        "Your profile has been updated successfully."
      );

      window.dispatchEvent(
        new Event("profileUpdated")
      );
    } catch (error) {
      console.error(
        "Profile update error:",
        error
      );

      setError(
        "Unable to connect to server. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================================
  // CHANGE PASSWORD
  // =========================================

  const handleChangePassword = async (
    event
  ) => {
    event.preventDefault();

    setPasswordMessage("");
    setPasswordError("");

    if (!currentPassword) {
      setPasswordError(
        "Please enter your current password."
      );
      return;
    }

    if (!newPassword) {
      setPasswordError(
        "Please enter your new password."
      );
      return;
    }

    if (!confirmPassword) {
      setPasswordError(
        "Please confirm your new password."
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

    if (currentPassword === newPassword) {
      setPasswordError(
        "New password must be different from your current password."
      );
      return;
    }

    try {
      setChangingPassword(true);

      const response = await fetch(
        `${API_URL}/api/auth/change-password`,
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
        "Your password has been changed successfully."
      );

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setShowCurrentPassword(false);
      setShowNewPassword(false);
      setShowConfirmPassword(false);
    } catch (error) {
      console.error(
        "Change password error:",
        error
      );

      setPasswordError(
        "Unable to connect to server. Please try again."
      );
    } finally {
      setChangingPassword(false);
    }
  };

  // =========================================
  // LOGOUT
  // =========================================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "/login";
  };

  // =========================================
  // PASSWORD STRENGTH
  // =========================================

  const getPasswordStrength = () => {
    if (!newPassword) {
      return {
        label: "",
        width: "0%",
      };
    }

    if (newPassword.length < 6) {
      return {
        label: "Weak password",
        width: "33%",
      };
    }

    if (
      newPassword.length >= 6 &&
      newPassword.length < 10
    ) {
      return {
        label: "Good password",
        width: "66%",
      };
    }

    return {
      label: "Strong password",
      width: "100%",
    };
  };

  const passwordStrength =
    getPasswordStrength();

  // =========================================
  // USER INITIAL
  // =========================================

  const firstLetter =
    name?.charAt(0).toUpperCase() || "U";

  // =========================================
  // COMPONENT
  // =========================================

  return (
    <Layout activePage="">

      <div className="p-4 sm:p-5 lg:p-6 xl:p-7">

        {/* =====================================
            BACK
        ===================================== */}

        <a
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-gray-500 hover:text-purple-600 transition mb-5"
        >
          <ArrowLeft size={16} />

          <span className="text-sm font-medium">
            Back to Dashboard
          </span>
        </a>

        {/* =====================================
            PAGE HEADER
        ===================================== */}

        <div className="flex flex-col sm:flex-row sm:items-center gap-3.5 mb-6">

          {/* Avatar */}

          <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-700 text-white flex items-center justify-center text-2xl font-bold shadow-lg shadow-purple-200 shrink-0">
            {firstLetter}
          </div>

          {/* Title */}

          <div>

            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Account Settings
            </h1>

            <p className="text-sm text-gray-500 mt-0.5">
              Manage your personal information
              and security settings.
            </p>

          </div>

        </div>

        {/* =====================================
            PROFILE SUCCESS / ERROR
        ===================================== */}

        {message && (
          <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-green-200 bg-green-50 px-3.5 py-3 text-green-700">

            <CheckCircle2
              size={18}
              className="mt-0.5 shrink-0"
            />

            <div>
              <p className="font-semibold text-sm">
                Success
              </p>

              <p className="text-xs sm:text-sm mt-0.5">
                {message}
              </p>
            </div>

          </div>
        )}

        {error && (
          <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-3.5 py-3 text-red-600">

            <AlertCircle
              size={18}
              className="mt-0.5 shrink-0"
            />

            <div>
              <p className="font-semibold text-sm">
                Something went wrong
              </p>

              <p className="text-xs sm:text-sm mt-0.5">
                {error}
              </p>
            </div>

          </div>
        )}

        {/* =====================================
            MAIN GRID
        ===================================== */}

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-5 items-start">

          {/* ===================================
              PERSONAL INFORMATION
          =================================== */}

          <section className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

            {/* Card Header */}

            <div className="px-4 sm:px-5 py-4 border-b border-gray-100">

              <div className="flex items-center gap-3">

                <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center shrink-0">
                  <User
                    className="text-purple-600"
                    size={20}
                  />
                </div>

                <div>

                  <h2 className="text-lg font-bold text-gray-900">
                    Personal Information
                  </h2>

                  <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                    Update your account details
                  </p>

                </div>

              </div>

            </div>

            {/* Form */}

            <form
              onSubmit={handleSaveChanges}
              className="p-4 sm:p-5"
            >

              <div className="space-y-4">

                {/* Name */}

                <div>

                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Full Name
                  </label>

                  <div className="relative">

                    <User
                      size={17}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-400"
                    />

                    <input
                      type="text"
                      value={name}
                      onChange={(event) => {
                        setName(
                          event.target.value
                        );
                        setMessage("");
                        setError("");
                      }}
                      placeholder="Enter your full name"
                      className="w-full h-11 border border-gray-200 rounded-xl pl-10 pr-3.5 text-sm text-gray-800 outline-none transition focus:border-purple-500 focus:ring-4 focus:ring-purple-50 hover:border-gray-300"
                    />

                  </div>

                </div>

                {/* Email */}

                <div>

                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Email Address
                  </label>

                  <div className="relative">

                    <Mail
                      size={17}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-400"
                    />

                    <input
                      type="email"
                      value={email}
                      onChange={(event) => {
                        setEmail(
                          event.target.value
                        );
                        setMessage("");
                        setError("");
                      }}
                      placeholder="Enter your email"
                      className="w-full h-11 border border-gray-200 rounded-xl pl-10 pr-3.5 text-sm text-gray-800 outline-none transition focus:border-purple-500 focus:ring-4 focus:ring-purple-50 hover:border-gray-300"
                    />

                  </div>

                </div>

              </div>

              {/* Button */}

              <button
                type="submit"
                disabled={saving}
                className="w-full mt-5 h-11 bg-purple-600 hover:bg-purple-700 disabled:opacity-60 disabled:cursor-not-allowed text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition shadow-sm shadow-purple-200"
              >

                {saving ? (
                  <>
                    <Loader2
                      size={17}
                      className="animate-spin"
                    />

                    Saving Changes...
                  </>
                ) : (
                  <>
                    <Save size={17} />

                    Save Changes
                  </>
                )}

              </button>

            </form>

          </section>

          {/* ===================================
              SECURITY
          =================================== */}

          <section className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

            {/* Card Header */}

            <div className="px-4 sm:px-5 py-4 border-b border-gray-100">

              <div className="flex items-center gap-3">

                <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center shrink-0">
                  <Shield
                    className="text-purple-600"
                    size={20}
                  />
                </div>

                <div>

                  <h2 className="text-lg font-bold text-gray-900">
                    Security
                  </h2>

                  <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                    Keep your account secure
                  </p>

                </div>

              </div>

            </div>

            {/* Security Form */}

            <form
              onSubmit={handleChangePassword}
              className="p-4 sm:p-5"
            >

              {/* Security Message */}

              {passwordMessage && (
                <div className="mb-4 flex items-start gap-2.5 rounded-xl border border-green-200 bg-green-50 px-3.5 py-2.5 text-green-700">

                  <CheckCircle2
                    size={17}
                    className="mt-0.5 shrink-0"
                  />

                  <p className="text-xs sm:text-sm">
                    {passwordMessage}
                  </p>

                </div>
              )}

              {passwordError && (
                <div className="mb-4 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-red-600">

                  <AlertCircle
                    size={17}
                    className="mt-0.5 shrink-0"
                  />

                  <p className="text-xs sm:text-sm">
                    {passwordError}
                  </p>

                </div>
              )}

              <div className="space-y-4">

                {/* Current Password */}

                <div>

                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Current Password
                  </label>

                  <div className="relative">

                    <Lock
                      size={17}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-400"
                    />

                    <input
                      type={
                        showCurrentPassword
                          ? "text"
                          : "password"
                      }
                      value={currentPassword}
                      onChange={(event) => {
                        setCurrentPassword(
                          event.target.value
                        );
                        setPasswordError("");
                        setPasswordMessage("");
                      }}
                      placeholder="Enter current password"
                      className="w-full h-11 border border-gray-200 rounded-xl pl-10 pr-11 text-sm text-gray-800 outline-none transition focus:border-purple-500 focus:ring-4 focus:ring-purple-50 hover:border-gray-300"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowCurrentPassword(
                          !showCurrentPassword
                        )
                      }
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-600 transition"
                    >
                      {showCurrentPassword ? (
                        <EyeOff size={17} />
                      ) : (
                        <Eye size={17} />
                      )}
                    </button>

                  </div>

                </div>

                {/* New Password */}

                <div>

                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    New Password
                  </label>

                  <div className="relative">

                    <KeyRound
                      size={17}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-400"
                    />

                    <input
                      type={
                        showNewPassword
                          ? "text"
                          : "password"
                      }
                      value={newPassword}
                      onChange={(event) => {
                        setNewPassword(
                          event.target.value
                        );
                        setPasswordError("");
                        setPasswordMessage("");
                      }}
                      placeholder="Enter new password"
                      className="w-full h-11 border border-gray-200 rounded-xl pl-10 pr-11 text-sm text-gray-800 outline-none transition focus:border-purple-500 focus:ring-4 focus:ring-purple-50 hover:border-gray-300"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowNewPassword(
                          !showNewPassword
                        )
                      }
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-600 transition"
                    >
                      {showNewPassword ? (
                        <EyeOff size={17} />
                      ) : (
                        <Eye size={17} />
                      )}
                    </button>

                  </div>

                  {/* Password Strength */}

                  {newPassword && (
                    <div className="mt-2">

                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">

                        <div
                          className="h-full bg-purple-500 rounded-full transition-all duration-300"
                          style={{
                            width:
                              passwordStrength.width,
                          }}
                        />

                      </div>

                      <p className="text-xs text-gray-500 mt-1">
                        {passwordStrength.label}
                      </p>

                    </div>
                  )}

                </div>

                {/* Confirm Password */}

                <div>

                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Confirm New Password
                  </label>

                  <div className="relative">

                    <Lock
                      size={17}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-400"
                    />

                    <input
                      type={
                        showConfirmPassword
                          ? "text"
                          : "password"
                      }
                      value={confirmPassword}
                      onChange={(event) => {
                        setConfirmPassword(
                          event.target.value
                        );
                        setPasswordError("");
                        setPasswordMessage("");
                      }}
                      placeholder="Confirm new password"
                      className="w-full h-11 border border-gray-200 rounded-xl pl-10 pr-11 text-sm text-gray-800 outline-none transition focus:border-purple-500 focus:ring-4 focus:ring-purple-50 hover:border-gray-300"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(
                          !showConfirmPassword
                        )
                      }
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-600 transition"
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={17} />
                      ) : (
                        <Eye size={17} />
                      )}
                    </button>

                  </div>

                </div>

              </div>

              {/* Password Button */}

              <button
                type="submit"
                disabled={changingPassword}
                className="w-full mt-5 h-11 bg-purple-600 hover:bg-purple-700 disabled:opacity-60 disabled:cursor-not-allowed text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition shadow-sm shadow-purple-200"
              >

                {changingPassword ? (
                  <>
                    <Loader2
                      size={17}
                      className="animate-spin"
                    />

                    Changing Password...
                  </>
                ) : (
                  <>
                    <Lock size={17} />

                    Change Password
                  </>
                )}

              </button>

              <p className="text-xs text-gray-400 mt-2.5 text-center">
                Password must contain at least 6 characters.
              </p>

            </form>

            {/* =================================
                DANGER ZONE
            ================================= */}

            <div className="mx-4 sm:mx-5 mb-4 sm:mb-5 border-t border-gray-100 pt-5">

              <div className="rounded-xl border border-red-100 bg-red-50/50 p-3.5">

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

                  <div>

                    <h3 className="text-sm font-bold text-red-600">
                      Sign out
                    </h3>

                    <p className="text-xs text-gray-500 mt-0.5">
                      Sign out of your TaskFlow account
                      on this device.
                    </p>

                  </div>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="shrink-0 border border-red-200 bg-white text-red-600 hover:bg-red-600 hover:text-white px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 transition"
                  >
                    <LogOut size={16} />

                    Logout
                  </button>

                </div>

              </div>

            </div>

          </section>

        </div>

      </div>

    </Layout>
  );
}

export default Profile;