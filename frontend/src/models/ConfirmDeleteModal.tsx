import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTrash, FaTimes, FaSpinner } from "react-icons/fa";

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;

  title?: string;
  message?: string;

  itemName?: string;          // "John Doe" / "Project A"
  entityName?: string;        // "User" / "Project" / "Account"
  confirmText?: string;

  isLoading?: boolean;        // For API deleting state
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  itemName,
  entityName = "Item",
  confirmText,
  isLoading = false,
}) => {
  const defaultTitle = `Delete ${entityName}`;
  const defaultMessage = itemName
    ? `Are you sure you want to delete ${entityName.toLowerCase()} "${itemName}"? This action cannot be undone.`
    : `Are you sure you want to delete this ${entityName.toLowerCase()}? This action cannot be undone.`;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
          onClick={!isLoading ? onClose : undefined}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", duration: 0.3 }}
            className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-14 w-14 rounded-full bg-red-100 mb-4">
                <FaTrash className="h-7 w-7 text-red-600" />
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {title || defaultTitle}
              </h3>

              <p className="text-sm text-gray-600 mb-6">
                {message || defaultMessage}
              </p>

              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  disabled={isLoading}
                  className="flex-1 px-4 py-2.5 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  onClick={onConfirm}
                  disabled={isLoading}
                  className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors shadow-lg shadow-red-200 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    confirmText || `Delete ${entityName}`
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmDeleteModal;
