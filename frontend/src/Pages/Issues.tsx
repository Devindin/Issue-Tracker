import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FaExclamationCircle,
  FaSpinner,
  FaPlus,
  FaSearch,
  FaFileExport,
  FaTimes,
} from "react-icons/fa";
import PageLayout from "../Layout/PageLayout";
import IssueCard from "../Components/IssueCard";
import PageTitle from "../Components/PageTitle";
import DeleteModal from "../models/DeleteModal";
import Pagination from "../Components/Pagination";
import { type SortField, type SortOrder } from "../types";
import { useGetIssuesQuery, useDeleteIssueMutation } from "../features/issues/issueApi";
import { useGetProjectsQuery } from "../features/projects/projectApi";
import { useGetUsersQuery } from "../features/users/userApi";

const Issues: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [filterPriority, setFilterPriority] = useState<string>("All");
  const [filterSeverity, setFilterSeverity] = useState<string>("All");
  const [filterAssignee, setFilterAssignee] = useState<string>("All");
  const [filterProject, setFilterProject] = useState<string>("All");
  const [filterCompletedDate, setFilterCompletedDate] = useState<string>("All");
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [issueToDelete, setIssueToDelete] = useState<number | string | null>(null);
  const [showFilters, setShowFilters] = useState<boolean>(false);

  const itemsPerPage = 6;

  // Debounce search
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch projects for filter
  const { data: projectsData } = useGetProjectsQuery({});
  const projects = projectsData || [];
  
  // Fetch users for assignee filter
  const { data: users = [] } = useGetUsersQuery();

  // Fetch issues with search and filters
  const { data, isLoading, isError, error } = useGetIssuesQuery({
    search: debouncedSearch || undefined,
    status: filterStatus !== "All" ? filterStatus : undefined,
    priority: filterPriority !== "All" ? filterPriority : undefined,
    severity: filterSeverity !== "All" ? filterSeverity : undefined,
  });

  // Delete mutation
  const [deleteIssue] = useDeleteIssueMutation();

  // Get issues from API response
  const issues = data?.issues || [];

  // Apply client-side filters for assignee, project and completedDate (not handled by API)
  const filteredAndSortedIssues = useCallback(() => {
    let filtered = issues.filter((issue) => {
      const matchesAssignee =
        filterAssignee === "All" || (issue.assignee && issue.assignee.name === filterAssignee);
      const matchesProject =
        filterProject === "All" || 
        (issue.project && issue.project._id === filterProject) ||
        (filterProject === "Unassigned" && !issue.project);
      const matchesCompletedDate = (() => {
        if (filterCompletedDate === "All") return true;
        if (!issue.completedAt) return filterCompletedDate === "Unassigned";
        const completedDate = new Date(issue.completedAt);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        const lastWeek = new Date(today);
        lastWeek.setDate(lastWeek.getDate() - 7);

        switch (filterCompletedDate) {
          case "Today":
            return completedDate.toDateString() === today.toDateString();
          case "Yesterday":
            return completedDate.toDateString() === yesterday.toDateString();
          case "Last Week":
            return completedDate >= lastWeek;
          case "Unassigned":
            return !issue.completedAt;
          default:
            return true;
        }
      })();
      return matchesAssignee && matchesCompletedDate && matchesProject;
    });

    // Sort
    filtered.sort((a, b) => {
      let comparison = 0;

      if (sortField === "priority") {
        const priorityOrder = { Low: 1, Medium: 2, High: 3, Critical: 4 };
        comparison = priorityOrder[a.priority as keyof typeof priorityOrder] - priorityOrder[b.priority as keyof typeof priorityOrder];
      } else if (sortField === "status") {
        const statusOrder = { Open: 1, "In Progress": 2, Resolved: 3, Closed: 4 };
        comparison = statusOrder[a.status as keyof typeof statusOrder] - statusOrder[b.status as keyof typeof statusOrder];
      } else if (sortField === "title") {
        comparison = a.title.localeCompare(b.title);
      } else {
        comparison = new Date(a[sortField]).getTime() - new Date(b[sortField]).getTime();
      }

      return sortOrder === "asc" ? comparison : -comparison;
    });

    return filtered;
  }, [issues, filterAssignee, filterProject, filterCompletedDate, sortField, sortOrder]);

  const filteredIssues = filteredAndSortedIssues();

  // Pagination
  const totalPages = Math.ceil(filteredIssues.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedIssues = filteredIssues.slice(startIndex, startIndex + itemsPerPage);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, filterStatus, filterPriority, filterSeverity, filterAssignee, filterProject, filterCompletedDate]);

  // Delete issue
  const handleDeleteClick = (id: number | string) => {
    setIssueToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (issueToDelete) {
      try {
        await deleteIssue(issueToDelete.toString()).unwrap();
        console.log("Issue deleted successfully:", issueToDelete);
      } catch (error) {
        console.error("Error deleting issue:", error);
      }
    }
    setShowDeleteModal(false);
    setIssueToDelete(null);
  };

  // Export functionality
  const exportToCSV = () => {
    const headers = ["ID", "Title", "Description", "Status", "Priority", "Severity", "Assignee", "Completed At", "Created At", "Updated At"];
    const csvData = filteredIssues.map((issue) => [
      issue.id,
      `"${issue.title}"`,
      `"${issue.description}"`,
      issue.status,
      issue.priority,
      issue.severity,
      issue.assignee ? issue.assignee.name : "Unassigned",
      issue.completedAt || "",
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
    setFilterAssignee("All");
    setFilterProject("All");
    setFilterCompletedDate("All");
    setSortField("createdAt");
    setSortOrder("desc");
  };

  const hasActiveFilters = searchTerm || filterStatus !== "All" || filterPriority !== "All" || filterSeverity !== "All" || filterAssignee !== "All" || filterProject !== "All" || filterCompletedDate !== "All";

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
          <PageTitle
            title="All Issues"
            subtitle="Manage and track all your issues in one place"
            textColor="text-white"
          />
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

            {/* Assignee Filter */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Assignee
              </label>
              <select
                value={filterAssignee}
                onChange={(e) => setFilterAssignee(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none bg-white cursor-pointer"
              >
                <option value="All">All Assignees</option>
                {users.map((user) => (
                  <option key={user.id} value={user.name}>
                    {user.name}
                  </option>
                ))}
                <option value="Unassigned">Unassigned</option>
              </select>
            </div>

            {/* Project Filter */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project
              </label>
              <select
                value={filterProject}
                onChange={(e) => setFilterProject(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none bg-white cursor-pointer"
              >
                <option value="All">All Projects</option>
                {projects.map((project) => (
                  <option key={project._id} value={project._id}>
                    {project.icon} {project.name} ({project.key})
                  </option>
                ))}
                <option value="Unassigned">No Project</option>
              </select>
            </div>

            {/* Completion Date Filter */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Completed
              </label>
              <select
                value={filterCompletedDate}
                onChange={(e) => setFilterCompletedDate(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none bg-white cursor-pointer"
              >
                <option value="All">All Dates</option>
                <option value="Today">Today</option>
                <option value="Yesterday">Yesterday</option>
                <option value="Last Week">Last Week</option>
                <option value="Unassigned">Not Completed</option>
              </select>
            </div>
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
        {isLoading ? (
          <div className="flex items-center justify-center p-12">
            <FaSpinner className="text-4xl text-indigo-600 animate-spin" />
          </div>
        ) : isError ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 rounded-2xl p-12 text-center shadow-md border border-red-200"
          >
            <FaExclamationCircle className="text-6xl text-red-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-red-800 mb-2">
              Error Loading Issues
            </h3>
            <p className="text-red-600 mb-6">
              {(error as any)?.data?.message || "Failed to load issues. Please try again."}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </motion.div>
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
                transition={{ duration: 0.5, delay: 0.3 }}
                className="mt-6"
              >
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  totalItems={filteredIssues.length}
                  itemsPerPage={itemsPerPage}
                  showFirstLast={true}
                  showPageNumbers={true}
                  maxPageButtons={5}
                  size="md"
                  variant="default"
                  showItemsInfo={true}
                />
              </motion.div>
            )}
          </>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title="Delete Issue"
        message="Are you sure you want to delete this issue? This action cannot be undone."
      />
    </PageLayout>
  );
};

export default Issues;