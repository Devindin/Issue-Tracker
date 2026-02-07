import React from "react";
import {
  FaSave,
} from "react-icons/fa";

interface PreferenceSettings {
  language: string;
  timezone: string;
  dateFormat: string;
  itemsPerPage: number;
  defaultView: string;
}

interface PreferencesTabProps {
  preferences: PreferenceSettings;
  setPreferences: React.Dispatch<React.SetStateAction<PreferenceSettings>>;
  saveSettings: () => void;
}

const PreferencesTab: React.FC<PreferencesTabProps> = ({
  preferences,
  setPreferences,
  saveSettings,
}) => {
  return (
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
  );
};

export default PreferencesTab;