import React from "react";
import { Pie } from "react-chartjs-2";
import type { ChartData, ChartOptions } from "chart.js";
import { FaChartPie } from "react-icons/fa";

interface StatusChartProps {
  data: ChartData<"pie">;
  options?: ChartOptions<"pie">;
  title?: string;
  height?: string;
}

const StatusChart: React.FC<StatusChartProps> = ({
  data,
  options,
  title = "Status Distribution",
  height = "h-80",
}) => {
  const defaultOptions: ChartOptions<"pie"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right" as const,
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
      <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <FaChartPie className="text-indigo-600" />
        {title}
      </h2>
      <div className={height}>
        <Pie data={data} options={defaultOptions} />
      </div>
    </div>
  );
};

export default StatusChart;