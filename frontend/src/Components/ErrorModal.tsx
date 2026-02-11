import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaExclamationTriangle, FaTimes } from "react-icons/fa";

interface ErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message: string;
}

const ErrorModal: React.FC<ErrorModalProps> = ({
  isOpen,
  onClose,
  title = "Something went wrong",
  message,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 relative"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <FaTimes />
            </button>

            {/* Icon */}
            <div className="flex items-center justify-center w-16 h-16 mx-auto rounded-full bg-red-100 text-red-600 mb-4">
              <FaExclamationTriangle size={28} />
            </div>

            {/* Content */}
            <h3 className="text-lg font-semibold text-gray-800 text-center">
              {title}
            </h3>

            <p
              className="text-sm text-gray-600 text-center mt-2"
              dangerouslySetInnerHTML={{ __html: message }}
            />

            {/* Action */}
            <button
              onClick={onClose}
              className="mt-6 w-full bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-xl font-semibold transition"
            >
              Close
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ErrorModal;
