import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaUser,
  FaLock,
  FaBell,
  FaPalette,
  FaDatabase,
  FaShieldAlt,
  FaSave,
  FaCheck,
  FaEdit,
  FaTimes,
  FaCamera,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaGlobe,
  FaTrash,
  FaExclamationTriangle,
} from "react-icons/fa";
import PageLayout from "../Layout/PageLayout";
import PageTitle from "../Components/PageTitle";

// Types
interface UserProfile {
  name: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  bio: string;
  avatar: string;
}

interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  issueCreated: boolean;
  issueUpdated: boolean;
  issueResolved: boolean;
  issueAssigned: boolean;
  weeklyReport: boolean;
}

interface SecuritySettings {
  twoFactorAuth: boolean;
  sessionTimeout: number;
  loginAlerts: boolean;
}

interface PreferenceSettings {
  language: string;
  timezone: string;
  dateFormat: string;
  itemsPerPage: number;
  defaultView: string;
}

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("profile");
  const [showSuccessMessage, setShowSuccessMessage] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);

  // Profile State
  const [profile, setProfile] = useState<UserProfile>({
    name: "Devindi Karunathilaka",
    email: "devindi@example.com",
    phone: "+1 234 567 8900",
    location: "San Francisco, CA",
    website: "https://example.com",
    bio: "Passionate developer working on issue tracking systems.",
    avatar: "",
  });
  const [isEditingProfile, setIsEditingProfile] = useState<boolean>(false);

  // Password State
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({});

  // Notification State
  const [notifications, setNotifications] = useState<NotificationSettings>({
    emailNotifications: true,
    pushNotifications: false,
    issueCreated: true,
    issueUpdated: true,
    issueResolved: true,
    issueAssigned: true,
    weeklyReport: false,
  });

  // Security State
  const [security, setSecurity] = useState<SecuritySettings>({
    twoFactorAuth: false,
    sessionTimeout: 30,
    loginAlerts: true,
  });

  // Preferences State
  const [preferences, setPreferences] = useState<PreferenceSettings>({
    language: "en",
    timezone: "America/Los_Angeles",
    dateFormat: "MM/DD/YYYY",
    itemsPerPage: 12,
    defaultView: "list",
  });

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem("userSettings");
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      setProfile(parsed.profile || profile);
      setNotifications(parsed.notifications || notifications);
      setSecurity(parsed.security || security);
      setPreferences(parsed.preferences || preferences);
    }
  }, []);

  // Save settings
  const saveSettings = () => {
    const settings = {
      profile,
      notifications,
      security,
      preferences,
    };
    localStorage.setItem("userSettings", JSON.stringify(settings));
    
    // Update user in localStorage for other components
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    user.name = profile.name;
    localStorage.setItem("user", JSON.stringify(user));

    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000);
  };

  // Handle profile change
  const handleProfileChange = (field: keyof UserProfile, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  // Handle password change
  const handlePasswordChange = (field: string, value: string) => {
    setPasswordData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (passwordErrors[field]) {
      setPasswordErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  // Validate and update password
  const updatePassword = () => {
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

    // TODO: API call to update password
    alert("Password updated successfully!");
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setPasswordErrors({});
  };

  // Handle avatar upload
  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile((prev) => ({ ...prev, avatar: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Delete account
  const deleteAccount = () => {
    // TODO: API call to delete account
    localStorage.clear();
    window.location.href = "/login";
  };

  // Tabs configuration
  const tabs = [
    { id: "profile", label: "Profile", icon: <FaUser /> },
    { id: "security", label: "Security", icon: <FaLock /> },
    { id: "notifications", label: "Notifications", icon: <FaBell /> },
    { id: "preferences", label: "Preferences", icon: <FaPalette /> },
    { id: "data", label: "Data & Privacy", icon: <FaDatabase /> },
  ];

  return (
    <PageLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <PageTitle
            title="Settings"
            subtitle="Manage your account settings and preferences"
            textColor="text-white"
          />
        </motion.div>

        {/* Success Message */}
        <AnimatePresence>
          {showSuccessMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3"
            >
              <div className="bg-green-500 rounded-full p-1">
                <FaCheck className="text-white text-sm" />
              </div>
              <p className="text-green-800 font-medium">
                Settings saved successfully!
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Tabs */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-2xl shadow-md p-2 space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    activeTab === tab.id
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <span className="text-lg">{tab.icon}</span>
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Content Area */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-3"
          >
            <div className="bg-white rounded-2xl shadow-md p-6">
              {/* Profile Tab */}
              {activeTab === "profile" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-800">
                      Profile Information
                    </h2>
                    <button
                      onClick={() => setIsEditingProfile(!isEditingProfile)}
                      className="flex items-center gap-2 px-4 py-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                    >
                      {isEditingProfile ? (
                        <>
                          <FaTimes /> Cancel
                        </>
                      ) : (
                        <>
                          <FaEdit /> Edit
                        </>
                      )}
                    </button>
                  </div>

                  {/* Avatar */}
                  <div className="flex items-center gap-6">
                    <div className="relative">
                      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold overflow-hidden">
                        {profile.avatar ? (
                          <img
                            src={profile.avatar}
                            alt="Avatar"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          profile.name.charAt(0).toUpperCase()
                        )}
                      </div>
                      {isEditingProfile && (
                        <label
                          htmlFor="avatar-upload"
                          className="absolute bottom-0 right-0 bg-indigo-600 text-white p-2 rounded-full cursor-pointer hover:bg-indigo-700 transition-colors"
                        >
                          <FaCamera />
                          <input
                            id="avatar-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarUpload}
                            className="hidden"
                          />
                        </label>
                      )}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800">
                        {profile.name}
                      </h3>
                      <p className="text-gray-600">{profile.email}</p>
                    </div>
                  </div>

                  {/* Profile Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={profile.name}
                        onChange={(e) =>
                          handleProfileChange("name", e.target.value)
                        }
                        disabled={!isEditingProfile}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-50 disabled:text-gray-600"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <FaEnvelope className="inline mr-2" />
                        Email
                      </label>
                      <input
                        type="email"
                        value={profile.email}
                        onChange={(e) =>
                          handleProfileChange("email", e.target.value)
                        }
                        disabled={!isEditingProfile}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-50 disabled:text-gray-600"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <FaPhone className="inline mr-2" />
                        Phone
                      </label>
                      <input
                        type="tel"
                        value={profile.phone}
                        onChange={(e) =>
                          handleProfileChange("phone", e.target.value)
                        }
                        disabled={!isEditingProfile}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-50 disabled:text-gray-600"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <FaMapMarkerAlt className="inline mr-2" />
                        Location
                      </label>
                      <input
                        type="text"
                        value={profile.location}
                        onChange={(e) =>
                          handleProfileChange("location", e.target.value)
                        }
                        disabled={!isEditingProfile}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-50 disabled:text-gray-600"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <FaGlobe className="inline mr-2" />
                        Website
                      </label>
                      <input
                        type="url"
                        value={profile.website}
                        onChange={(e) =>
                          handleProfileChange("website", e.target.value)
                        }
                        disabled={!isEditingProfile}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-50 disabled:text-gray-600"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Bio
                      </label>
                      <textarea
                        value={profile.bio}
                        onChange={(e) =>
                          handleProfileChange("bio", e.target.value)
                        }
                        disabled={!isEditingProfile}
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-50 disabled:text-gray-600 resize-none"
                      />
                    </div>
                  </div>

                  {isEditingProfile && (
                    <div className="flex gap-3 pt-4 border-t">
                      <button
                        onClick={() => {
                          saveSettings();
                          setIsEditingProfile(false);
                        }}
                        className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
                      >
                        <FaSave /> Save Changes
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Security Tab */}
              {activeTab === "security" && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-800">
                    Security Settings
                  </h2>

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
                        className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
                      >
                        <FaSave /> Update Password
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
              )}

              {/* Notifications Tab */}
              {activeTab === "notifications" && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-800">
                    Notification Preferences
                  </h2>

                  {/* Email Notifications */}
                  <div className="border border-gray-200 rounded-xl p-6 space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                      <FaBell className="text-indigo-600" />
                      General Notifications
                    </h3>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between py-3 border-b border-gray-100">
                        <div>
                          <p className="text-gray-700 font-medium">
                            Email Notifications
                          </p>
                          <p className="text-gray-600 text-sm">
                            Receive notifications via email
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={notifications.emailNotifications}
                            onChange={(e) =>
                              setNotifications((prev) => ({
                                ...prev,
                                emailNotifications: e.target.checked,
                              }))
                            }
                            className="sr-only peer"
                          />
                          <div className="w-14 h-8 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-indigo-600"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between py-3 border-b border-gray-100">
                        <div>
                          <p className="text-gray-700 font-medium">
                            Push Notifications
                          </p>
                          <p className="text-gray-600 text-sm">
                            Receive push notifications in your browser
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={notifications.pushNotifications}
                            onChange={(e) =>
                              setNotifications((prev) => ({
                                ...prev,
                                pushNotifications: e.target.checked,
                              }))
                            }
                            className="sr-only peer"
                          />
                          <div className="w-14 h-8 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-indigo-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Issue Notifications */}
                  <div className="border border-gray-200 rounded-xl p-6 space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800">
                      Issue Notifications
                    </h3>

                    <div className="space-y-3">
                      {[
                        {
                          key: "issueCreated",
                          label: "Issue Created",
                          desc: "When a new issue is created",
                        },
                        {
                          key: "issueUpdated",
                          label: "Issue Updated",
                          desc: "When an issue is updated",
                        },
                        {
                          key: "issueResolved",
                          label: "Issue Resolved",
                          desc: "When an issue is resolved",
                        },
                        {
                          key: "issueAssigned",
                          label: "Issue Assigned",
                          desc: "When an issue is assigned to you",
                        },
                      ].map((item) => (
                        <div
                          key={item.key}
                          className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0"
                        >
                          <div>
                            <p className="text-gray-700 font-medium">
                              {item.label}
                            </p>
                            <p className="text-gray-600 text-sm">{item.desc}</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={
                                notifications[
                                  item.key as keyof NotificationSettings
                                ] as boolean
                              }
                              onChange={(e) =>
                                setNotifications((prev) => ({
                                  ...prev,
                                  [item.key]: e.target.checked,
                                }))
                              }
                              className="sr-only peer"
                            />
                            <div className="w-14 h-8 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-indigo-600"></div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Reports */}
                  <div className="border border-gray-200 rounded-xl p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-700 font-medium">
                          Weekly Report
                        </p>
                        <p className="text-gray-600 text-sm">
                          Receive a weekly summary of your issues
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notifications.weeklyReport}
                          onChange={(e) =>
                            setNotifications((prev) => ({
                              ...prev,
                              weeklyReport: e.target.checked,
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
                    <FaSave /> Save Notification Settings
                  </button>
                </div>
              )}

              {/* Preferences Tab */}
              {activeTab === "preferences" && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-800">
                    Application Preferences
                  </h2>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Language
                      </label>
                      <select
                        value={preferences.language}
                        onChange={(e) =>
                          setPreferences((prev) => ({
                            ...prev,
                            language: e.target.value,
                          }))
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="en">English</option>
                        <option value="es">Spanish</option>
                        <option value="fr">French</option>
                        <option value="de">German</option>
                        <option value="ja">Japanese</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Timezone
                      </label>
                      <select
                        value={preferences.timezone}
                        onChange={(e) =>
                          setPreferences((prev) => ({
                            ...prev,
                            timezone: e.target.value,
                          }))
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="America/Los_Angeles">Pacific Time (PT)</option>
                        <option value="America/Denver">Mountain Time (MT)</option>
                        <option value="America/Chicago">Central Time (CT)</option>
                        <option value="America/New_York">Eastern Time (ET)</option>
                        <option value="Europe/London">London (GMT)</option>
                        <option value="Europe/Paris">Paris (CET)</option>
                        <option value="Asia/Tokyo">Tokyo (JST)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Date Format
                      </label>
                      <select
                        value={preferences.dateFormat}
                        onChange={(e) =>
                          setPreferences((prev) => ({
                            ...prev,
                            dateFormat: e.target.value,
                          }))
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                        <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                        <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Items Per Page
                      </label>
                      <select
                        value={preferences.itemsPerPage}
                        onChange={(e) =>
                          setPreferences((prev) => ({
                            ...prev,
                            itemsPerPage: parseInt(e.target.value),
                          }))
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="6">6</option>
                        <option value="12">12</option>
                        <option value="24">24</option>
                        <option value="50">50</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Default View
                      </label>
                      <select
                        value={preferences.defaultView}
                        onChange={(e) =>
                          setPreferences((prev) => ({
                            ...prev,
                            defaultView: e.target.value,
                          }))
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="list">List View</option>
                        <option value="grid">Grid View</option>
                      </select>
                    </div>
                  </div>

                  <button
                    onClick={saveSettings}
                    className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
                  >
                    <FaSave /> Save Preferences
                  </button>
                </div>
              )}

              {/* Data & Privacy Tab */}
              {activeTab === "data" && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-800">
                    Data & Privacy
                  </h2>

                  {/* Export Data */}
                  <div className="border border-gray-200 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center gap-2">
                      <FaDatabase className="text-indigo-600" />
                      Export Your Data
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      Download a copy of your data including profile information
                      and all your issues.
                    </p>
                    <button className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors">
                      Download Data
                    </button>
                  </div>

                  {/* Delete Account */}
                  <div className="border border-red-200 rounded-xl p-6 bg-red-50">
                    <h3 className="text-lg font-semibold text-red-800 mb-2 flex items-center gap-2">
                      <FaExclamationTriangle />
                      Danger Zone
                    </h3>
                    <p className="text-red-700 text-sm mb-4">
                      Once you delete your account, there is no going back.
                      Please be certain.
                    </p>
                    <button
                      onClick={() => setShowDeleteModal(true)}
                      className="px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors flex items-center gap-2"
                    >
                      <FaTrash /> Delete Account
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Delete Account Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
            onClick={() => setShowDeleteModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", duration: 0.3 }}
              className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-14 w-14 rounded-full bg-red-100 mb-4">
                  <FaExclamationTriangle className="h-7 w-7 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Delete Account
                </h3>
                <p className="text-sm text-gray-600 mb-6">
                  Are you sure you want to delete your account? This action
                  cannot be undone and all your data will be permanently removed.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="flex-1 px-4 py-2.5 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={deleteAccount}
                    className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors shadow-lg shadow-red-200"
                  >
                    Delete Account
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageLayout>
  );
};

export default Settings;