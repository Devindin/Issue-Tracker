import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaArrowLeft,
  FaEdit,
  FaTrash,
  FaExclamationCircle,
  FaSpinner,
  FaCheckCircle,
  FaTimesCircle,
  FaArrowUp,
  FaArrowDown,
  FaMinus,
  FaClock,
  FaUser,
  FaTag,
} from "react-icons/fa";
import PageLayout from "../Layout/PageLayout";
import PageTitle from "../Components/PageTitle";

interface Issue {
  id: number;
  title: string;
  description: string;
  status: "Open" | "In Progress" | "Resolved" | "Closed";
  priority: "Low" | "Medium" | "High" | "Critical";
  severity: "Minor" | "Major" | "Critical";
  createdAt: string;
  updatedAt: string;
}

const ViewIssue: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [issue, setIssue] = useState<Issue | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);

  // Mock data - replace with actual API call
  const mockIssues: Issue[] = [
    {
      id: 1,
      title: "Login page not responsive on mobile devices",
      description: "The login page layout breaks on mobile devices with screen width less than 375px. The form elements overlap and the submit button is not accessible.",
      status: "Open",
      priority: "High",
      severity: "Major",
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

  const getStatusBadge = (status: string) => {
    const styles = {
      Open: "bg-orange-50 text-orange-700 border-orange-200",
      "In Progress": "bg-blue-50 text-blue-700 border-blue-200",
      Resolved: "bg-green-50 text-green-700 border-green-200",
      Closed: "bg-gray-50 text-gray-700 border-gray-200",
    };
    return styles[status as keyof typeof styles] || "";
  };

  const getPriorityBadge = (priority: string) => {
    const styles = {
      Low: "bg-green-50 text-green-700 border-green-200",
      Medium: "bg-yellow-50 text-yellow-700 border-yellow-200",
      High: "bg-orange-50 text-orange-700 border-orange-200",
      Critical: "bg-red-50 text-red-700 border-red-200",
    };
    return styles[priority as keyof typeof styles] || "";
  };

  const getPriorityIcon = (priority: string) => {
    if (priority === "High" || priority === "Critical") {
      return <FaArrowUp className="inline" />;
    }
    if (priority === "Low") {
      return <FaArrowDown className="inline" />;
    }
    if (priority === "Medium") {
      return <FaMinus className="inline" />;
    }
    return null;
  };

  const getStatusIcon = (status: string) => {
    const icons = {
      Open: <FaExclamationCircle />,
      "In Progress": <FaSpinner className="animate-spin" />,
      Resolved: <FaCheckCircle />,
      Closed: <FaTimesCircle />,
    };
    return icons[status as keyof typeof icons] || null;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleDelete = async () => {
    if (!issue) return;

    try {
      // TODO: Replace with actual API call
      // await fetch(`/api/issues/${issue.id}`, {
      //   method: "DELETE",
      //   headers: {
      //     Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      //   },
      // });

      // Mock delete for development
      console.log("Issue deleted:", issue.id);
      navigate("/issues");
    } catch (error) {
      console.error("Error deleting issue:", error);
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
              to="/issues"
              className="p-2 text-white hover:text-[#1976D2] hover:bg-[#1976D2]/10 rounded-lg transition-colors"
            >
              <FaArrowLeft />
            </Link>
            <PageTitle
              title={`Issue #${issue.id}`}
              subtitle="View issue details"
              textColor="text-white"
            />
          </div>
          <div className="flex gap-3">
            <Link
              to={`/issues/${issue.id}/edit`}
              className="flex items-center gap-2 px-6 py-3 bg-[#00C6D7] text-white rounded-xl font-semibold hover:bg-[#00ACC1] transition-colors shadow-lg shadow-[#00C6D7]/25"
            >
              <FaEdit /> Edit Issue
            </Link>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors shadow-lg shadow-red-200"
            >
              <FaTrash /> Delete Issue
            </button>
          </div>
        </motion.div>

        {/* Issue Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-md p-8"
        >
          <div className="space-y-6">
            {/* Title */}
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">{issue.title}</h2>
              <div className="flex flex-wrap gap-3">
                <span
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border ${getStatusBadge(
                    issue.status
                  )}`}
                >
                  {getStatusIcon(issue.status)}
                  {issue.status}
                </span>
                <span
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border ${getPriorityBadge(
                    issue.priority
                  )}`}
                >
                  {getPriorityIcon(issue.priority)}
                  {issue.priority} Priority
                </span>
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-gray-100 text-gray-600 border border-gray-200">
                  <FaTag />
                  {issue.severity} Severity
                </span>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Description</h3>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{issue.description}</p>
              </div>
            </div>

            {/* Metadata */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-200">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <FaClock className="text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Created</p>
                    <p className="text-sm text-gray-800">{formatDate(issue.createdAt)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <FaClock className="text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Last Updated</p>
                    <p className="text-sm text-gray-800">{formatDate(issue.updatedAt)}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <FaUser className="text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Reporter</p>
                    <p className="text-sm text-gray-800">John Doe</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <FaUser className="text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Assignee</p>
                    <p className="text-sm text-gray-800">Jane Smith</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
          onClick={() => setShowDeleteModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", duration: 0.3 }}
            className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-14 w-14 rounded-full bg-red-100 mb-4">
                <FaTrash className="h-7 w-7 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Delete Issue
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                Are you sure you want to delete issue #{issue.id}? This action
                cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-4 py-2.5 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors shadow-lg shadow-red-200"
                >
                  Delete
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </PageLayout>
  );
};

export default ViewIssue;