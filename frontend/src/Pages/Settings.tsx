import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../app/stores";
import { FaUser, FaLock, FaBell, FaCheck, FaShieldAlt } from "react-icons/fa";
import PageLayout from "../Layout/PageLayout";
import PageTitle from "../Components/PageTitle";
import ProfileTab from "../Components/Tabs/ProfileTab";
import SecurityTab from "../Components/Tabs/SecurityTab";
import UserManagementTab from "../Components/Tabs/UserManagementTab";
import ConfirmDeleteModal from "../models/ConfirmDeleteModal";
import { useGetProfileQuery } from "../features/profile/profileApi";
import { setActiveTab } from "../features/settings/settingsSlice";
import type { SecuritySettings } from "../types";

const Settings: React.FC = () => {
  const dispatch = useDispatch();
  const [showDeleteModal, setShowDeleteModal] = React.useState<boolean>(false);
  const [showSuccessMessage, setShowSuccessMessage] =
    React.useState<boolean>(false);

  // Security settings state
  const [security, setSecurity] = React.useState<SecuritySettings>({
    twoFactorAuth: false,
    sessionTimeout: 30,
    loginAlerts: true,
  });

  // Get active tab from Redux
  const { activeTab } = useSelector((state: RootState) => state.settings);

  // Fetch profile from API
  const {
    data: profile,
    isLoading: profileLoading,
    error: profileError,
  } = useGetProfileQuery();

  // Delete account
  const deleteAccount = () => {
    localStorage.clear();
    sessionStorage.clear();
    setShowDeleteModal(false);
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

        {/* Loading State */}
        {profileLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        )}

        {/* Error State */}
        {profileError && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="text-red-800">
              Failed to load profile. Please try again.
            </p>
          </div>
        )}

        {/* Content */}
        {!profileLoading && profile && (
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
                  onSuccess={() => {
                    setShowSuccessMessage(true);
                    setTimeout(() => setShowSuccessMessage(false), 3000);
                  }}
                />
              )}

              {/* Security Tab */}
              {activeTab === "security" && (
                <SecurityTab
                  security={security}
                  setSecurity={setSecurity}
                  saveSettings={() => {
                    // Save security settings to localStorage or API
                    localStorage.setItem(
                      "securitySettings",
                      JSON.stringify(security),
                    );
                  }}
                  onSuccess={() => {
                    setShowSuccessMessage(true);
                    setTimeout(() => setShowSuccessMessage(false), 3000);
                  }}
                />
              )}

              {/* Notifications Tab */}
              {/* {activeTab === "notifications" && (
                <NotificationsTab
                  notifications={notifications}
                  setNotifications={(updates: Partial<NotificationSettings>) => dispatch(setNotifications(updates))}
                  saveSettings={saveSettings}
                />
              )} */}

              {/* User Management Tab */}
              {activeTab === "users" && <UserManagementTab />}
            </motion.div>
          </div>
        )}

        {/* Delete Account Modal */}
        <ConfirmDeleteModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={deleteAccount}
          entityName="Account"
          title="Delete Account"
          message="Are you sure you want to permanently delete your account? This action cannot be undone."
          confirmText="Delete Account"
        />
      </div>
    </PageLayout>
  );
};

export default Settings;
