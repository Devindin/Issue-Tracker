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
import ConfirmDeleteModal from "../modals/ConfirmDeleteModal";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../app/stores";
import { logout } from "../features/auth/authSlice";
import { motion, AnimatePresence, type Variants } from "framer-motion";

interface MenuItem {
  icon: React.JSX.Element;
  label: string;
  path?: string;
}

interface PageLayoutProps {
  children?: ReactNode;
}

const PageLayout: React.FC<PageLayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const sidebarVariants: Variants = {
    hidden: { x: "-100%", opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 18,
        when: "beforeChildren",
        staggerChildren: 0.08,
      },
    },
    exit: {
      x: "-100%",
      opacity: 0,
      transition: { duration: 0.25 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  const handleLogout = () => setShowLogoutModal(true);

  const confirmLogout = () => {
    dispatch(logout());
    setShowLogoutModal(false);
    navigate("/login", { replace: true });
  };

  const cancelLogout = () => setShowLogoutModal(false);

  const isActivePath = (path: string): boolean => {
    if (path === "/issues") {
      return (
        location.pathname === "/issues" ||
        (location.pathname.startsWith("/issues/") &&
          !location.pathname.includes("/new"))
      );
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

  const user = useSelector((state: RootState) => state.auth.user);
  const userName = user?.name ?? "User";

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-500 via-blue-200 to-blue-50">
      {/*  Desktop Sidebar */}
      <motion.div
        animate={{ width: collapsed ? "4rem" : "15rem" }}
        transition={{ duration: 0.6, type: "spring", stiffness: 120 }}
        className="hidden md:flex flex-col bg-white/95 backdrop-blur-lg shadow-xl border border-white/20 rounded-3xl m-4 overflow-hidden"
      >
        <div className="flex justify-between items-center p-2">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-lg bg-[#1976D2]/20 hover:bg-[#1976D2]/30 transition-colors"
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
          {menuItems.map((item, index) =>
            item.path ? (
              <Link
                key={index}
                to={item.path}
                className={`flex items-center gap-4 p-3 rounded-xl font-medium transition-all ${
                  isActivePath(item.path)
                    ? "bg-[#1976D2] text-white shadow-lg"
                    : "hover:bg-[#1976D2]/10 text-[#0A3D91]"
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                {!collapsed && <span>{item.label}</span>}
              </Link>
            ) : (
              <button
                key={index}
                onClick={handleLogout}
                className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-red-50 text-gray-700 hover:text-red-600"
              >
                <span className="text-lg text-red-500">{item.icon}</span>
                {!collapsed && <span>{item.label}</span>}
              </button>
            ),
          )}
        </nav>
      </motion.div>

      {/*  Mobile Hamburger  */}
      <div className="absolute top-4 left-4 md:hidden z-50">
        <motion.button
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.05 }}
          onClick={() => setSidebarOpen(true)}
          className="p-3 bg-[#0A3D91] text-white rounded-xl shadow-lg"
        >
          <FaBars size={20} />
        </motion.button>
      </div>

      {/*  Mobile Sidebar  */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setSidebarOpen(false)}
            />

            {/* Sidebar */}
            <motion.div
              variants={sidebarVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed top-0 left-0 w-72 h-full z-50 flex flex-col bg-white shadow-2xl p-6 rounded-r-3xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-bold text-xl text-[#0A3D91]">
                  Issue<span className="text-[#00C6D7]">Desk</span>X
                </h2>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="text-gray-400 text-3xl"
                >
                  &times;
                </button>
              </div>

              <div className="flex items-center gap-3 mb-6 p-3 bg-[#1976D2]/10 rounded-xl">
                <div className="w-10 h-10 rounded-full bg-[#1976D2] flex items-center justify-center">
                  <FaUser className="text-white text-sm" />
                </div>
                <span className="font-semibold text-[#0A3D91]">{userName}</span>
              </div>

              <motion.nav className="space-y-2 flex-1">
                {menuItems.map((item, index) =>
                  item.path ? (
                    <motion.div key={index} variants={itemVariants}>
                      <Link
                        to={item.path}
                        onClick={() => setSidebarOpen(false)}
                        className={`flex items-center gap-3 p-3 rounded-xl ${
                          isActivePath(item.path)
                            ? "bg-[#1976D2] text-white"
                            : "hover:bg-[#1976D2]/10 text-[#0A3D91]"
                        }`}
                      >
                        {item.icon}
                        <span>{item.label}</span>
                      </Link>
                    </motion.div>
                  ) : (
                    <motion.div key={index} variants={itemVariants}>
                      <button
                        onClick={() => {
                          setSidebarOpen(false);
                          handleLogout();
                        }}
                        className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-red-50 text-gray-700 hover:text-red-600"
                      >
                        {item.icon}
                        <span>{item.label}</span>
                      </button>
                    </motion.div>
                  ),
                )}
              </motion.nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="flex-1 p-4 md:p-6 overflow-auto">{children}</div>

      <ConfirmDeleteModal
        isOpen={showLogoutModal}
        onClose={cancelLogout}
        onConfirm={confirmLogout}
        title="Sign Out"
        message="Are you sure you want to sign out?"
        entityName="Session"
        confirmText="Sign Out"
      />
    </div>
  );
};

export default PageLayout;
