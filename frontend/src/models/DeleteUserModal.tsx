import React from "react";
import { FaExclamationTriangle, FaTimes, FaSpinner } from "react-icons/fa";

interface DeleteUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  userName: string;
  isDeleting?: boolean;
}

const DeleteUserModal: React.FC<DeleteUserModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  userName,
  isDeleting = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <FaExclamationTriangle className="text-red-600" />
            Delete User
          </h3>
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
          >
            <FaTimes />
          </button>
        </div>

        <p className="text-gray-600 text-sm mb-2">
          Are you sure you want to delete the user:
        </p>
        <p className="font-semibold text-gray-800 mb-4">
          {userName}
        </p>
        <p className="text-gray-600 text-sm mb-6">
          This action cannot be undone. All data associated with this user,
          including assigned issues and activity history, will be permanently removed.
        </p>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isDeleting ? (
              <>
                <FaSpinner className="animate-spin" />
                Deleting...
              </>
            ) : (
              'Delete User'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteUserModal;
