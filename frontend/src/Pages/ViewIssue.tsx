import React, { useState } from "react";
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
  FaFolder,
} from "react-icons/fa";
import PageLayout from "../Layout/PageLayout";
import PageTitle from "../Components/PageTitle";
import DeleteModal from "../models/DeleteModal";
import { useGetIssueByIdQuery, useDeleteIssueMutation } from "../features/issues/issueApi";

const ViewIssue: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);

  // Fetch issue data from API
  const { data, isLoading, error } = useGetIssueByIdQuery(id || "", {
    skip: !id,
  });

  // Delete mutation
  const [deleteIssue] = useDeleteIssueMutation();

  const issue = data?.issue;

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
      await deleteIssue(issue.id.toString()).unwrap();
      console.log("Issue deleted successfully:", issue.id);
      navigate("/issues");
    } catch (error) {
      console.error("Error deleting issue:", error);
    }
  };

  if (isLoading) {
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

  if (error || !issue) {
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
                {issue.project && (
                  <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                    <FaFolder />
                    {issue.project.icon} {issue.project.name} ({issue.project.key})
                  </span>
                )}
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
                    <p className="text-sm text-gray-800">{issue.reporter?.name || "Unassigned"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <FaUser className="text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Assignee</p>
                    <p className="text-sm text-gray-800">{issue.assignee?.name || "Unassigned"}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Delete Issue"
        itemName={`issue #${issue.id}`}
      />
    </PageLayout>
  );
};

export default ViewIssue;