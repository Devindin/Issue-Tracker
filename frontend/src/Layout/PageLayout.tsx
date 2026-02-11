import React, { useState } from "react";
import type { ReactNode } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  FaHome,
  FaCog,
  FaExclamationTriangle,
  FaFolder,
  FaSignOutAlt,
  FaBars,
  FaPlus,
  FaUser,
} from "react-icons/fa";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import DeleteModal from "../Components/DeleteModal";
import { useSelector } from "react-redux";
import type { RootState } from "../app/stores";


interface MenuItem {
  icon: React.JSX.Element;
  label: string;
  path?: string;
}

interface PageLayoutProps {
  children?: ReactNode;
}

const PageLayout: React.FC<PageLayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [showLogoutModal, setShowLogoutModal] = useState<boolean>(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = (): void => {
    setShowLogoutModal(true);
  };

  const confirmLogout = (): void => {
  localStorage.removeItem("authToken");
  localStorage.removeItem("user");
  sessionStorage.clear();
  setShowLogoutModal(false);

  navigate("/", { replace: true });
};


  const cancelLogout = (): void => {
    setShowLogoutModal(false);
  };

  const isActivePath = (path: string): boolean => {
    if (path === "/issues") {
      return location.pathname === "/issues" ||
             (location.pathname.startsWith("/issues/") && !location.pathname.includes("/new"));
    }
    return location.pathname === path;
  };

  const menuItems: MenuItem[] = [
    { icon: <FaHome />, label: "Dashboard", path: "/dashboard" },
    { icon: <FaExclamationTriangle />, label: "Issues", path: "/issues" },
    { icon: <FaPlus />, label: "Create Issue", path: "/issues/new" },
    { icon: <FaFolder />, label: "Projects", path: "/projects" },
    { icon: <FaCog />, label: "Settings", path: "/settings" },
    { icon: <FaSignOutAlt />, label: "Sign Out" },
  ];

  // Get user info from localStorage
  const user = useSelector((state: RootState) => state.auth.user);
const userName = user?.name ?? "User";


  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-500 via-blue-200 to-blue-50">
      {/* Sidebar for Desktop */}
      <motion.div
        animate={{ width: collapsed ? "4rem" : "15rem" }}
        transition={{ duration: 0.6, type: "spring", stiffness: 120 }}
        className="hidden md:flex flex-col bg-white/95 backdrop-blur-lg shadow-xl border border-white/20 rounded-3xl m-4 overflow-hidden"
      >
        {/* Collapse Button */}
        <div className="flex justify-between items-center p-2">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-lg bg-[#1976D2]/20 hover:bg-[#1976D2]/30 transition-colors"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <FiChevronRight className="text-[#1976D2] text-xl" />
            ) : (
              <FiChevronLeft className="text-[#1976D2] text-xl" />
            )}
          </button>
        </div>

        <div className="flex items-center justify-center flex-col py-4">
          <motion.div
            className="w-12 h-12 rounded-full border-2 border-[#00C6D7] bg-[#1976D2] flex items-center justify-center"
            animate={{ scale: collapsed ? 0.8 : 1 }}
            transition={{ duration: 0.3 }}
          >
            <FaUser className="text-white text-lg" />
          </motion.div>
          {!collapsed && (
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mt-2 text-sm font-semibold text-[#0A3D91]"
            >
              {userName}
            </motion.h1>
          )}
        </div>

        <nav className="flex-1 p-2 space-y-1">
          {menuItems.map((item, index) => {
            if (item.path) {
              const isActive = isActivePath(item.path);
              return (
                <Link
                  key={index}
                  to={item.path}
                  className={`flex items-center gap-4 p-3 rounded-xl cursor-pointer font-medium transition-all group ${
                    isActive
                      ? "bg-[#1976D2] text-white shadow-lg"
                      : "hover:bg-[#1976D2]/10 text-[#0A3D91] hover:text-[#1976D2]"
                  }`}
                >
                  <span className={`text-lg group-hover:scale-110 transition-transform ${
                    isActive ? "text-white" : "text-[#1976D2]"
                  }`}>
                    {item.icon}
                  </span>
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              );
            } else {
              return (
                <button
                  key={index}
                  onClick={handleLogout}
                  className="w-full flex items-center gap-4 p-3 rounded-xl cursor-pointer font-medium transition-all hover:bg-red-50 text-gray-700 hover:text-red-600 group"
                >
                  <span className="text-lg group-hover:scale-110 transition-transform text-red-500">
                    {item.icon}
                  </span>
                  {!collapsed && <span>{item.label}</span>}
                </button>
              );
            }
          })}
        </nav>
      </motion.div>

      {/* Mobile Hamburger Button */}
      <div className="absolute top-4 left-4 md:hidden z-50">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-3 bg-[#0A3D91] text-white rounded-xl shadow-lg hover:bg-[#1976D2] transition-colors"
          aria-label="Open menu"
        >
          <FaBars size={20} />
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.3, type: "spring" }}
              className="fixed top-0 left-0 w-72 h-full z-50 flex flex-col bg-white shadow-2xl p-6"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-bold text-xl text-[#0A3D91]">
                  Issue<span className="text-[#00C6D7]">Desk</span><span className="text-[#0A3D91] font-bold">X</span>
                </h2>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="text-gray-400 hover:text-gray-600 text-3xl leading-none"
                  aria-label="Close menu"
                >
                  &times;
                </button>
              </div>

              <div className="flex items-center gap-3 mb-6 p-3 bg-[#1976D2]/10 rounded-xl">
                <div className="w-10 h-10 rounded-full border-2 border-[#00C6D7] bg-[#1976D2] flex items-center justify-center">
                  <FaUser className="text-white text-sm" />
                </div>
                <span className="font-semibold text-[#0A3D91]">{userName}</span>
              </div>

              <nav className="space-y-2 flex-1">
                {menuItems.map((item, index) => {
                  if (item.path) {
                    const isActive = isActivePath(item.path);
                    return (
                      <Link
                        key={index}
                        to={item.path}
                        onClick={() => setSidebarOpen(false)}
                        className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${
                          isActive
                            ? "bg-[#1976D2] text-white"
                            : "hover:bg-[#1976D2]/10 text-[#0A3D91] hover:text-[#1976D2]"
                        }`}
                      >
                        <span className={`text-lg ${isActive ? "text-white" : "text-[#1976D2]"}`}>
                          {item.icon}
                        </span>
                        <span className="font-medium">{item.label}</span>
                      </Link>
                    );
                  } else {
                    return (
                      <button
                        key={index}
                        onClick={() => {
                          setSidebarOpen(false);
                          handleLogout();
                        }}
                        className="w-full flex items-center gap-3 p-3 rounded-xl transition-colors hover:bg-red-50 text-gray-700 hover:text-red-600"
                      >
                        <span className="text-lg text-red-500">{item.icon}</span>
                        <span className="font-medium">{item.label}</span>
                      </button>
                    );
                  }
                })}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-1 p-4 md:p-6 overflow-auto">
        {children || (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-center h-full"
          >
            <h1 className="text-3xl font-bold text-white">
              Welcome to <span className="text-[#00C6D7]">Issue</span><span className="text-white font-bold">Desk</span><span className="text-[#00C6D7] font-bold">X</span>
            </h1>
          </motion.div>
        )}
      </div>

      {/* Logout Confirmation Modal */}
      <AnimatePresence>
        {showLogoutModal && (
          <DeleteModal
            isOpen={showLogoutModal}
            onClose={cancelLogout}
            onConfirm={confirmLogout}
            title="Sign Out"
            message="Are you sure you want to sign out? You'll need to sign in again to access your account."
            confirmText="Sign Out"
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default PageLayout;