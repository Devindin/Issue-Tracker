import React from "react";
import { motion } from "framer-motion";
import PageLayout from "../Layout/PageLayout";
import { useGetIssuesQuery } from "../features/issues/issueApi";
import KanbanIssueCard from "../Components/KanbanIssueCard";

const columns = [
  { key: "Open", color: "bg-blue-500" },
  { key: "In Progress", color: "bg-yellow-500" },
  { key: "Resolved", color: "bg-green-500" },
  { key: "Closed", color: "bg-gray-500" },
];

const KanbanIssues: React.FC = () => {
  const { data, isLoading } = useGetIssuesQuery({});
  const issues = data?.issues || [];

  const groupedIssues = columns.map((col) => ({
    ...col,
    items: issues.filter((issue) => issue.status === col.key),
  }));

  return (
    <PageLayout>
      <div className="space-y-6">

        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">
              Kanban Board
            </h1>
            <p className="text-white/70">
              Visualize and manage issues by status
            </p>
          </div>
        </div>

        {/* Board */}
        <div className="flex gap-6 overflow-x-auto pb-4">
          {groupedIssues.map((column, colIndex) => (
            <motion.div
              key={column.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: colIndex * 0.1 }}
              className="min-w-[320px] bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 flex flex-col max-h-[75vh]"
            >
              {/* Column Header */}
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-3 h-3 rounded-full ${column.color}`}
                  />
                  <h2 className="font-semibold text-gray-800">
                    {column.key}
                  </h2>
                </div>

                <span className="px-3 py-1 text-sm font-medium bg-gray-100 text-gray-600 rounded-full">
                  {column.items.length}
                </span>
              </div>

              {/* Issues List */}
              <div className="p-4 space-y-4 overflow-y-auto flex-1">
                {column.items.length === 0 ? (
                  <div className="text-center text-gray-400 text-sm mt-6">
                    No issues
                  </div>
                ) : (
                  column.items.map((issue) => (
  <KanbanIssueCard key={issue.id} issue={issue} />
))
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </PageLayout>
  );
};

export default KanbanIssues;