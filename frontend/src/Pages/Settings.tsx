import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaUser,
  FaLock,
  FaBell,
  FaPalette,
  FaDatabase,
  FaCheck,
} from "react-icons/fa";
import PageLayout from "../Layout/PageLayout";
import PageTitle from "../Components/PageTitle";
import ProfileTab from "../Components/ProfileTab";
import SecurityTab from "../Components/SecurityTab";
import NotificationsTab from "../Components/NotificationsTab";
import PreferencesTab from "../Components/PreferencesTab";
import DataPrivacyTab from "../Components/DataPrivacyTab";
import DeleteAccountModal from "../Components/DeleteAccountModal";

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
                  onClick={() => setActiveTab(tab.id)}
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
                setProfile={setProfile}
                handleAvatarUpload={handleAvatarUpload}
                saveSettings={saveSettings}
              />
            )}

            {/* Security Tab */}
            {activeTab === "security" && (
              <SecurityTab
                security={security}
                setSecurity={setSecurity}
                saveSettings={saveSettings}
              />
            )}

            {/* Notifications Tab */}
            {activeTab === "notifications" && (
              <NotificationsTab
                notifications={notifications}
                setNotifications={setNotifications}
                saveSettings={saveSettings}
              />
            )}

            {/* Preferences Tab */}
            {activeTab === "preferences" && (
              <PreferencesTab
                preferences={preferences}
                setPreferences={setPreferences}
                saveSettings={saveSettings}
              />
            )}

            {/* Data & Privacy Tab */}
            {activeTab === "data" && (
              <DataPrivacyTab setShowDeleteModal={setShowDeleteModal} />
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