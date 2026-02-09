import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FaExclamationCircle,
  FaSpinner,
  FaPlus,
  FaSearch,
  FaFilter,
} from "react-icons/fa";
import DashboardCard from "../Components/Dashboardcard";
import IssueCard from "../Components/IssueCard";
import PageLayout from "../Layout/PageLayout";
import PageTitle from "../Components/PageTitle";
import { type Issue, type IssueStats } from "../types";

const Dashboard: React.FC = () => {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [stats, setStats] = useState<IssueStats>({
    open: 0,
    inProgress: 0,
    resolved: 0,
    closed: 0,
    total: 0,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [filterPriority, setFilterPriority] = useState<string>("All");

  // Fetch issues and calculate stats
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
      calculateStats(data.issues || []);
    } catch (error) {
      console.error("Error fetching issues:", error);
      // Mock data for development
      const mockIssues: Issue[] = [
        {
          id: 1,
          title: "Login page not responsive on mobile",
          description: "The login page layout breaks on mobile devices",
          status: "Open",
          priority: "High",
          severity: "Major",
          createdAt: "2026-02-05T10:30:00Z",
          updatedAt: "2026-02-05T10:30:00Z",
        },
        {
          id: 2,
          title: "Database connection timeout",
          description: "Users experiencing timeout errors",
          status: "In Progress",
          priority: "High",
          severity: "Critical",
          createdAt: "2026-02-04T14:20:00Z",
          updatedAt: "2026-02-06T09:15:00Z",
        },
        {
          id: 3,
          title: "Add export to CSV feature",
          description: "Users want to export issue lists",
          status: "Open",
          priority: "Medium",
          severity: "Minor",
          createdAt: "2026-02-03T16:45:00Z",
          updatedAt: "2026-02-03T16:45:00Z",
        },
        {
          id: 4,
          title: "Fix typo in dashboard title",
          description: "Spelling mistake in header",
          status: "Resolved",
          priority: "Low",
          severity: "Minor",
          createdAt: "2026-02-02T11:00:00Z",
          updatedAt: "2026-02-06T10:30:00Z",
        },
        {
          id: 5,
          title: "Performance issues on large datasets",
          description: "Application slows down with 1000+ issues",
          status: "In Progress",
          priority: "High",
          severity: "Major",
          createdAt: "2026-02-01T08:30:00Z",
          updatedAt: "2026-02-07T08:00:00Z",
        },
      ];
      setIssues(mockIssues);
      calculateStats(mockIssues);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (issueList: Issue[]) => {
    const stats: IssueStats = {
      open: issueList.filter((i) => i.status === "Open").length,
      inProgress: issueList.filter((i) => i.status === "In Progress").length,
      resolved: issueList.filter((i) => i.status === "Resolved").length,
      closed: issueList.filter((i) => i.status === "Closed").length,
      total: issueList.length,
    };
    setStats(stats);
  };

  // Filter issues based on search and filters
  const filteredIssues = issues.filter((issue) => {
    const matchesSearch =
      issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "All" || issue.status === filterStatus;
    const matchesPriority =
      filterPriority === "All" || issue.priority === filterPriority;
    return matchesSearch && matchesStatus && matchesPriority;
  });

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
            title="Dashboard"
            subtitle="Overview of all issues and their current status"
            textColor="text-white"
          />
          <Link to="/issues/new">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-colors"
            >
              <FaPlus /> Create Issue
            </motion.button>
          </Link>
        </motion.div>

        {/* Statistics Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4"
        >
          <DashboardCard
            title="Total"
            value={stats.total}
            variant="total"
          />

          <DashboardCard
            title="Open"
            value={stats.open}
            variant="open"
          />

          <DashboardCard
            title="In Progress"
            value={stats.inProgress}
            variant="inProgress"
          />

          <DashboardCard
            title="Resolved"
            value={stats.resolved}
            variant="resolved"
          />

          <DashboardCard
            title="Closed"
            value={stats.closed}
            variant="closed"
          />
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-2xl p-6 shadow-md"
        >
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search issues by title or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <FaFilter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="pl-12 pr-8 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none bg-white cursor-pointer min-w-[160px]"
              >
                <option value="All">All Status</option>
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
                <option value="Closed">Closed</option>
              </select>
            </div>

            {/* Priority Filter */}
            <div className="relative">
              <FaFilter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="pl-12 pr-8 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none bg-white cursor-pointer min-w-[160px]"
              >
                <option value="All">All Priority</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Recent Issues List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white rounded-2xl shadow-md overflow-hidden"
        >
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-800">Recent Issues</h2>
            <p className="text-gray-600 text-sm mt-1">
              Showing {filteredIssues.length} of {stats.total} issues
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center p-12">
              <FaSpinner className="text-4xl text-indigo-600 animate-spin" />
            </div>
          ) : filteredIssues.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 text-gray-500">
              <FaExclamationCircle className="text-6xl mb-4 text-gray-300" />
              <p className="text-lg font-medium">No issues found</p>
              <p className="text-sm mt-1">
                Try adjusting your search or filters
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredIssues.slice(0, 10).map((issue, index) => (
                <IssueCard key={issue.id} issue={issue} index={index} />
              ))}
            </div>
          )}

          {filteredIssues.length > 10 && (
            <div className="p-6 bg-gray-50 border-t border-gray-100 text-center">
              <Link
                to="/issues"
                className="text-indigo-600 hover:text-indigo-700 font-semibold"
              >
                View All Issues →
              </Link>
            </div>
          )}
        </motion.div>
      </div>
    </PageLayout>
  );
};

export default Dashboard;