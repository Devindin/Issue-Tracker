import React from "react";
import type { IconType } from "react-icons";

interface StatCardProps {
  title: string;
  value: string | number | React.ReactElement;
  subtitle?: string;
  icon: React.ReactElement<IconType>;
  accentColor: string;
  delay?: number;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  accentColor,
}) => {
  return (
    <div className={`bg-white rounded-2xl p-6 shadow-md border-l-4 ${accentColor}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium mb-1">
            {title}
          </p>
          <div className="text-3xl font-bold text-gray-800">
            {value}
          </div>
          {subtitle && (
            <p className="text-gray-500 text-xs mt-1">
              {subtitle}
            </p>
          )}
        </div>
        <div className="bg-gray-100 p-4 rounded-xl">
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatCard;