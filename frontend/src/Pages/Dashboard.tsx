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
import CommonButton from "../Components/CommonButton";

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
import ChartErrorBoundary from "../Components/ChartErrorBoundary";

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
    error: statsErrorMsg,
  } = useGetDashboardStatsQuery();

  const stats = statsData?.stats || {
    open: 0,
    inProgress: 0,
    resolved: 0,
    closed: 0,
    total: 0,
  };

  // Recent Issues
  const {
    data: issuesData,
    isLoading: issuesLoading,
    isError: issuesError,
    error: issuesErrorMsg,
  } = useGetRecentIssuesQuery({ limit: 5 });

  const issues = issuesData?.issues || [];

  // Analytics (Charts)
  const {
    data: analyticsData,
    isLoading: analyticsLoading,
    isError: analyticsError,
    error: analyticsErrorMsg,
  } = useGetIssueAnalyticsQuery();

  // Log errors for debugging
  React.useEffect(() => {
    if (statsError) console.error("Stats Error:", statsErrorMsg);
    if (issuesError) console.error("Issues Error:", issuesErrorMsg);
    if (analyticsError) console.error("Analytics Error:", analyticsErrorMsg);
  }, [statsError, issuesError, analyticsError, statsErrorMsg, issuesErrorMsg, analyticsErrorMsg]);

  // Debug analytics data
  React.useEffect(() => {
    console.log("Analytics Data:", analyticsData);
    console.log("Status Stats:", analyticsData?.statusStats);
    console.log("Stats:", stats);
  }, [analyticsData, stats]);

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

  // Chart Data

  // Status chart with safe data handling
  const statusLabels = analyticsData?.statusStats && Array.isArray(analyticsData.statusStats) && analyticsData.statusStats.length > 0
    ? analyticsData.statusStats.map((item: any) => item._id || "Unknown")
    : ["Open", "In Progress", "Resolved", "Closed"];

  const statusData = analyticsData?.statusStats && Array.isArray(analyticsData.statusStats) && analyticsData.statusStats.length > 0
    ? analyticsData.statusStats.map((item: any) => item.count || 0)
    : [0, 0, 0, 0];

  console.log("Status Labels:", statusLabels);
  console.log("Status Data:", statusData);

  const statusChartData: ChartData<"pie"> = {
    labels: statusLabels,
    datasets: [
      {
        label: "Issues by Status",
        data: statusData,
        backgroundColor: ["#6366F1", "#F59E0B", "#10B981", "#EF4444"],
        borderColor: "#fff",
        borderWidth: 2,
      },
    ],
  };

  const trendChartData: ChartData<"line"> = {
    labels: ["Open", "In Progress", "Resolved", "Closed"],
    datasets: [
      {
        label: "Issues",
        data: [stats.open, stats.inProgress, stats.resolved, stats.closed],
        backgroundColor: "#6366F1",
        borderColor: "#6366F1",
        fill: false,
        tension: 0.3,
        borderWidth: 2,
        pointRadius: 5,
        pointBackgroundColor: "#6366F1",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointHoverRadius: 7,
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
            <CommonButton icon={<FaPlus />}>Create Issue</CommonButton>
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
         className="grid grid-cols-1 gap-6"

        >
          {analyticsLoading ? (
            <div className="col-span-2 flex justify-center p-12">
              <FaSpinner className="text-4xl animate-spin text-indigo-600" />
            </div>
          ) : analyticsError ? (
            <div className="  items-center p-12 text-red-500 bg-red-50 rounded-2xl">
              <FaExclamationCircle className="text-5xl mb-4" />
              <p className="font-semibold mb-2">Error loading analytics</p>
              <p className="text-sm text-red-600">{String(analyticsErrorMsg || "Please try refreshing the page")}</p>
            </div>
          ) : (
            <>
              <ChartErrorBoundary chartName="Trend Chart">
                <TrendChart data={trendChartData} />
              </ChartErrorBoundary>
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
