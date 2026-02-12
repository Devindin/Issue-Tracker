import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../app/stores";
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

import {
  useGetDashboardStatsQuery,
  useGetRecentIssuesQuery,
} from "../features/dashboard/dashboardApi";

import {
  setSearchTerm,
  setFilterStatus,
  setFilterPriority,
} from "../features/issues/issuesFilterSlice";

import StatusChart from "../Components/StatusChart";
import TrendChart from "../Components/TrendChart";

import type { ChartData } from "chart.js";
import { useGetIssueAnalyticsQuery } from "../features/issues/issueApi";

const Dashboard: React.FC = () => {
  const dispatch = useDispatch();

  const { searchTerm, filterStatus, filterPriority } = useSelector(
    (state: RootState) => state.issuesFilter,
  );

  // Dashboard Stats

  const {
    data: statsData,
    isLoading: statsLoading,
    isError: statsError,
  } = useGetDashboardStatsQuery();

  const stats = statsData?.stats || {
    open: 0,
    inProgress: 0,
    resolved: 0,
    closed: 0,
    total: 0,
  };

  // ============================
  // Recent Issues
  // ============================
  const {
    data: issuesData,
    isLoading: issuesLoading,
    isError: issuesError,
  } = useGetRecentIssuesQuery({ limit: 5 });

  const issues = issuesData?.issues || [];

  // ============================
  // Analytics (Charts)
  // ============================
  const {
    data: analyticsData,
    isLoading: analyticsLoading,
    isError: analyticsError,
  } = useGetIssueAnalyticsQuery();

  // Combined Loading & Error
  const isLoading = statsLoading || issuesLoading || analyticsLoading;
  const isError = statsError || issuesError || analyticsError;

  // Filter Issues
  
  const filteredIssues = issues.filter((issue: any) => {
    const matchesSearch =
      issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "All" || issue.status === filterStatus;

    const matchesPriority =
      filterPriority === "All" || issue.priority === filterPriority;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  // ============================
  // Chart Data
  // ============================

  const statusChartData: ChartData<"doughnut"> = {
    labels: analyticsData?.statusStats?.map((item: any) => item._id) || [],
    datasets: [
      {
        label: "Issues by Status",
        data: analyticsData?.statusStats?.map((item: any) => item.count) || [],
        backgroundColor: ["#6366F1", "#F59E0B", "#10B981", "#EF4444"],
      },
    ],
  };

  const trendChartData: ChartData<"bar"> = {
    labels: ["Open", "In Progress", "Resolved", "Closed"],
    datasets: [
      {
        label: "Issues",
        data: [stats.open, stats.inProgress, stats.resolved, stats.closed],
        backgroundColor: "#6366F1",
      },
    ],
  };

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
              className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold shadow-lg hover:bg-indigo-700 transition-colors"
            >
              <FaPlus /> Create Issue
            </motion.button>
          </Link>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4"
        >
          <DashboardCard title="Total" value={stats.total} variant="total" />
          <DashboardCard title="Open" value={stats.open} variant="open" />
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
          <DashboardCard title="Closed" value={stats.closed} variant="closed" />
        </motion.div>

        {/* Charts */}
        {/* Charts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {analyticsLoading ? (
            <div className="col-span-2 flex justify-center p-12">
              <FaSpinner className="text-4xl animate-spin text-indigo-600" />
            </div>
          ) : analyticsError ? (
            <div className="col-span-2 flex flex-col items-center p-12 text-red-500">
              <FaExclamationCircle className="text-5xl mb-4" />
              Error loading analytics
            </div>
          ) : (
            <>
              <StatusChart data={statusChartData} />
              <TrendChart data={trendChartData} />
            </>
          )}
        </motion.div>

        {/* Recent Issues */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white rounded-2xl shadow-md overflow-hidden"
        >
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold">Recent Issues</h2>
            <p className="text-sm text-gray-500">
              Showing {filteredIssues.length} of {stats.total}
            </p>
          </div>

          {isLoading ? (
            <div className="flex justify-center p-12">
              <FaSpinner className="text-4xl animate-spin text-indigo-600" />
            </div>
          ) : isError ? (
            <div className="flex flex-col items-center p-12 text-red-500">
              <FaExclamationCircle className="text-5xl mb-4" />
              Error loading issues
            </div>
          ) : filteredIssues.length === 0 ? (
            <div className="flex flex-col items-center p-12 text-gray-500">
              No issues found
            </div>
          ) : (
            <div className="divide-y">
              {filteredIssues.map((issue: any, index: number) => (
                <IssueCard key={issue.id} issue={issue} index={index} />
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </PageLayout>
  );
};

export default Dashboard;
