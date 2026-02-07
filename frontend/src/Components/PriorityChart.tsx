import React from "react";
import { Bar } from "react-chartjs-2";
import type { ChartData, ChartOptions } from "chart.js";
import { FaChartBar } from "react-icons/fa";

interface PriorityChartProps {
  data: ChartData<"bar">;
  options?: ChartOptions<"bar">;
  title?: string;
  height?: string;
}

const PriorityChart: React.FC<PriorityChartProps> = ({
  data,
  options,
  title = "Priority Distribution",
  height = "h-80",
}) => {
  const defaultOptions: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
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
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
      x: {
        ticks: {
          font: {
            size: 12,
          },
        },
      },
    },
    ...options,
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-md">
      <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <FaChartBar className="text-indigo-600" />
        {title}
      </h2>
      <div className={height}>
        <Bar data={data} options={defaultOptions} />
      </div>
    </div>
  );
};

export default PriorityChart;