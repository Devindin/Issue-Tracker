import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../app/stores";
import {
  FaUser,
  FaLock,
  FaBell,
  FaPalette,
  FaDatabase,
  FaCheck,
  FaShieldAlt,
} from "react-icons/fa";
import PageLayout from "../Layout/PageLayout";
import PageTitle from "../Components/PageTitle";
import ProfileTab from "../Components/ProfileTab";
import SecurityTab from "../Components/SecurityTab";
import NotificationsTab from "../Components/NotificationsTab";
import UserManagementTab from "../Components/UserManagementTab";
import DeleteAccountModal from "../Components/DeleteAccountModal";
import { type UserProfile, type NotificationSettings, type SecuritySettings, type PreferenceSettings } from "../types";
import {
  setProfile,
  setNotifications,
  setSecurity,
  setPreferences,
  setActiveTab,
  setShowSuccessMessage,
  loadSettingsFromStorage,
} from "../features/settings/settingsSlice";

const Settings: React.FC = () => {
  const dispatch = useDispatch();
  const [showDeleteModal, setShowDeleteModal] = React.useState<boolean>(false);
  
  // Get state from Redux
  const { profile, notifications, security, preferences, activeTab, showSuccessMessage } = useSelector(
    (state: RootState) => state.settings
  );

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem("userSettings");
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      dispatch(loadSettingsFromStorage(parsed));
    }
  }, [dispatch]);

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

    dispatch(setShowSuccessMessage(true));
    setTimeout(() => dispatch(setShowSuccessMessage(false)), 3000);
  };

  // Handle avatar upload
  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        dispatch(setProfile({ avatar: reader.result as string }));
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
    { id: "users", label: "User Management", icon: <FaShieldAlt /> },
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

        <div className="space-y-6">
          {/* Horizontal Tabs */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white rounded-2xl shadow-md p-2"
          >
            <div className="flex flex-wrap gap-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => dispatch(setActiveTab(tab.id))}
                  className={`flex items-center gap-3 px-6 py-3 rounded-xl transition-all font-medium ${
                    activeTab === tab.id
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200"
                      : "text-gray-700 hover:bg-gray-100 hover:text-indigo-600"
                  }`}
                >
                  <span className="text-lg">{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Content Area */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-2xl shadow-md p-6"
          >
            {/* Profile Tab */}
            {activeTab === "profile" && (
              <ProfileTab
                profile={profile}
                setProfile={(updates: Partial<UserProfile>) => dispatch(setProfile(updates))}
                handleAvatarUpload={handleAvatarUpload}
                saveSettings={saveSettings}
              />
            )}

            {/* Security Tab */}
            {activeTab === "security" && (
              <SecurityTab
                security={security}
                setSecurity={(updates: Partial<SecuritySettings>) => dispatch(setSecurity(updates))}
                saveSettings={saveSettings}
              />
            )}

            {/* Notifications Tab */}
            {activeTab === "notifications" && (
              <NotificationsTab
                notifications={notifications}
                setNotifications={(updates: Partial<NotificationSettings>) => dispatch(setNotifications(updates))}
                saveSettings={saveSettings}
              />
            )}

            {/* User Management Tab */}
            {activeTab === "users" && (
              <UserManagementTab saveSettings={saveSettings} />
            )}

          </motion.div>
        </div>

        {/* Delete Account Modal */}
        <DeleteAccountModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={deleteAccount}
        />
      </div>
    </PageLayout>
  );
};

export default Settings;