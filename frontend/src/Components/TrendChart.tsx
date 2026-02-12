import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import type { ChartData, ChartOptions } from "chart.js";
import { FaChartLine, FaExclamationCircle } from "react-icons/fa";

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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      // Validate data structure
      console.log("TrendChart - Validating data:", data);
      
      if (!data) {
        setError("No data object provided");
        return;
      }

      if (!data.datasets || data.datasets.length === 0) {
        setError("No datasets in data object");
        console.error("Datasets:", data.datasets);
        return;
      }

      if (!data.labels || data.labels.length === 0) {
        setError(`No labels available. Expected labels array, got: ${JSON.stringify(data.labels)}`);
        console.error("Labels:", data.labels);
        console.error("Full data object:", data);
        return;
      }

      const dataset = data.datasets[0];
      if (!dataset.data || dataset.data.length === 0) {
        setError("No data points in dataset");
        console.error("Dataset data:", dataset.data);
        return;
      }

      console.log("TrendChart - Data validated successfully");
      console.log("Labels count:", data.labels.length);
      console.log("Data points count:", dataset.data.length);
      setError(null);
    } catch (err: any) {
      const errorMsg = err?.message || "Error loading chart data";
      setError(errorMsg);
      console.error("TrendChart validation error:", err);
    }
  }, [data]);

  if (error) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-md h-full">
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
        <div className={`${height} flex flex-col items-center justify-center gap-4`}>
          <FaExclamationCircle className="text-4xl text-red-500" />
          <p className="text-red-600 font-semibold text-center">{error}</p>
          <p className="text-gray-500 text-sm text-center">Please check your data</p>
        </div>
      </div>
    );
  }

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
          usePointStyle: true,
          pointStyle: "circle",
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        padding: 12,
        titleFont: {
          size: 14,
          weight: "bold",
        },
        bodyFont: {
          size: 13,
        },
        callbacks: {
          label: function(context) {
            return context.dataset.label + ": " + context.parsed.y;
          }
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
    ...options,
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-md h-full">
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
      <div className={`${height} flex items-center justify-center`}>
        <Line data={data} options={defaultOptions} />
      </div>
    </div>
  );
};

export default TrendChart;