import React from "react";
import {
  FaExclamationCircle,
  FaSpinner,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";
import type { IconType } from "react-icons";

export type CardVariant =
  | "total"
  | "open"
  | "inProgress"
  | "resolved"
  | "closed";

interface DashboardCardProps {
  title: string;
  value: number | string;
  variant: CardVariant;
  icon?: IconType;
  className?: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  value,
  variant,
  icon,
  className = "",
}) => {
  // Define styles based on variant
  const getVariantStyles = () => {
    switch (variant) {
      case "total":
        return {
          container: "bg-gradient-to-br from-[#0A3D91] to-[#1976D2] text-white shadow-lg",
          title: "text-[#1976D2] text-sm font-medium",
          value: "text-4xl font-bold mt-2 text-white",
          icon: "text-5xl text-[#1976D2] opacity-50",
        };
      case "open":
        return {
          container: "bg-white rounded-2xl p-6 shadow-md border border-[#1976D2]/20 hover:shadow-lg transition-shadow",
          title: "text-gray-600 text-sm font-medium",
          value: "text-4xl font-bold text-[#1976D2] mt-2",
          icon: "text-5xl text-[#1976D2] opacity-70",
        };
      case "inProgress":
        return {
          container: "bg-white rounded-2xl p-6 shadow-md border border-yellow-100 hover:shadow-lg transition-shadow",
          title: "text-gray-600 text-sm font-medium",
          value: "text-4xl font-bold text-yellow-600 mt-2",
          icon: "text-5xl text-yellow-200",
        };
      case "resolved":
        return {
          container: "bg-white rounded-2xl p-6 shadow-md border border-green-100 hover:shadow-lg transition-shadow",
          title: "text-gray-600 text-sm font-medium",
          value: "text-4xl font-bold text-green-600 mt-2",
          icon: "text-5xl text-green-200",
        };
      case "closed":
        return {
          container: "bg-white rounded-2xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow",
          title: "text-gray-600 text-sm font-medium",
          value: "text-4xl font-bold text-gray-600 mt-2",
          icon: "text-5xl text-gray-200",
        };
      default:
        return {
          container: "bg-white rounded-2xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow",
          title: "text-gray-600 text-sm font-medium",
          value: "text-4xl font-bold text-gray-600 mt-2",
          icon: "text-5xl text-gray-200",
        };
    }
  };

  // Get default icon based on variant
  const getDefaultIcon = (): IconType => {
    switch (variant) {
      case "total":
      case "open":
        return FaExclamationCircle;
      case "inProgress":
        return FaSpinner;
      case "resolved":
        return FaCheckCircle;
      case "closed":
        return FaTimesCircle;
      default:
        return FaExclamationCircle;
    }
  };

  const styles = getVariantStyles();
  const IconComponent = icon || getDefaultIcon();

  return (
    <div className={`${styles.container} ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className={styles.title}>{title}</p>
          <h3 className={styles.value}>{value}</h3>
        </div>
        <IconComponent className={styles.icon} />
      </div>
    </div>
  );
};

export default DashboardCard;