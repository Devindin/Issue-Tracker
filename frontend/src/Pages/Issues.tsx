import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FaExclamationCircle,
  FaSpinner,
  FaPlus,
  FaSearch,
  FaTrash,
  FaFileExport,
  FaTimes,
} from "react-icons/fa";
import PageLayout from "../Layout/PageLayout";
import IssueCard from "../Components/IssueCard";

// Types
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

type SortField = "createdAt" | "updatedAt" | "priority" | "status" | "title";
type SortOrder = "asc" | "desc";

const Issues: React.FC = () => {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [filterPriority, setFilterPriority] = useState<string>("All");
  const [filterSeverity, setFilterSeverity] = useState<string>("All");
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [issueToDelete, setIssueToDelete] = useState<number | null>(null);
  const [showFilters, setShowFilters] = useState<boolean>(false);

  const itemsPerPage = 12;

  // Debounce search
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch issues
  useEffect(() => {
    fetchIssues();
  }, []);

  const fetchIssues = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      const response = await fetch("/api/issues", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      const data = await response.json();
      setIssues(data.issues || []);
    } catch (error) {
      console.error("Error fetching issues:", error);
      // Mock data for development
      const mockIssues: Issue[] = [
        {
          id: 1,
          title: "Login page not responsive on mobile",
          description: "The login page layout breaks on mobile devices below 768px width. Need to implement responsive design.",
          status: "Open",
          priority: "High",
          severity: "Major",
          createdAt: "2026-02-05T10:30:00Z",
          updatedAt: "2026-02-05T10:30:00Z",
        },
        {
          id: 2,
          title: "Database connection timeout",
          description: "Users experiencing timeout errors when connecting to the database during peak hours.",
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
          createdAt: "2026-01-30T09:10:00Z",
          updatedAt: "2026-01-30T09:10:00Z",
        },
        {
          id: 8,
          title: "Email notifications not sending",
          description: "Users are not receiving email notifications for issue updates.",
          status: "In Progress",
          priority: "High",
          severity: "Major",
          createdAt: "2026-01-29T13:45:00Z",
          updatedAt: "2026-02-05T14:20:00Z",
        },
        {
          id: 9,
          title: "Improve search functionality",
          description: "Search should support fuzzy matching and filters.",
          status: "Open",
          priority: "Medium",
          severity: "Minor",
          createdAt: "2026-01-28T10:15:00Z",
          updatedAt: "2026-01-28T10:15:00Z",
        },
        {
          id: 10,
          title: "Fix pagination bugs",
          description: "Pagination not working correctly on the issues page.",
          status: "Resolved",
          priority: "Medium",
          severity: "Major",
          createdAt: "2026-01-27T16:30:00Z",
          updatedAt: "2026-02-04T11:00:00Z",
        },
        {
          id: 11,
          title: "Update documentation",
          description: "API documentation needs to be updated with recent changes.",
          status: "Open",
          priority: "Low",
          severity: "Minor",
          createdAt: "2026-01-26T08:00:00Z",
          updatedAt: "2026-01-26T08:00:00Z",
        },
        {
          id: 12,
          title: "Security vulnerability in dependencies",
          description: "npm audit showing critical vulnerabilities that need immediate attention.",
          status: "In Progress",
          priority: "Critical",
          severity: "Critical",
          createdAt: "2026-01-25T14:50:00Z",
          updatedAt: "2026-02-06T16:30:00Z",
        },
      ];
      setIssues(mockIssues);
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort issues
  const filteredAndSortedIssues = useCallback(() => {
    let filtered = issues.filter((issue) => {
      const matchesSearch =
        issue.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        issue.description.toLowerCase().includes(debouncedSearch.toLowerCase());
      const matchesStatus =
        filterStatus === "All" || issue.status === filterStatus;
      const matchesPriority =
        filterPriority === "All" || issue.priority === filterPriority;
      const matchesSeverity =
        filterSeverity === "All" || issue.severity === filterSeverity;
      return matchesSearch && matchesStatus && matchesPriority && matchesSeverity;
    });

    // Sort
    filtered.sort((a, b) => {
      let comparison = 0;

      if (sortField === "priority") {
        const priorityOrder = { Low: 1, Medium: 2, High: 3, Critical: 4 };
        comparison = priorityOrder[a.priority] - priorityOrder[b.priority];
      } else if (sortField === "status") {
        const statusOrder = { Open: 1, "In Progress": 2, Resolved: 3, Closed: 4 };
        comparison = statusOrder[a.status] - statusOrder[b.status];
      } else if (sortField === "title") {
        comparison = a.title.localeCompare(b.title);
      } else {
        comparison = new Date(a[sortField]).getTime() - new Date(b[sortField]).getTime();
      }

      return sortOrder === "asc" ? comparison : -comparison;
    });

    return filtered;
  }, [issues, debouncedSearch, filterStatus, filterPriority, filterSeverity, sortField, sortOrder]);

  const filteredIssues = filteredAndSortedIssues();

  // Pagination
  const totalPages = Math.ceil(filteredIssues.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedIssues = filteredIssues.slice(startIndex, startIndex + itemsPerPage);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, filterStatus, filterPriority, filterSeverity]);

  // Delete issue
  const handleDeleteClick = (id: number) => {
    setIssueToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (issueToDelete) {
      try {
        // TODO: Replace with actual API call
        await fetch(`/api/issues/${issueToDelete}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });
        setIssues(issues.filter((issue) => issue.id !== issueToDelete));
      } catch (error) {
        console.error("Error deleting issue:", error);
        // Mock delete for development
        setIssues(issues.filter((issue) => issue.id !== issueToDelete));
      }
    }
    setShowDeleteModal(false);
    setIssueToDelete(null);
  };

  // Export functionality
  const exportToCSV = () => {
    const headers = ["ID", "Title", "Description", "Status", "Priority", "Severity", "Created At", "Updated At"];
    const csvData = filteredIssues.map((issue) => [
      issue.id,
      `"${issue.title}"`,
      `"${issue.description}"`,
      issue.status,
      issue.priority,
      issue.severity,
      issue.createdAt,
      issue.updatedAt,
    ]);

    const csvContent = [
      headers.join(","),
      ...csvData.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `issues-export-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  const exportToJSON = () => {
    const jsonContent = JSON.stringify(filteredIssues, null, 2);
    const blob = new Blob([jsonContent], { type: "application/json" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `issues-export-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
  };

  const clearFilters = () => {
    setSearchTerm("");
    setFilterStatus("All");
    setFilterPriority("All");
    setFilterSeverity("All");
    setSortField("createdAt");
    setSortOrder("desc");
  };

  const hasActiveFilters = searchTerm || filterStatus !== "All" || filterPriority !== "All" || filterSeverity !== "All";

  return (
    <PageLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        >
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              All Issues
            </h1>
            <p className="text-white mt-1">
              Manage and track all your issues in one place
            </p>
          </div>
          <div className="flex gap-3">
            <div className="relative">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors flex items-center gap-2"
              >
                <FaFileExport />
                Export
              </button>
              {showFilters && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-10">
                  <button
                    onClick={exportToCSV}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors text-sm"
                  >
                    Export as CSV
                  </button>
                  <button
                    onClick={exportToJSON}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors text-sm"
                  >
                    Export as JSON
                  </button>
                </div>
              )}
            </div>
            <Link to="/issues/new">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-colors"
              >
                <FaPlus /> Create Issue
              </motion.button>
            </Link>
          </div>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white rounded-2xl p-6 shadow-md"
        >
          {/* Search Bar */}
          <div className="relative mb-4">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search issues by title or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          {/* Filters Row */}
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Status Filter */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none bg-white cursor-pointer"
              >
                <option value="All">All Status</option>
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
                <option value="Closed">Closed</option>
              </select>
            </div>

            {/* Priority Filter */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority
              </label>
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none bg-white cursor-pointer"
              >
                <option value="All">All Priority</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>

            {/* Severity Filter */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Severity
              </label>
              <select
                value={filterSeverity}
                onChange={(e) => setFilterSeverity(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none bg-white cursor-pointer"
              >
                <option value="All">All Severity</option>
                <option value="Minor">Minor</option>
                <option value="Major">Major</option>
                <option value="Critical">Critical</option>
              </select>
            </div>

            {/* Sort By */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort By
              </label>
              <select
                value={sortField}
                onChange={(e) => setSortField(e.target.value as SortField)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none bg-white cursor-pointer"
              >
                <option value="createdAt">Date Created</option>
                <option value="updatedAt">Last Updated</option>
                <option value="priority">Priority</option>
                <option value="status">Status</option>
                <option value="title">Title</option>
              </select>
            </div>
          </div>

          {/* Filter Actions */}
          {hasActiveFilters && (
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Showing {filteredIssues.length} of {issues.length} issues
              </p>
              <button
                onClick={clearFilters}
                className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-2"
              >
                <FaTimes /> Clear Filters
              </button>
            </div>
          )}
        </motion.div>

        {/* Issues Grid/List */}
        {loading ? (
          <div className="flex items-center justify-center p-12">
            <FaSpinner className="text-4xl text-indigo-600 animate-spin" />
          </div>
        ) : paginatedIssues.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-12 text-center shadow-md"
          >
            <FaExclamationCircle className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No issues found
            </h3>
            <p className="text-gray-600 mb-6">
              {hasActiveFilters
                ? "Try adjusting your search or filters"
                : "Get started by creating your first issue"}
            </p>
            {!hasActiveFilters && (
              <Link to="/issues/new">
                <button className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors">
                  Create First Issue
                </button>
              </Link>
            )}
          </motion.div>
        ) : (
          <>
            {/* List View */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-md overflow-hidden"
            >
              <div className="divide-y divide-gray-100">
                {paginatedIssues.map((issue, index) => (
                  <IssueCard
                    key={issue.id}
                    issue={issue}
                    viewMode="list"
                    index={index}
                    onDelete={handleDeleteClick}
                  />
                ))}
              </div>
            </motion.div>

            {/* Pagination */}
            {totalPages > 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-center gap-2 mt-6"
              >
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>

                <div className="flex gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => {
                      // Show first page, last page, current page, and pages around current
                      if (
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1)
                      ) {
                        return (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                              currentPage === page
                                ? "bg-indigo-600 text-white"
                                : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                            }`}
                          >
                            {page}
                          </button>
                        );
                      } else if (
                        page === currentPage - 2 ||
                        page === currentPage + 2
                      ) {
                        return (
                          <span
                            key={page}
                            className="px-2 py-2 text-gray-500"
                          >
                            ...
                          </span>
                        );
                      }
                      return null;
                    }
                  )}
                </div>

                <button
                  onClick={() =>
                    setCurrentPage(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </motion.div>
            )}
          </>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
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
                  Are you sure you want to delete this issue? This action
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
                    onClick={confirmDelete}
                    className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors shadow-lg shadow-red-200"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageLayout>
  );
};

export default Issues;