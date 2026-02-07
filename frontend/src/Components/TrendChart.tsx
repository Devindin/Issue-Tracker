import React from "react";
import { Line } from "react-chartjs-2";
import type { ChartData, ChartOptions } from "chart.js";
import { FaChartLine } from "react-icons/fa";

interface TrendChartProps {
  data: ChartData<"line">;
  options?: ChartOptions<"line">;
  title?: string;
  subtitle?: string;
  height?: string;
}

const TrendChart: React.FC<TrendChartProps> = ({
  data,
  options,
  title = "Issues Trend",
  subtitle = "Created vs Resolved issues over time",
  height = "h-80",
}) => {
  const defaultOptions: ChartOptions<"line"> = {
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
    ...options,
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-md">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <FaChartLine className="text-indigo-600" />
            {title}
          </h2>
          <p className="text-gray-600 text-sm mt-1">
            {subtitle}
          </p>
        </div>
      </div>
      <div className={height}>
        <Line data={data} options={defaultOptions} />
      </div>
    </div>
  );
};

export default TrendChart;