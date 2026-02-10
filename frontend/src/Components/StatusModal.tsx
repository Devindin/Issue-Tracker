import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaCheckCircle, FaExclamationCircle, FaTimes } from "react-icons/fa";

interface StatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "success" | "error";
  title: string;
  message: string;
  primaryAction?: {
    label: string;
    to?: string;
    onClick?: () => void;
  };
  secondaryAction?: {
    label: string;
    to?: string;
    onClick?: () => void;
  };
  tertiaryAction?: {
    label: string;
    onClick: () => void;
  };
}

const StatusModal: React.FC<StatusModalProps> = ({
  isOpen,
  onClose,
  type,
  title,
  message,
  primaryAction,
  secondaryAction,
  tertiaryAction,
}) => {
  if (!isOpen) return null;

  const isSuccess = type === "success";
  const Icon = isSuccess ? FaCheckCircle : FaExclamationCircle;
  const iconBgColor = isSuccess ? "bg-green-100" : "bg-red-100";
  const iconColor = isSuccess ? "text-green-600" : "text-red-600";
  const primaryBtnColor = isSuccess
    ? "bg-indigo-600 hover:bg-indigo-700"
    : "bg-red-600 hover:bg-red-700";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: "spring", duration: 0.5 }}
        className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close"
        >
          <FaTimes className="w-5 h-5" />
        </button>

        <div className="text-center">
          {/* Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 15,
              delay: 0.2,
            }}
            className={`mx-auto flex items-center justify-center h-16 w-16 rounded-full ${iconBgColor} mb-4`}
          >
            <Icon className={`h-10 w-10 ${iconColor}`} />
          </motion.div>

          {/* Title */}
          <motion.h3
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-2xl font-bold text-gray-900 mb-2"
          >
            {title}
          </motion.h3>

          {/* Message */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-gray-600 mb-6"
            dangerouslySetInnerHTML={{ __html: message }}
          />

          {/* Action Buttons */}
          {(primaryAction || secondaryAction) && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-3"
            >
              {primaryAction && (
                <>
                  {primaryAction.to ? (
                    <Link to={primaryAction.to} className="flex-1">
                      <button
                        className={`w-full px-4 py-3 text-sm font-semibold text-white ${primaryBtnColor} rounded-xl transition-colors shadow-lg ${
                          isSuccess ? "shadow-indigo-200" : "shadow-red-200"
                        }`}
                      >
                        {primaryAction.label}
                      </button>
                    </Link>
                  ) : (
                    <button
                      onClick={primaryAction.onClick}
                      className={`flex-1 px-4 py-3 text-sm font-semibold text-white ${primaryBtnColor} rounded-xl transition-colors shadow-lg ${
                        isSuccess ? "shadow-indigo-200" : "shadow-red-200"
                      }`}
                    >
                      {primaryAction.label}
                    </button>
                  )}
                </>
              )}

              {secondaryAction && (
                <>
                  {secondaryAction.to ? (
                    <Link to={secondaryAction.to} className="flex-1">
                      <button className="w-full px-4 py-3 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">
                        {secondaryAction.label}
                      </button>
                    </Link>
                  ) : (
                    <button
                      onClick={secondaryAction.onClick}
                      className="flex-1 px-4 py-3 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                    >
                      {secondaryAction.label}
                    </button>
                  )}
                </>
              )}
            </motion.div>
          )}

          {/* Tertiary Action */}
          {tertiaryAction && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              onClick={tertiaryAction.onClick}
              className={`mt-4 text-sm font-medium ${
                isSuccess
                  ? "text-indigo-600 hover:text-indigo-700"
                  : "text-red-600 hover:text-red-700"
              }`}
            >
              {tertiaryAction.label}
            </motion.button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default StatusModal;
