import React from "react";
import {
  FaBell,
  FaSave,
} from "react-icons/fa";
import { type NotificationSettings } from "../../types";

interface NotificationsTabProps {
  notifications: NotificationSettings;
  setNotifications: React.Dispatch<React.SetStateAction<NotificationSettings>>;
  saveSettings: () => void;
}

const NotificationsTab: React.FC<NotificationsTabProps> = ({
  notifications,
  setNotifications,
  saveSettings,
}) => {
  return (
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
  );
};

export default NotificationsTab;