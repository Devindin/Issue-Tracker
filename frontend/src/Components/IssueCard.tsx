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
} from "react-icons/fa";

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

interface IssueCardProps {
  issue: Issue;
  index?: number;
}

const IssueCard: React.FC<IssueCardProps> = ({ issue, index = 0 }) => {
  // Get status badge styles
  const getStatusBadge = (status: string) => {
    const styles = {
      Open: "bg-blue-100 text-blue-700 border-blue-300",
      "In Progress": "bg-yellow-100 text-yellow-700 border-yellow-300",
      Resolved: "bg-green-100 text-green-700 border-green-300",
      Closed: "bg-gray-100 text-gray-700 border-gray-300",
    };
    return styles[status as keyof typeof styles] || "";
  };

  const getPriorityBadge = (priority: string) => {
    const styles = {
      Low: "bg-gray-100 text-gray-600 border-gray-300",
      Medium: "bg-orange-100 text-orange-600 border-orange-300",
      High: "bg-red-100 text-red-600 border-red-300",
      Critical: "bg-purple-100 text-purple-700 border-purple-300",
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

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="p-6 hover:bg-gray-50 transition-colors"
    >
      <Link
        to={`/issues/${issue.id}`}
        className="block group"
      >
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-start gap-3">
              <span className="text-gray-400 font-mono text-sm mt-1">
                #{issue.id}
              </span>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors">
                  {issue.title}
                </h3>
                <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                  {issue.description}
                </p>
                <div className="flex items-center gap-2 mt-3 text-xs text-gray-500">
                  <FaClock />
                  <span>Created {formatDate(issue.createdAt)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 md:items-center">
            {/* Status Badge */}
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border ${getStatusBadge(
                issue.status
              )}`}
            >
              {getStatusIcon(issue.status)}
              {issue.status}
            </span>

            {/* Priority Badge */}
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border ${getPriorityBadge(
                issue.priority
              )}`}
            >
              {getPriorityIcon(issue.priority)}
              {issue.priority}
            </span>

            {/* Severity Badge */}
            <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold bg-gray-100 text-gray-600 border border-gray-200">
              {issue.severity}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default IssueCard;