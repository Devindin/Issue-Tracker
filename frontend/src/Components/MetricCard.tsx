import React from "react";
import type { IconType } from "react-icons";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: React.ReactElement<IconType>;
  badge?: string;
  badgeColor?: string;
  gradient?: boolean;
  delay?: number;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  icon,
  badge,
  badgeColor = "bg-white/20",
  gradient = false,
}) => {
  const cardClasses = gradient
    ? "bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl p-6 text-white shadow-lg"
    : "bg-white rounded-2xl p-6 shadow-md border border-gray-100";

  const iconClasses = gradient
    ? "text-3xl opacity-80"
    : "text-3xl text-gray-600";

  const titleClasses = gradient
    ? "text-indigo-100 text-sm"
    : "text-gray-600 text-sm";

  const valueClasses = gradient
    ? "text-4xl font-bold mb-1"
    : "text-4xl font-bold text-gray-800 mb-1";

  return (
    <div className={cardClasses}>
      <div className="flex items-center justify-between mb-2">
        <div className={iconClasses}>{icon}</div>
        {badge && (
          <span className={`text-sm font-medium ${badgeColor} px-3 py-1 rounded-full`}>
            {badge}
          </span>
        )}
      </div>
      <h3 className={valueClasses}>{value}</h3>
      <p className={titleClasses}>{title}</p>
    </div>
  );
};

export default MetricCard;