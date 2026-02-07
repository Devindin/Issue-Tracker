import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaChartBar,
  FaChartPie,
  FaChartLine,
  FaDownload,
  FaSpinner,
  FaCalendarAlt,
  FaExclamationCircle,
  FaClock,
  FaCheckCircle,
  FaArrowUp,
  FaArrowDown,
  FaEquals,
} from "react-icons/fa";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler,
} from "chart.js";
import { Bar, Pie, Line } from "react-chartjs-2";
import PageLayout from "../Layout/PageLayout";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler
);

// Types
interface Issue {
  id: number;
  title: string;
  status: "Open" | "In Progress" | "Resolved" | "Closed";
  priority: "Low" | "Medium" | "High" | "Critical";
  severity: "Minor" | "Major" | "Critical";
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
}

interface ReportStats {
  totalIssues: number;
  openIssues: number;
  inProgressIssues: number;
  resolvedIssues: number;
  closedIssues: number;
  avgResolutionTime: number; // in hours
  criticalIssues: number;
  issuesThisWeek: number;
  issuesThisMonth: number;
  resolutionRate: number; // percentage
}

interface TrendData {
  labels: string[];
  created: number[];
  resolved: number[];
}

const Reports: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [stats, setStats] = useState<ReportStats | null>(null);
  const [trendData, setTrendData] = useState<TrendData | null>(null);
  const [dateRange, setDateRange] = useState<string>("7"); // days

  useEffect(() => {
    fetchReportData();
  }, [dateRange]);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      await fetch(
        `/api/issues/reports?days=${dateRange}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      // Mock data for development
      const mockIssues: Issue[] = generateMockIssues();
      setIssues(mockIssues);

      const calculatedStats = calculateStats(mockIssues);
      setStats(calculatedStats);

      const trend = calculateTrendData(mockIssues, parseInt(dateRange));
      setTrendData(trend);
    } catch (error) {
      console.error("Error fetching report data:", error);
      // Use mock data on error
      const mockIssues = generateMockIssues();
      setIssues(mockIssues);
      setStats(calculateStats(mockIssues));
      setTrendData(calculateTrendData(mockIssues, parseInt(dateRange)));
    } finally {
      setLoading(false);
    }
  };

  // Generate mock issues for development
  const generateMockIssues = (): Issue[] => {
    const statuses: ("Open" | "In Progress" | "Resolved" | "Closed")[] = [
      "Open",
      "In Progress",
      "Resolved",
      "Closed",
    ];
    const priorities: ("Low" | "Medium" | "High" | "Critical")[] = [
      "Low",
      "Medium",
      "High",
      "Critical",
    ];
    const severities: ("Minor" | "Major" | "Critical")[] = [
      "Minor",
      "Major",
      "Critical",
    ];

    const mockData: Issue[] = [];
    const now = new Date();

    for (let i = 1; i <= 50; i++) {
      const daysAgo = Math.floor(Math.random() * 30);
      const createdDate = new Date(now);
      createdDate.setDate(createdDate.getDate() - daysAgo);

      const status = statuses[Math.floor(Math.random() * statuses.length)];
      let resolvedAt: string | undefined = undefined;

      if (status === "Resolved" || status === "Closed") {
        const resolvedDate = new Date(createdDate);
        resolvedDate.setHours(
          resolvedDate.getHours() + Math.floor(Math.random() * 72) + 1
        );
        resolvedAt = resolvedDate.toISOString();
      }

      mockData.push({
        id: i,
        title: `Issue ${i}`,
        status,
        priority: priorities[Math.floor(Math.random() * priorities.length)],
        severity: severities[Math.floor(Math.random() * severities.length)],
        createdAt: createdDate.toISOString(),
        updatedAt: createdDate.toISOString(),
        resolvedAt,
      });
    }

    return mockData;
  };

  // Calculate statistics
  const calculateStats = (issueList: Issue[]): ReportStats => {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const openIssues = issueList.filter((i) => i.status === "Open").length;
    const inProgressIssues = issueList.filter(
      (i) => i.status === "In Progress"
    ).length;
    const resolvedIssues = issueList.filter(
      (i) => i.status === "Resolved"
    ).length;
    const closedIssues = issueList.filter((i) => i.status === "Closed").length;

    const criticalIssues = issueList.filter(
      (i) => i.priority === "Critical" && i.status !== "Resolved" && i.status !== "Closed"
    ).length;

    const issuesThisWeek = issueList.filter(
      (i) => new Date(i.createdAt) >= weekAgo
    ).length;

    const issuesThisMonth = issueList.filter(
      (i) => new Date(i.createdAt) >= monthAgo
    ).length;

    // Calculate average resolution time
    const resolvedIssuesWithTime = issueList.filter(
      (i) => i.resolvedAt && i.createdAt
    );
    const totalResolutionTime = resolvedIssuesWithTime.reduce((acc, issue) => {
      const created = new Date(issue.createdAt).getTime();
      const resolved = new Date(issue.resolvedAt!).getTime();
      return acc + (resolved - created);
    }, 0);

    const avgResolutionTime =
      resolvedIssuesWithTime.length > 0
        ? totalResolutionTime / resolvedIssuesWithTime.length / (1000 * 60 * 60)
        : 0;

    const resolutionRate =
      issueList.length > 0
        ? ((resolvedIssues + closedIssues) / issueList.length) * 100
        : 0;

    return {
      totalIssues: issueList.length,
      openIssues,
      inProgressIssues,
      resolvedIssues,
      closedIssues,
      avgResolutionTime,
      criticalIssues,
      issuesThisWeek,
      issuesThisMonth,
      resolutionRate,
    };
  };

  // Calculate trend data for charts
  const calculateTrendData = (
    issueList: Issue[],
    days: number
  ): TrendData => {
    const labels: string[] = [];
    const created: number[] = [];
    const resolved: number[] = [];

    const now = new Date();

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);

      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      const label =
        days <= 7
          ? date.toLocaleDateString("en-US", { weekday: "short" })
          : date.toLocaleDateString("en-US", { month: "short", day: "numeric" });

      labels.push(label);

      const createdCount = issueList.filter((issue) => {
        const issueDate = new Date(issue.createdAt);
        return issueDate >= date && issueDate < nextDate;
      }).length;

      const resolvedCount = issueList.filter((issue) => {
        if (!issue.resolvedAt) return false;
        const resolvedDate = new Date(issue.resolvedAt);
        return resolvedDate >= date && resolvedDate < nextDate;
      }).length;

      created.push(createdCount);
      resolved.push(resolvedCount);
    }

    return { labels, created, resolved };
  };

  // Chart configurations
  const statusChartData = {
    labels: ["Open", "In Progress", "Resolved", "Closed"],
    datasets: [
      {
        label: "Issues by Status",
        data: [
          stats?.openIssues || 0,
          stats?.inProgressIssues || 0,
          stats?.resolvedIssues || 0,
          stats?.closedIssues || 0,
        ],
        backgroundColor: [
          "rgba(59, 130, 246, 0.8)", // Blue
          "rgba(234, 179, 8, 0.8)", // Yellow
          "rgba(34, 197, 94, 0.8)", // Green
          "rgba(156, 163, 175, 0.8)", // Gray
        ],
        borderColor: [
          "rgb(59, 130, 246)",
          "rgb(234, 179, 8)",
          "rgb(34, 197, 94)",
          "rgb(156, 163, 175)",
        ],
        borderWidth: 2,
      },
    ],
  };

  const priorityChartData = {
    labels: ["Low", "Medium", "High", "Critical"],
    datasets: [
      {
        label: "Issues by Priority",
        data: [
          issues.filter((i) => i.priority === "Low").length,
          issues.filter((i) => i.priority === "Medium").length,
          issues.filter((i) => i.priority === "High").length,
          issues.filter((i) => i.priority === "Critical").length,
        ],
        backgroundColor: [
          "rgba(156, 163, 175, 0.8)", // Gray
          "rgba(249, 115, 22, 0.8)", // Orange
          "rgba(239, 68, 68, 0.8)", // Red
          "rgba(168, 85, 247, 0.8)", // Purple
        ],
        borderColor: [
          "rgb(156, 163, 175)",
          "rgb(249, 115, 22)",
          "rgb(239, 68, 68)",
          "rgb(168, 85, 247)",
        ],
        borderWidth: 2,
      },
    ],
  };

  const trendChartData = {
    labels: trendData?.labels || [],
    datasets: [
      {
        label: "Created",
        data: trendData?.created || [],
        borderColor: "rgb(99, 102, 241)",
        backgroundColor: "rgba(99, 102, 241, 0.1)",
        tension: 0.4,
        fill: true,
      },
      {
        label: "Resolved",
        data: trendData?.resolved || [],
        borderColor: "rgb(34, 197, 94)",
        backgroundColor: "rgba(34, 197, 94, 0.1)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          padding: 15,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        padding: 12,
        titleFont: {
          size: 14,
        },
        bodyFont: {
          size: 13,
        },
      },
    },
  };

  const pieChartOptions = {
    ...chartOptions,
    plugins: {
      ...chartOptions.plugins,
      legend: {
        ...chartOptions.plugins.legend,
        position: "right" as const,
      },
    },
  };

  // Export report as PDF (placeholder)
  const exportReport = () => {
    // TODO: Implement PDF export functionality
    alert("Export functionality will be implemented with a PDF library like jsPDF");
  };

  // Calculate trend indicator
  const getTrendIndicator = () => {
    if (!trendData || trendData.created.length < 2) return null;

    const recent = trendData.created.slice(-3).reduce((a, b) => a + b, 0);
    const previous = trendData.created.slice(-6, -3).reduce((a, b) => a + b, 0);

    if (recent > previous) {
      return { icon: <FaArrowUp />, color: "text-red-500", text: "Increasing" };
    } else if (recent < previous) {
      return { icon: <FaArrowDown />, color: "text-green-500", text: "Decreasing" };
    } else {
      return { icon: <FaEquals />, color: "text-gray-500", text: "Stable" };
    }
  };

  const trendIndicator = getTrendIndicator();

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
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
              Reports & Analytics
            </h1>
            <p className="text-gray-600 mt-1">
              Comprehensive insights into your issue tracking performance
            </p>
          </div>
          <div className="flex gap-3">
            {/* Date Range Selector */}
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none cursor-pointer"
            >
              <option value="7">Last 7 Days</option>
              <option value="14">Last 14 Days</option>
              <option value="30">Last 30 Days</option>
              <option value="90">Last 90 Days</option>
            </select>

            {/* Export Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={exportReport}
              className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-colors"
            >
              <FaDownload /> Export Report
            </motion.button>
          </div>
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center p-12">
            <FaSpinner className="text-4xl text-indigo-600 animate-spin" />
          </div>
        ) : (
          <>
            {/* Key Metrics Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
            >
              {/* Total Issues */}
              <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl p-6 text-white shadow-lg">
                <div className="flex items-center justify-between mb-2">
                  <FaChartBar className="text-3xl opacity-80" />
                  <span className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full">
                    Total
                  </span>
                </div>
                <h3 className="text-4xl font-bold mb-1">{stats?.totalIssues}</h3>
                <p className="text-indigo-100 text-sm">Total Issues</p>
              </div>

              {/* Open Issues */}
              <div className="bg-white rounded-2xl p-6 shadow-md border border-blue-100">
                <div className="flex items-center justify-between mb-2">
                  <FaExclamationCircle className="text-3xl text-blue-500" />
                  <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
                    Active
                  </span>
                </div>
                <h3 className="text-4xl font-bold text-gray-800 mb-1">
                  {stats?.openIssues}
                </h3>
                <p className="text-gray-600 text-sm">Open Issues</p>
              </div>

              {/* Resolution Rate */}
              <div className="bg-white rounded-2xl p-6 shadow-md border border-green-100">
                <div className="flex items-center justify-between mb-2">
                  <FaCheckCircle className="text-3xl text-green-500" />
                  <span className="text-xs font-semibold text-green-600 bg-green-100 px-3 py-1 rounded-full">
                    Rate
                  </span>
                </div>
                <h3 className="text-4xl font-bold text-gray-800 mb-1">
                  {stats?.resolutionRate.toFixed(0)}%
                </h3>
                <p className="text-gray-600 text-sm">Resolution Rate</p>
              </div>

              {/* Avg Resolution Time */}
              <div className="bg-white rounded-2xl p-6 shadow-md border border-purple-100">
                <div className="flex items-center justify-between mb-2">
                  <FaClock className="text-3xl text-purple-500" />
                  <span className="text-xs font-semibold text-purple-600 bg-purple-100 px-3 py-1 rounded-full">
                    Time
                  </span>
                </div>
                <h3 className="text-4xl font-bold text-gray-800 mb-1">
                  {stats?.avgResolutionTime.toFixed(0)}h
                </h3>
                <p className="text-gray-600 text-sm">Avg Resolution Time</p>
              </div>
            </motion.div>

            {/* Additional Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              {/* Critical Issues */}
              <div className="bg-white rounded-2xl p-6 shadow-md border-l-4 border-red-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium mb-1">
                      Critical Issues
                    </p>
                    <h4 className="text-3xl font-bold text-gray-800">
                      {stats?.criticalIssues}
                    </h4>
                  </div>
                  <div className="bg-red-100 p-4 rounded-xl">
                    <FaExclamationCircle className="text-2xl text-red-600" />
                  </div>
                </div>
              </div>

              {/* Issues This Week */}
              <div className="bg-white rounded-2xl p-6 shadow-md border-l-4 border-blue-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium mb-1">
                      Issues This Week
                    </p>
                    <h4 className="text-3xl font-bold text-gray-800">
                      {stats?.issuesThisWeek}
                    </h4>
                  </div>
                  <div className="bg-blue-100 p-4 rounded-xl">
                    <FaCalendarAlt className="text-2xl text-blue-600" />
                  </div>
                </div>
              </div>

              {/* Trend Indicator */}
              <div className="bg-white rounded-2xl p-6 shadow-md border-l-4 border-indigo-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium mb-1">
                      Issue Trend
                    </p>
                    <h4 className={`text-3xl font-bold flex items-center gap-2 ${trendIndicator?.color || "text-gray-800"}`}>
                      {trendIndicator?.icon}
                      {trendIndicator?.text}
                    </h4>
                  </div>
                  <div className="bg-indigo-100 p-4 rounded-xl">
                    <FaChartLine className="text-2xl text-indigo-600" />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Trend Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white rounded-2xl p-6 shadow-md"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <FaChartLine className="text-indigo-600" />
                    Issues Trend
                  </h2>
                  <p className="text-gray-600 text-sm mt-1">
                    Created vs Resolved issues over time
                  </p>
                </div>
              </div>
              <div className="h-80">
                <Line data={trendChartData} options={chartOptions} />
              </div>
            </motion.div>

            {/* Status and Priority Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Status Distribution */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="bg-white rounded-2xl p-6 shadow-md"
              >
                <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <FaChartPie className="text-indigo-600" />
                  Status Distribution
                </h2>
                <div className="h-80">
                  <Pie data={statusChartData} options={pieChartOptions} />
                </div>
              </motion.div>

              {/* Priority Distribution */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="bg-white rounded-2xl p-6 shadow-md"
              >
                <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <FaChartBar className="text-indigo-600" />
                  Priority Distribution
                </h2>
                <div className="h-80">
                  <Bar
                    data={priorityChartData}
                    options={{
                      ...chartOptions,
                      scales: {
                        y: {
                          beginAtZero: true,
                          ticks: {
                            stepSize: 1,
                          },
                        },
                      },
                    }}
                  />
                </div>
              </motion.div>
            </div>

            {/* Summary Table */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="bg-white rounded-2xl shadow-md overflow-hidden"
            >
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-bold text-gray-800">
                  Summary Overview
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                        Metric
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                        Value
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                        Description
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-gray-800">
                        Total Issues
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 font-semibold">
                        {stats?.totalIssues}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        All issues in the system
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-gray-800">
                        Open Issues
                      </td>
                      <td className="px-6 py-4 text-sm text-blue-600 font-semibold">
                        {stats?.openIssues}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        Issues waiting to be addressed
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-gray-800">
                        In Progress
                      </td>
                      <td className="px-6 py-4 text-sm text-yellow-600 font-semibold">
                        {stats?.inProgressIssues}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        Issues currently being worked on
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-gray-800">
                        Resolved
                      </td>
                      <td className="px-6 py-4 text-sm text-green-600 font-semibold">
                        {stats?.resolvedIssues}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        Issues that have been resolved
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-gray-800">
                        Resolution Rate
                      </td>
                      <td className="px-6 py-4 text-sm text-green-600 font-semibold">
                        {stats?.resolutionRate.toFixed(1)}%
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        Percentage of resolved/closed issues
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-gray-800">
                        Avg Resolution Time
                      </td>
                      <td className="px-6 py-4 text-sm text-purple-600 font-semibold">
                        {stats?.avgResolutionTime.toFixed(1)} hours
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        Average time to resolve an issue
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-gray-800">
                        Critical Issues
                      </td>
                      <td className="px-6 py-4 text-sm text-red-600 font-semibold">
                        {stats?.criticalIssues}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        Unresolved critical priority issues
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-gray-800">
                        Issues This Week
                      </td>
                      <td className="px-6 py-4 text-sm text-indigo-600 font-semibold">
                        {stats?.issuesThisWeek}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        New issues in the last 7 days
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-gray-800">
                        Issues This Month
                      </td>
                      <td className="px-6 py-4 text-sm text-indigo-600 font-semibold">
                        {stats?.issuesThisMonth}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        New issues in the last 30 days
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </motion.div>
          </>
        )}
      </div>
    </PageLayout>
  );
};

export default Reports;