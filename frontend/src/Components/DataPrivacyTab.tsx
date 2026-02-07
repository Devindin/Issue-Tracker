import React from "react";
import {
  FaDatabase,
  FaExclamationTriangle,
  FaTrash,
} from "react-icons/fa";

interface DataPrivacyTabProps {
  setShowDeleteModal: (show: boolean) => void;
}

const DataPrivacyTab: React.FC<DataPrivacyTabProps> = ({
  setShowDeleteModal,
}) => {
  return (
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
  );
};

export default DataPrivacyTab;