import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaUser, FaClock } from "react-icons/fa";
import type { Issue } from "../types";

interface KanbanIssueCardProps {
  issue: Issue;
}

const KanbanIssueCard: React.FC<KanbanIssueCardProps> = ({ issue }) => {
  const navigate = useNavigate();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => navigate(`/issues/${issue.id}`)}
      className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all cursor-pointer border border-gray-100"
    >
      {/* Title */}
      <h3 className="font-semibold text-gray-800 text-sm mb-3 line-clamp-2">
        {issue.title}
      </h3>

      {/* Assignee */}
      <div className="flex items-center gap-2 text-xs text-gray-600 mb-2">
        <FaUser className="text-gray-400" />
        <span>
          {issue.assignee?.name || "Unassigned"}
        </span>
      </div>

      {/* Created Date */}
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <FaClock className="text-gray-400" />
        <span>{formatDate(issue.createdAt)}</span>
      </div>
    </motion.div>
  );
};

export default KanbanIssueCard;