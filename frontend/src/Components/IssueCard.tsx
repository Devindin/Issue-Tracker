import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaExclamationCircle,
  FaSpinner,
  FaCheckCircle,
  FaTimesCircle,
  FaArrowUp,
  FaArrowDown,
  FaClock,
  FaEye,
  FaEdit,
  FaTrash,
  FaMinus,
} from "react-icons/fa";
import type { Issue } from "../types";

interface IssueCardProps {
  issue: Issue;
  viewMode?: "grid" | "list";
  index?: number;
  onDelete?: (id: number | string) => void;
}

const IssueCard: React.FC<IssueCardProps> = ({
  issue,
  viewMode = "list",
  index = 0,
  onDelete,
}) => {
  // Get status badge styles
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
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) {
      return `${diffMins}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else {
      return `${diffDays}d ago`;
    }
  };

  if (viewMode === "grid") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
        className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all overflow-hidden group"
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <span className="text-gray-400 font-mono text-sm">#{issue.id}</span>
            <div className="flex gap-2">
              <Link to={`/issues/${issue.id}`}>
                <button className="p-2 text-[#1976D2] hover:bg-[#1976D2]/10 rounded-lg transition-colors">
                  <FaEye />
                </button>
              </Link>
              <Link to={`/issues/${issue.id}/edit`}>
                <button className="p-2 text-[#00C6D7] hover:bg-[#00C6D7]/10 rounded-lg transition-colors">
                  <FaEdit />
                </button>
              </Link>
              {onDelete && (
                <button
                  onClick={() => onDelete(issue.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <FaTrash />
                </button>
              )}
            </div>
          </div>

          {/* Title */}
          <Link to={`/issues/${issue.id}`}>
            <h3 className="font-bold text-gray-800 mb-2 group-hover:text-[#1976D2] transition-colors line-clamp-2">
              {issue.title}
            </h3>
          </Link>

          {/* Description */}
          <p className="text-gray-600 text-sm mb-4 line-clamp-3">
            {issue.description}
          </p>

          {/* Badges */}
          <div className="flex flex-wrap gap-2 mb-4">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold border ${getStatusBadge(
                issue.status,
              )}`}
            >
              {getStatusIcon(issue.status)}
              {issue.status}
            </span>
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold border ${getPriorityBadge(
                issue.priority,
              )}`}
            >
              {getPriorityIcon(issue.priority)}
              {issue.priority}
            </span>
          </div>

          {/* Footer */}
          <div className="flex items-center text-xs text-gray-500 border-t border-gray-100 pt-4">
            <FaClock className="mr-2" />
            {formatDate(issue.createdAt)}
          </div>
        </div>
      </motion.div>
    );
  }

return (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.3, delay: index * 0.05 }}
    className="p-4 sm:p-5 md:p-6 hover:bg-gray-50 transition-colors"
  >
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      
      {/* Left Section */}
      <div className="flex-1 min-w-0">
        <Link to={`/issues/${issue.id}`} className="block group">
          <span className="text-gray-400 font-mono text-xs sm:text-sm">
            #{issue.id}
          </span>

          <h3 className="font-semibold text-gray-800 group-hover:text-[#1976D2] transition-colors 
                         text-base sm:text-lg mt-1 break-words">
            {issue.title}
          </h3>

          <p className="text-gray-600 text-sm mt-1 line-clamp-2 break-words">
            {issue.description}
          </p>

          {/* Badges */}
          <div className="flex flex-wrap gap-2 mt-3">
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold border ${getStatusBadge(
                issue.status
              )}`}
            >
              {getStatusIcon(issue.status)}
              {issue.status}
            </span>

            <span
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold border ${getPriorityBadge(
                issue.priority
              )}`}
            >
              {getPriorityIcon(issue.priority)}
              {issue.priority}
            </span>

            <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-gray-100 text-gray-600 border border-gray-200">
              {issue.severity}
            </span>
          </div>
        </Link>
      </div>

      {/* Right Section */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
        
        {/* Date (visible on mobile now) */}
        <div className="text-xs text-gray-500 flex items-center gap-2">
          <FaClock />
          {formatDate(issue.createdAt)}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Link to={`/issues/${issue.id}`}>
            <button className="p-2 text-[#1976D2] hover:bg-[#1976D2]/10 rounded-lg transition-colors">
              <FaEye />
            </button>
          </Link>

          <Link to={`/issues/${issue.id}/edit`}>
            <button className="p-2 text-[#00C6D7] hover:bg-[#00C6D7]/10 rounded-lg transition-colors">
              <FaEdit />
            </button>
          </Link>

          {onDelete && (
            <button
              onClick={() => onDelete(issue.id)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <FaTrash />
            </button>
          )}
        </div>
      </div>
    </div>
  </motion.div>
);

};

export default IssueCard;
