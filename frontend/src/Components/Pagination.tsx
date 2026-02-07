import React from "react";
import { motion } from "framer-motion";
import {
  FaChevronLeft,
  FaChevronRight,
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
} from "react-icons/fa";

// Types
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems?: number;
  itemsPerPage?: number;
  showFirstLast?: boolean;
  showPageNumbers?: boolean;
  maxPageButtons?: number;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "rounded" | "pills";
  showItemsInfo?: boolean;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage,
  showFirstLast = true,
  showPageNumbers = true,
  maxPageButtons = 5,
  size = "md",
  variant = "default",
  showItemsInfo = true,
}) => {
  // Calculate visible page range
  const getPageNumbers = (): (number | string)[] => {
    const pages: (number | string)[] = [];

    if (totalPages <= maxPageButtons) {
      // Show all pages if total is less than max
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Calculate start and end of visible range
      let startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
      let endPage = startPage + maxPageButtons - 1;

      if (endPage > totalPages) {
        endPage = totalPages;
        startPage = Math.max(1, endPage - maxPageButtons + 1);
      }

      // Add first page
      if (startPage > 1) {
        pages.push(1);
        if (startPage > 2) {
          pages.push("...");
        }
      }

      // Add page numbers in range
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      // Add last page
      if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
          pages.push("...");
        }
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  // Calculate items info
  const getItemsInfo = (): string => {
    if (!totalItems || !itemsPerPage) return "";

    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    return `Showing ${startItem}-${endItem} of ${totalItems}`;
  };

  // Size classes
  const sizeClasses = {
    sm: "text-xs px-2 py-1",
    md: "text-sm px-3 py-2",
    lg: "text-base px-4 py-3",
  };

  const iconSizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  // Variant classes
  const getButtonClasses = (isActive: boolean, isDisabled: boolean) => {
    const baseClasses = `${sizeClasses[size]} font-medium transition-all duration-200 flex items-center justify-center min-w-[40px]`;

    if (isDisabled) {
      return `${baseClasses} opacity-50 cursor-not-allowed bg-gray-100 text-gray-400`;
    }

    if (variant === "rounded") {
      return `${baseClasses} rounded-lg ${
        isActive
          ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200"
          : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
      }`;
    }

    if (variant === "pills") {
      return `${baseClasses} rounded-full ${
        isActive
          ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200"
          : "bg-white text-gray-700 hover:bg-indigo-50 border border-gray-300"
      }`;
    }

    // Default variant
    return `${baseClasses} rounded-lg ${
      isActive
        ? "bg-indigo-600 text-white shadow-md"
        : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
    }`;
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
    }
  };

  // Don't render if only one page
  if (totalPages <= 1) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col sm:flex-row items-center justify-between gap-4"
    >
      {/* Items Info */}
      {showItemsInfo && totalItems && itemsPerPage && (
        <div className="text-sm text-gray-600 font-medium">
          {getItemsInfo()}
        </div>
      )}

      {/* Pagination Controls */}
      <div className="flex items-center gap-2">
        {/* First Page Button */}
        {showFirstLast && (
          <motion.button
            whileHover={{ scale: currentPage === 1 ? 1 : 1.05 }}
            whileTap={{ scale: currentPage === 1 ? 1 : 0.95 }}
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
            className={getButtonClasses(false, currentPage === 1)}
            aria-label="First page"
          >
            <FaAngleDoubleLeft className={iconSizeClasses[size]} />
          </motion.button>
        )}

        {/* Previous Button */}
        <motion.button
          whileHover={{ scale: currentPage === 1 ? 1 : 1.05 }}
          whileTap={{ scale: currentPage === 1 ? 1 : 0.95 }}
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={getButtonClasses(false, currentPage === 1)}
          aria-label="Previous page"
        >
          <FaChevronLeft className={iconSizeClasses[size]} />
          {size === "lg" && <span className="ml-2 hidden sm:inline">Previous</span>}
        </motion.button>

        {/* Page Numbers */}
        {showPageNumbers && (
          <div className="flex items-center gap-2">
            {pageNumbers.map((page, index) => {
              if (page === "...") {
                return (
                  <span
                    key={`ellipsis-${index}`}
                    className="px-2 text-gray-500"
                  >
                    ...
                  </span>
                );
              }

              const pageNumber = page as number;
              const isActive = pageNumber === currentPage;

              return (
                <motion.button
                  key={pageNumber}
                  whileHover={{ scale: isActive ? 1 : 1.05 }}
                  whileTap={{ scale: isActive ? 1 : 0.95 }}
                  onClick={() => handlePageChange(pageNumber)}
                  className={getButtonClasses(isActive, false)}
                  aria-label={`Page ${pageNumber}`}
                  aria-current={isActive ? "page" : undefined}
                >
                  {pageNumber}
                </motion.button>
              );
            })}
          </div>
        )}

        {/* Next Button */}
        <motion.button
          whileHover={{ scale: currentPage === totalPages ? 1 : 1.05 }}
          whileTap={{ scale: currentPage === totalPages ? 1 : 0.95 }}
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={getButtonClasses(false, currentPage === totalPages)}
          aria-label="Next page"
        >
          {size === "lg" && <span className="mr-2 hidden sm:inline">Next</span>}
          <FaChevronRight className={iconSizeClasses[size]} />
        </motion.button>

        {/* Last Page Button */}
        {showFirstLast && (
          <motion.button
            whileHover={{ scale: currentPage === totalPages ? 1 : 1.05 }}
            whileTap={{ scale: currentPage === totalPages ? 1 : 0.95 }}
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
            className={getButtonClasses(false, currentPage === totalPages)}
            aria-label="Last page"
          >
            <FaAngleDoubleRight className={iconSizeClasses[size]} />
          </motion.button>
        )}
      </div>

      {/* Mobile: Current Page Info */}
      <div className="sm:hidden text-sm text-gray-600 font-medium">
        Page {currentPage} of {totalPages}
      </div>
    </motion.div>
  );
};

export default Pagination;