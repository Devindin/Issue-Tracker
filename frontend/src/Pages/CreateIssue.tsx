import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import {
  FaSave,
  FaTimes,
  FaExclamationTriangle,
  FaCheckCircle,
  FaInfoCircle,
} from "react-icons/fa";
import PageLayout from "../Layout/PageLayout";

// Types
interface IssueFormData {
  title: string;
  description: string;
  status: "Open" | "In Progress" | "Resolved" | "Closed";
  priority: "Low" | "Medium" | "High" | "Critical";
  severity: "Minor" | "Major" | "Critical";
}

interface FormErrors {
  title?: string;
  description?: string;
}

const CreateIssue: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const [createdIssueId, setCreatedIssueId] = useState<number | null>(null);

  const [formData, setFormData] = useState<IssueFormData>({
    title: "",
    description: "",
    status: "Open",
    priority: "Medium",
    severity: "Minor",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Character count limits
  const TITLE_MAX_LENGTH = 100;
  const DESCRIPTION_MAX_LENGTH = 1000;

  // Handle input change
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  // Handle blur (for validation)
  const handleBlur = (field: string) => {
    setTouched((prev) => ({
      ...prev,
      [field]: true,
    }));
    validateField(field);
  };

  // Validate individual field
  const validateField = (field: string) => {
    const newErrors: FormErrors = { ...errors };

    if (field === "title") {
      if (!formData.title.trim()) {
        newErrors.title = "Title is required";
      } else if (formData.title.length > TITLE_MAX_LENGTH) {
        newErrors.title = `Title must be less than ${TITLE_MAX_LENGTH} characters`;
      } else {
        delete newErrors.title;
      }
    }

    if (field === "description") {
      if (!formData.description.trim()) {
        newErrors.description = "Description is required";
      } else if (formData.description.length < 10) {
        newErrors.description = "Description must be at least 10 characters";
      } else if (formData.description.length > DESCRIPTION_MAX_LENGTH) {
        newErrors.description = `Description must be less than ${DESCRIPTION_MAX_LENGTH} characters`;
      } else {
        delete newErrors.description;
      }
    }

    setErrors(newErrors);
  };

  // Validate entire form
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    } else if (formData.title.length > TITLE_MAX_LENGTH) {
      newErrors.title = `Title must be less than ${TITLE_MAX_LENGTH} characters`;
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.length < 10) {
      newErrors.description = "Description must be at least 10 characters";
    } else if (formData.description.length > DESCRIPTION_MAX_LENGTH) {
      newErrors.description = `Description must be less than ${DESCRIPTION_MAX_LENGTH} characters`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all fields as touched
    setTouched({
      title: true,
      description: true,
    });

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      // TODO: Replace with actual API call
      const response = await fetch("/api/issues", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({
          ...formData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }),
      });

      const data = await response.json();

      // Mock success for development
      const mockIssueId = Math.floor(Math.random() * 1000) + 100;
      setCreatedIssueId(mockIssueId);
      setShowSuccessModal(true);

      // Reset form
      setFormData({
        title: "",
        description: "",
        status: "Open",
        priority: "Medium",
        severity: "Minor",
      });
      setTouched({});
    } catch (error) {
      console.error("Error creating issue:", error);
      alert("Failed to create issue. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Get priority color classes
  const getPriorityColor = (priority: string) => {
    const colors = {
      Low: "bg-gray-100 border-gray-300 text-gray-700",
      Medium: "bg-orange-100 border-orange-300 text-orange-700",
      High: "bg-red-100 border-red-300 text-red-700",
      Critical: "bg-purple-100 border-purple-300 text-purple-700",
    };
    return colors[priority as keyof typeof colors];
  };

  const getSeverityColor = (severity: string) => {
    const colors = {
      Minor: "bg-blue-100 border-blue-300 text-blue-700",
      Major: "bg-yellow-100 border-yellow-300 text-yellow-700",
      Critical: "bg-red-100 border-red-300 text-red-700",
    };
    return colors[severity as keyof typeof colors];
  };

  const getStatusColor = (status: string) => {
    const colors = {
      Open: "bg-blue-100 border-blue-300 text-blue-700",
      "In Progress": "bg-yellow-100 border-yellow-300 text-yellow-700",
      Resolved: "bg-green-100 border-green-300 text-green-700",
      Closed: "bg-gray-100 border-gray-300 text-gray-700",
    };
    return colors[status as keyof typeof colors];
  };

  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <Link
              to="/issues"
              className="text-indigo-600 hover:text-indigo-700 transition-colors"
            >
              ← Back to Issues
            </Link>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
            Create New Issue
          </h1>
          <p className="text-gray-600 mt-1">
            Fill in the details below to report a new issue
          </p>
        </motion.div>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          {/* Main Information Card */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
              <FaInfoCircle className="text-indigo-600" />
              Basic Information
            </h2>

            {/* Title */}
            <div className="mb-6">
              <label
                htmlFor="title"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Issue Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                onBlur={() => handleBlur("title")}
                maxLength={TITLE_MAX_LENGTH}
                placeholder="e.g., Login page not responsive on mobile devices"
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                  errors.title && touched.title
                    ? "border-red-300 focus:ring-red-500"
                    : "border-gray-300 focus:ring-indigo-500"
                }`}
              />
              <div className="flex justify-between items-center mt-2">
                <div>
                  {errors.title && touched.title && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-sm flex items-center gap-1"
                    >
                      <FaExclamationTriangle className="text-xs" />
                      {errors.title}
                    </motion.p>
                  )}
                </div>
                <span
                  className={`text-xs ${
                    formData.title.length > TITLE_MAX_LENGTH * 0.9
                      ? "text-red-500"
                      : "text-gray-500"
                  }`}
                >
                  {formData.title.length}/{TITLE_MAX_LENGTH}
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <label
                htmlFor="description"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                onBlur={() => handleBlur("description")}
                maxLength={DESCRIPTION_MAX_LENGTH}
                rows={6}
                placeholder="Provide a detailed description of the issue, including steps to reproduce, expected behavior, and actual behavior..."
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all resize-none ${
                  errors.description && touched.description
                    ? "border-red-300 focus:ring-red-500"
                    : "border-gray-300 focus:ring-indigo-500"
                }`}
              />
              <div className="flex justify-between items-center mt-2">
                <div>
                  {errors.description && touched.description && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-sm flex items-center gap-1"
                    >
                      <FaExclamationTriangle className="text-xs" />
                      {errors.description}
                    </motion.p>
                  )}
                </div>
                <span
                  className={`text-xs ${
                    formData.description.length > DESCRIPTION_MAX_LENGTH * 0.9
                      ? "text-red-500"
                      : "text-gray-500"
                  }`}
                >
                  {formData.description.length}/{DESCRIPTION_MAX_LENGTH}
                </span>
              </div>
            </div>
          </div>

          {/* Classification Card */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
              <FaExclamationTriangle className="text-indigo-600" />
              Classification
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Status */}
              <div>
                <label
                  htmlFor="status"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Status
                </label>
                <div className="relative">
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none bg-white cursor-pointer"
                  >
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Closed">Closed</option>
                  </select>
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <svg
                      className="w-4 h-4 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
                <div className="mt-2">
                  <span
                    className={`inline-block px-3 py-1.5 rounded-lg text-xs font-semibold border ${getStatusColor(
                      formData.status
                    )}`}
                  >
                    {formData.status}
                  </span>
                </div>
              </div>

              {/* Priority */}
              <div>
                <label
                  htmlFor="priority"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Priority
                </label>
                <div className="relative">
                  <select
                    id="priority"
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none bg-white cursor-pointer"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <svg
                      className="w-4 h-4 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
                <div className="mt-2">
                  <span
                    className={`inline-block px-3 py-1.5 rounded-lg text-xs font-semibold border ${getPriorityColor(
                      formData.priority
                    )}`}
                  >
                    {formData.priority}
                  </span>
                </div>
              </div>

              {/* Severity */}
              <div>
                <label
                  htmlFor="severity"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Severity
                </label>
                <div className="relative">
                  <select
                    id="severity"
                    name="severity"
                    value={formData.severity}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none bg-white cursor-pointer"
                  >
                    <option value="Minor">Minor</option>
                    <option value="Major">Major</option>
                    <option value="Critical">Critical</option>
                  </select>
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <svg
                      className="w-4 h-4 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
                <div className="mt-2">
                  <span
                    className={`inline-block px-3 py-1.5 rounded-lg text-xs font-semibold border ${getSeverityColor(
                      formData.severity
                    )}`}
                  >
                    {formData.severity}
                  </span>
                </div>
              </div>
            </div>

            {/* Info Box */}
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex gap-3">
                <FaInfoCircle className="text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-semibold mb-1">Classification Guide:</p>
                  <ul className="space-y-1 text-xs">
                    <li>
                      <strong>Priority:</strong> How quickly the issue needs to
                      be addressed
                    </li>
                    <li>
                      <strong>Severity:</strong> The impact of the issue on the
                      system
                    </li>
                    <li>
                      <strong>Status:</strong> Current state of the issue
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-indigo-600 text-white rounded-xl font-semibold shadow-lg shadow-indigo-200 hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed transition-all"
            >
              {loading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    <FaSave />
                  </motion.div>
                  Creating Issue...
                </>
              ) : (
                <>
                  <FaSave /> Create Issue
                </>
              )}
            </motion.button>

            <Link to="/issues" className="flex-1">
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all"
              >
                <FaTimes /> Cancel
              </motion.button>
            </Link>
          </div>
        </motion.form>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
          onClick={() => {
            setShowSuccessModal(false);
            navigate("/issues");
          }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center">
              {/* Success Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 15,
                  delay: 0.2,
                }}
                className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4"
              >
                <FaCheckCircle className="h-10 w-10 text-green-600" />
              </motion.div>

              {/* Title */}
              <motion.h3
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-2xl font-bold text-gray-900 mb-2"
              >
                Issue Created Successfully!
              </motion.h3>

              {/* Message */}
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-gray-600 mb-6"
              >
                Your issue has been created with ID{" "}
                <span className="font-semibold text-indigo-600">
                  #{createdIssueId}
                </span>
              </motion.p>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col sm:flex-row gap-3"
              >
                <Link to={`/issues/${createdIssueId}`} className="flex-1">
                  <button className="w-full px-4 py-3 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-lg shadow-indigo-200">
                    View Issue
                  </button>
                </Link>
                <Link to="/issues" className="flex-1">
                  <button className="w-full px-4 py-3 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">
                    Back to Issues
                  </button>
                </Link>
              </motion.div>

              {/* Create Another */}
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                onClick={() => {
                  setShowSuccessModal(false);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="mt-4 text-sm text-indigo-600 hover:text-indigo-700 font-medium"
              >
                Create Another Issue
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </PageLayout>
  );
};

export default CreateIssue;