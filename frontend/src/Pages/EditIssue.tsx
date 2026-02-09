import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  FaArrowLeft,
  FaExclamationCircle,
  FaSpinner,
  FaSave,
  FaTimes,
  FaExclamationTriangle,
  FaInfoCircle,
} from "react-icons/fa";
import PageLayout from "../Layout/PageLayout";
import PageTitle from "../Components/PageTitle";
import { type User } from "../types";

interface Issue {
  id: number;
  title: string;
  description: string;
  status: "Open" | "In Progress" | "Resolved" | "Closed";
  priority: "Low" | "Medium" | "High" | "Critical";
  severity: "Minor" | "Major" | "Critical";
  assignee?: User;
  assigneeId?: number;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

const EditIssue: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [issue, setIssue] = useState<Issue | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);

  // Character count limits
  const TITLE_MAX_LENGTH = 100;
  const DESCRIPTION_MAX_LENGTH = 1000;

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

  // Mock data - replace with actual API call
  const mockIssues: Issue[] = [
    {
      id: 1,
      title: "Login page not responsive on mobile devices",
      description: "The login page layout breaks on mobile devices with screen width less than 375px. The form elements overlap and the submit button is not accessible.",
      status: "Open",
      priority: "High",
      severity: "Major",
      assignee: { id: 1, name: "John Doe", email: "john@example.com" },
      createdAt: "2026-02-05T10:30:00Z",
      updatedAt: "2026-02-05T10:30:00Z",
    },
    {
      id: 2,
      title: "Database connection timeout on high load",
      description: "The application experiences database connection timeouts when there are more than 100 concurrent users. This causes 503 errors and affects user experience.",
      status: "In Progress",
      priority: "Critical",
      severity: "Critical",
      assignee: { id: 2, name: "Jane Smith", email: "jane@example.com" },
      createdAt: "2026-02-04T14:20:00Z",
      updatedAt: "2026-02-06T09:15:00Z",
    },
    {
      id: 3,
      title: "Add export to CSV feature",
      description: "Users want to export issue lists to CSV format for reporting purposes.",
      status: "Open",
      priority: "Medium",
      severity: "Minor",
      assignee: { id: 3, name: "Mike Johnson", email: "mike@example.com" },
      createdAt: "2026-02-03T16:45:00Z",
      updatedAt: "2026-02-03T16:45:00Z",
    },
    {
      id: 4,
      title: "Fix typo in dashboard title",
      description: "Spelling mistake in the dashboard header section.",
      status: "Resolved",
      priority: "Low",
      severity: "Minor",
      assignee: { id: 4, name: "Sarah Wilson", email: "sarah@example.com" },
      completedAt: "2026-02-06T10:30:00Z",
      createdAt: "2026-02-02T11:00:00Z",
      updatedAt: "2026-02-06T10:30:00Z",
    },
    {
      id: 5,
      title: "Performance issues on large datasets",
      description: "Application slows down significantly when handling more than 1000 issues.",
      status: "In Progress",
      priority: "High",
      severity: "Major",
      assignee: { id: 1, name: "John Doe", email: "john@example.com" },
      createdAt: "2026-02-01T08:30:00Z",
      updatedAt: "2026-02-07T08:00:00Z",
    },
    {
      id: 6,
      title: "User authentication not working",
      description: "Some users cannot log in with correct credentials.",
      status: "Open",
      priority: "Critical",
      severity: "Critical",
      createdAt: "2026-01-31T15:20:00Z",
      updatedAt: "2026-01-31T15:20:00Z",
    },
    {
      id: 7,
      title: "Add dark mode support",
      description: "Implement dark mode theme for better user experience.",
      status: "Open",
      priority: "Low",
      severity: "Minor",
      assignee: { id: 2, name: "Jane Smith", email: "jane@example.com" },
      createdAt: "2026-01-30T12:15:00Z",
      updatedAt: "2026-01-30T12:15:00Z",
    },
  ];

  useEffect(() => {
    const fetchIssue = async () => {
      try {
        // TODO: Replace with actual API call
        // const response = await fetch(`/api/issues/${id}`);
        // const data = await response.json();

        // Mock fetch for development
        const issueData = mockIssues.find(issue => issue.id === parseInt(id || "0"));
        setIssue(issueData || null);
      } catch (error) {
        console.error("Error fetching issue:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchIssue();
    }
  }, [id]);

  const validationSchema = Yup.object({
    title: Yup.string()
      .min(5, "Title must be at least 5 characters")
      .max(100, "Title must be less than 100 characters")
      .required("Title is required"),
    description: Yup.string()
      .min(10, "Description must be at least 10 characters")
      .max(1000, "Description must be less than 1000 characters")
      .required("Description is required"),
    status: Yup.string()
      .oneOf(["Open", "In Progress", "Resolved", "Closed"], "Invalid status")
      .required("Status is required"),
    priority: Yup.string()
      .oneOf(["Low", "Medium", "High", "Critical"], "Invalid priority")
      .required("Priority is required"),
    severity: Yup.string()
      .oneOf(["Minor", "Major", "Critical"], "Invalid severity")
      .required("Severity is required"),
    assignee: Yup.string().optional(),
  });

  const handleSubmit = async (values: any) => {
    setSaving(true);
    try {
      // TODO: Replace with actual API call
      // const response = await fetch(`/api/issues/${id}`, {
      //   method: "PUT",
      //   headers: {
      //     "Content-Type": "application/json",
      //     Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      //   },
      //   body: JSON.stringify(values),
      // });

      // Mock update for development
      console.log("Issue updated:", { id, ...values });
      navigate(`/issues/${id}`);
    } catch (error) {
      console.error("Error updating issue:", error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <FaSpinner className="animate-spin text-4xl text-[#1976D2] mx-auto mb-4" />
            <p className="text-gray-600">Loading issue...</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (!issue) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <FaExclamationCircle className="text-6xl text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Issue Not Found</h2>
            <p className="text-gray-600 mb-6">The issue you're looking for doesn't exist.</p>
            <Link
              to="/issues"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#1976D2] text-white rounded-xl font-semibold hover:bg-[#1565C0] transition-colors"
            >
              <FaArrowLeft /> Back to Issues
            </Link>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <Link
              to={`/issues/${issue.id}`}
              className="p-2 text-white hover:text-[#1976D2] hover:bg-[#1976D2]/10 rounded-lg transition-colors"
            >
              <FaArrowLeft />
            </Link>
            <PageTitle
              title={`Edit Issue #${issue.id}`}
              subtitle="Update issue details"
              textColor="text-white"
            />
          </div>
        </motion.div>

        {/* Edit Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-6"
        >
          <Formik
            initialValues={{
              title: issue.title,
              description: issue.description,
              status: issue.status,
              priority: issue.priority,
              severity: issue.severity,
              assignee: issue.assignee?.name || "",
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, values }) => (
              <Form className="space-y-6">
                {/* Main Information Card */}
                <div className="bg-white rounded-2xl shadow-md p-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                    <FaInfoCircle className="text-indigo-600" />
                    Main Information
                  </h2>

                  {/* Title */}
                  <div className="mb-6">
                    <label
                      htmlFor="title"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Title <span className="text-red-500">*</span>
                    </label>
                    <Field
                      as="input"
                      id="title"
                      name="title"
                      type="text"
                      maxLength={TITLE_MAX_LENGTH}
                      placeholder="Enter a clear, concise title for the issue"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    />
                    <ErrorMessage name="title" component="div" className="text-red-500 text-sm mt-1 flex items-center gap-1" />
                    <div className="flex justify-end mt-1">
                      <span
                        className={`text-xs ${
                          values.title.length > TITLE_MAX_LENGTH * 0.9
                            ? "text-red-500"
                            : "text-gray-500"
                        }`}
                      >
                        {values.title.length}/{TITLE_MAX_LENGTH}
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
                    <Field
                      as="textarea"
                      id="description"
                      name="description"
                      maxLength={DESCRIPTION_MAX_LENGTH}
                      rows={6}
                      placeholder="Provide a detailed description of the issue, including steps to reproduce, expected behavior, and actual behavior..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
                    />
                    <ErrorMessage name="description" component="div" className="text-red-500 text-sm mt-1 flex items-center gap-1" />
                    <div className="flex justify-end mt-1">
                      <span
                        className={`text-xs ${
                          values.description.length > DESCRIPTION_MAX_LENGTH * 0.9
                            ? "text-red-500"
                            : "text-gray-500"
                        }`}
                      >
                        {values.description.length}/{DESCRIPTION_MAX_LENGTH}
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

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Status */}
                    <div>
                      <label
                        htmlFor="status"
                        className="block text-sm font-semibold text-gray-700 mb-2"
                      >
                        Status
                      </label>
                      <div className="relative">
                        <Field
                          as="select"
                          id="status"
                          name="status"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none bg-white cursor-pointer"
                        >
                          <option value="Open">Open</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Resolved">Resolved</option>
                          <option value="Closed">Closed</option>
                        </Field>
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
                            values.status
                          )}`}
                        >
                          {values.status}
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
                        <Field
                          as="select"
                          id="priority"
                          name="priority"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none bg-white cursor-pointer"
                        >
                          <option value="Low">Low</option>
                          <option value="Medium">Medium</option>
                          <option value="High">High</option>
                          <option value="Critical">Critical</option>
                        </Field>
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
                            values.priority
                          )}`}
                        >
                          {values.priority}
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
                        <Field
                          as="select"
                          id="severity"
                          name="severity"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none bg-white cursor-pointer"
                        >
                          <option value="Minor">Minor</option>
                          <option value="Major">Major</option>
                          <option value="Critical">Critical</option>
                        </Field>
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
                            values.severity
                          )}`}
                        >
                          {values.severity}
                        </span>
                      </div>
                    </div>

                    {/* Assignee */}
                    <div>
                      <label
                        htmlFor="assignee"
                        className="block text-sm font-semibold text-gray-700 mb-2"
                      >
                        Assignee
                      </label>
                      <div className="relative">
                        <Field
                          as="select"
                          id="assignee"
                          name="assignee"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none bg-white cursor-pointer"
                        >
                          <option value="">Unassigned</option>
                          <option value="John Doe">John Doe</option>
                          <option value="Jane Smith">Jane Smith</option>
                          <option value="Mike Johnson">Mike Johnson</option>
                          <option value="Sarah Wilson">Sarah Wilson</option>
                        </Field>
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
                          className={`inline-block px-3 py-1.5 rounded-lg text-xs font-semibold border ${
                            values.assignee
                              ? "bg-green-100 border-green-300 text-green-700"
                              : "bg-gray-100 border-gray-300 text-gray-700"
                          }`}
                        >
                          {values.assignee || "Unassigned"}
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
                          <li>
                            <strong>Assignee:</strong> Person responsible for the issue
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
                    disabled={isSubmitting || saving}
                    whileHover={{ scale: (isSubmitting || saving) ? 1 : 1.02 }}
                    whileTap={{ scale: (isSubmitting || saving) ? 1 : 0.98 }}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-indigo-600 text-white rounded-xl font-semibold shadow-lg shadow-indigo-200 hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed transition-all"
                  >
                    {saving || isSubmitting ? (
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
                        Saving Changes...
                      </>
                    ) : (
                      <>
                        <FaSave /> Save Changes
                      </>
                    )}
                  </motion.button>

                  <Link to={`/issues/${issue.id}`} className="flex-1">
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
              </Form>
            )}
          </Formik>
        </motion.div>
      </div>
    </PageLayout>
  );
};

export default EditIssue;