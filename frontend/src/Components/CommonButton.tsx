import React from "react";
import { motion } from "framer-motion";

interface CommonButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  icon?: React.ReactNode;
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "secondary" | "danger";
  fullWidth?: boolean;
  className?: string;
}

const variantStyles = {
  primary: "bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg",
  secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
  danger: "bg-red-600 text-white hover:bg-red-700 shadow-lg",
};

const CommonButton: React.FC<CommonButtonProps> = ({
  children,
  onClick,
  icon,
  type = "button",
  variant = "primary",
  fullWidth = false,
  className = "",
}) => {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`
  flex items-center justify-center gap-2
  px-8 py-3
  min-w-[240px]
  rounded-xl
  font-semibold
  transition-colors
  ${variantStyles[variant]}
  ${fullWidth ? "w-full" : ""}
  ${className}
`}
    >
      {icon && icon}
      {children}
    </motion.button>
  );
};

export default CommonButton;
