import React, { useState } from "react";
import {
  FaLock,
  FaShieldAlt,
  FaSave,
} from "react-icons/fa";
import { type SecuritySettings } from "../types";
import { useChangePasswordMutation } from "../features/profile/profileApi";

interface SecurityTabProps {
  security: SecuritySettings;
  setSecurity: React.Dispatch<React.SetStateAction<SecuritySettings>>;
  saveSettings: () => void;
  onSuccess?: () => void;
}

const SecurityTab: React.FC<SecurityTabProps> = ({
  security,
  setSecurity,
  saveSettings,
  onSuccess,
}) => {
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({});
  const [changePassword, { isLoading, error }] = useChangePasswordMutation();

  const handlePasswordChange = (field: string, value: string) => {
    setPasswordData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (passwordErrors[field]) {
      setPasswordErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const updatePassword = async () => {
    const errors: Record<string, string> = {};

    if (!passwordData.currentPassword) {
      errors.currentPassword = "Current password is required";
    }
    if (!passwordData.newPassword) {
      errors.newPassword = "New password is required";
    } else if (passwordData.newPassword.length < 8) {
      errors.newPassword = "Password must be at least 8 characters";
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(errors).length > 0) {
      setPasswordErrors(errors);
      return;
    }

    try {
      await changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      }).unwrap();
      
      // Clear form on success
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setPasswordErrors({});
      
      // Trigger success message
      onSuccess?.();
    } catch (err: any) {
      console.error('Password change failed:', err);
      // Set error from API response
      if (err?.data?.message) {
        setPasswordErrors({ currentPassword: err.data.message });
      }
    }
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">
        Security Settings
      </h2>

      {/* API Error Message */}
      {error && (
        <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
          {(error as any)?.data?.message || "Failed to change password. Please try again."}
        </div>
      )}

      {/* Change Password */}
      <div className="border border-gray-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <FaLock className="text-indigo-600" />
          Change Password
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Current Password
            </label>
            <input
              type="password"
              value={passwordData.currentPassword}
              onChange={(e) =>
                handlePasswordChange("currentPassword", e.target.value)
              }
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 ${
                passwordErrors.currentPassword
                  ? "border-red-300 focus:ring-red-500"
                  : "border-gray-300 focus:ring-indigo-500"
              }`}
            />
            {passwordErrors.currentPassword && (
              <p className="text-red-500 text-sm mt-1">
                {passwordErrors.currentPassword}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              New Password
            </label>
            <input
              type="password"
              value={passwordData.newPassword}
              onChange={(e) =>
                handlePasswordChange("newPassword", e.target.value)
              }
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 ${
                passwordErrors.newPassword
                  ? "border-red-300 focus:ring-red-500"
                  : "border-gray-300 focus:ring-indigo-500"
              }`}
            />
            {passwordErrors.newPassword && (
              <p className="text-red-500 text-sm mt-1">
                {passwordErrors.newPassword}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Confirm New Password
            </label>
            <input
              type="password"
              value={passwordData.confirmPassword}
              onChange={(e) =>
                handlePasswordChange("confirmPassword", e.target.value)
              }
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 ${
                passwordErrors.confirmPassword
                  ? "border-red-300 focus:ring-red-500"
                  : "border-gray-300 focus:ring-indigo-500"
              }`}
            />
            {passwordErrors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {passwordErrors.confirmPassword}
              </p>
            )}
          </div>

          <button
            onClick={updatePassword}
            disabled={isLoading}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            <FaSave /> {isLoading ? "Updating..." : "Update Password"}
          </button>
        </div>
      </div>

      {/* Two-Factor Authentication */}
      <div className="border border-gray-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <FaShieldAlt className="text-indigo-600" />
          Two-Factor Authentication
        </h3>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-700 font-medium">
              Enable Two-Factor Authentication
            </p>
            <p className="text-gray-600 text-sm">
              Add an extra layer of security to your account
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={security.twoFactorAuth}
              onChange={(e) =>
                setSecurity((prev) => ({
                  ...prev,
                  twoFactorAuth: e.target.checked,
                }))
              }
              className="sr-only peer"
            />
            <div className="w-14 h-8 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-indigo-600"></div>
          </label>
        </div>
      </div>

      {/* Session Timeout */}
      <div className="border border-gray-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Session Timeout
        </h3>
        <div className="flex items-center gap-4">
          <input
            type="number"
            value={security.sessionTimeout}
            onChange={(e) =>
              setSecurity((prev) => ({
                ...prev,
                sessionTimeout: parseInt(e.target.value) || 30,
              }))
            }
            min="5"
            max="120"
            className="w-24 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <span className="text-gray-700">minutes of inactivity</span>
        </div>
      </div>

      {/* Login Alerts */}
      <div className="border border-gray-200 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-700 font-medium">Login Alerts</p>
            <p className="text-gray-600 text-sm">
              Get notified when someone logs into your account
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={security.loginAlerts}
              onChange={(e) =>
                setSecurity((prev) => ({
                  ...prev,
                  loginAlerts: e.target.checked,
                }))
              }
              className="sr-only peer"
            />
            <div className="w-14 h-8 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-indigo-600"></div>
          </label>
        </div>
      </div>

      <button
        onClick={saveSettings}
        className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
      >
        <FaSave /> Save Security Settings
      </button>
    </div>
  );
};

export default SecurityTab;