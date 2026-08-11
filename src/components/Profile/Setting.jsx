// src/components/Profile/Setting.jsx
import React, { useEffect, useState } from "react";
import api from "../../util/axios";
import { useDispatch } from "react-redux";
import { authActions } from "../../store/auth";
import { toast } from "react-toastify";

const Setting = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    address: "",
    avatar: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const response = await api.get(
        `/get-user-information`
      );
      const userData = response.data;

      setUser(userData);
      setFormData({
        username: userData.username || "",
        email: userData.email || "",
        address: userData.address || "",
        avatar: userData.avatar || "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
    } catch (error) {
      console.error("Error fetching user data:", error);
      setError("Failed to load user information");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileUpdate = async (e) => {
  e.preventDefault();
  setSaving(true);
  setError(null);
  setSuccess(null);

  try {
    const updateData = {
      username: formData.username,
      email: formData.email,
      address: formData.address,
      avatar: formData.avatar
    };

    await api.put(
      `/update-profile`,
      updateData
    );

    setSuccess("Profile updated successfully!");

    // ✅ update user and formData immediately
    setUser((prevUser) => ({ ...prevUser, ...updateData }));
    setFormData((prev) => ({
      ...prev,
      ...updateData
    }));

    // ✅ Update global Redux state
    dispatch(authActions.updateUser(updateData));

    // Clear success after 3s
    setTimeout(() => setSuccess(null), 3000);
  } catch (error) {
    console.error("Error updating profile:", error);
    setError(error.response?.data?.message || "Failed to update profile");
  } finally {
    setSaving(false);
  }
};


  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    if (formData.newPassword !== formData.confirmPassword) {
      setError("New passwords do not match");
      setSaving(false);
      return;
    }

    if (formData.newPassword.length < 6) {
      setError("New password must be at least 6 characters long");
      setSaving(false);
      return;
    }

    try {
      await api.put(
        `/change-password`,
        {
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        }
      );

      setSuccess("Password changed successfully!");
      setFormData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      }));

      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error("Error changing password:", error);
      setError(error.response?.data?.message || "Failed to change password");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      await api.delete(`/delete-account`);
      toast.success("Account deleted successfully. Redirecting to home...");
      setTimeout(() => {
        window.location.href = "/";
      }, 1500);
    } catch (error) {
      console.error("Error deleting account:", error);
      toast.error("Failed to delete account");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-white text-lg">Loading settings...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-20 bg-zinc-800/50 rounded-2xl backdrop-blur-sm border border-zinc-700">
        <div className="text-7xl mb-6">⚠️</div>
        <h3 className="text-3xl font-bold text-gray-300 mb-3">
          Error Loading Settings
        </h3>
        <p className="text-gray-400 text-lg mb-8">
          Failed to load user information
        </p>
        <button
          onClick={fetchUserData}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-white flex items-center">
          <span className="mr-3 text-4xl">⚙️</span> Account Settings
        </h2>
      </div>

      {success && (
        <div className="bg-green-900/50 border border-green-500 text-green-300 px-4 py-3 rounded-lg">
          {success}
        </div>
      )}
      {error && (
        <div className="bg-red-900/50 border border-red-500 text-red-300 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Profile Information */}
        <div className="bg-zinc-800/50 rounded-2xl p-8 border border-zinc-700">
          <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
            <span className="mr-3 text-3xl">👤</span> Profile Information
          </h3>

          <form onSubmit={handleProfileUpdate} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-zinc-700 border border-zinc-600 rounded-lg text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-zinc-700 border border-zinc-600 rounded-lg text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Address
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                rows="3"
                className="w-full px-4 py-3 bg-zinc-700 border border-zinc-600 rounded-lg text-white resize-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Avatar URL
              </label>
              <input
                type="url"
                name="avatar"
                value={formData.avatar}
                onChange={handleInputChange}
                placeholder="https://example.com/avatar.jpg"
                className="w-full px-4 py-3 bg-zinc-700 border border-zinc-600 rounded-lg text-white"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300"
            >
              {saving ? "Updating..." : "Update Profile"}
            </button>
          </form>
        </div>

        {/* Password Change */}
        <div className="bg-zinc-800/50 rounded-2xl p-8 border border-zinc-700">
          <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
            <span className="mr-3 text-3xl">🔒</span> Change Password
          </h3>

          <form onSubmit={handlePasswordChange} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Current Password
              </label>
              <input
                type="password"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-zinc-700 border border-zinc-600 rounded-lg text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                New Password
              </label>
              <input
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-zinc-700 border border-zinc-600 rounded-lg text-white"
                required
                minLength="6"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Confirm New Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-zinc-700 border border-zinc-600 rounded-lg text-white"
                required
                minLength="6"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300"
            >
              {saving ? "Changing..." : "Change Password"}
            </button>
          </form>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-red-900/20 rounded-2xl p-8 border border-red-500/30">
        <h3 className="text-2xl font-bold text-red-300 mb-6 flex items-center">
          <span className="mr-3 text-3xl">⚠️</span> Danger Zone
        </h3>
        <div className="flex items-center justify-between p-4 bg-red-900/30 rounded-lg border border-red-500/50">
          <div>
            <h4 className="text-lg font-semibold text-red-300">
              Delete Account
            </h4>
            <p className="text-red-400 text-sm">
              Permanently delete your account and all associated data
            </p>
          </div>
          <button
            onClick={handleDeleteAccount}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 flex items-center gap-2"
          >
            <span>🗑️</span> Delete Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default Setting;
