import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  FaUserPlus,
  FaUsers,
  FaEdit,
  FaTrash,
  FaCheck,
  FaTimes,
  FaUser,
} from "react-icons/fa";
import { type ManagedUser, type CreateUserData, type UserPermissions } from "../types";

interface UserManagementTabProps {
  saveSettings: () => void;
}

const UserManagementTab: React.FC<UserManagementTabProps> = ({ saveSettings }) => {
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingUser, setEditingUser] = useState<ManagedUser | null>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Default permissions based on role
  const getDefaultPermissions = (role: string): UserPermissions => {
    const basePermissions: UserPermissions = {
      canCreateIssues: false,
      canEditIssues: false,
      canDeleteIssues: false,
      canAssignIssues: false,
      canViewAllIssues: false,
      canManageUsers: false,
      canViewReports: false,
      canExportData: false,
    };

    switch (role) {
      case 'admin':
        return {
          canCreateIssues: true,
          canEditIssues: true,
          canDeleteIssues: true,
          canAssignIssues: true,
          canViewAllIssues: true,
          canManageUsers: true,
          canViewReports: true,
          canExportData: true,
        };
      case 'manager':
        return {
          canCreateIssues: true,
          canEditIssues: true,
          canDeleteIssues: false,
          canAssignIssues: true,
          canViewAllIssues: true,
          canManageUsers: false,
          canViewReports: true,
          canExportData: true,
        };
      case 'developer':
        return {
          canCreateIssues: true,
          canEditIssues: true,
          canDeleteIssues: false,
          canAssignIssues: false,
          canViewAllIssues: true,
          canManageUsers: false,
          canViewReports: false,
          canExportData: false,
        };
      case 'qa':
        return {
          canCreateIssues: true,
          canEditIssues: true,
          canDeleteIssues: false,
          canAssignIssues: true,
          canViewAllIssues: true,
          canManageUsers: false,
          canViewReports: true,
          canExportData: true,
        };
      case 'viewer':
        return {
          canCreateIssues: false,
          canEditIssues: false,
          canDeleteIssues: false,
          canAssignIssues: false,
          canViewAllIssues: false,
          canManageUsers: false,
          canViewReports: false,
          canExportData: false,
        };
      default:
        return basePermissions;
    }
  };

  // Load users from localStorage
  useEffect(() => {
    const savedUsers = localStorage.getItem("managedUsers");
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    } else {
      // Mock data for demonstration
      const mockUsers: ManagedUser[] = [
        {
          id: 1,
          name: "John Doe",
          email: "john@example.com",
          role: "admin",
          permissions: getDefaultPermissions("admin"),
          status: "active",
          createdAt: "2026-01-15T10:00:00Z",
          lastLogin: "2026-02-09T08:30:00Z",
        },
        {
          id: 2,
          name: "Jane Smith",
          email: "jane@example.com",
          role: "manager",
          permissions: getDefaultPermissions("manager"),
          status: "active",
          createdAt: "2026-01-20T14:00:00Z",
          lastLogin: "2026-02-08T16:45:00Z",
        },
        {
          id: 3,
          name: "Mike Johnson",
          email: "mike@example.com",
          role: "developer",
          permissions: getDefaultPermissions("developer"),
          status: "active",
          createdAt: "2026-02-01T09:15:00Z",
          lastLogin: "2026-02-07T11:20:00Z",
        },
        {
          id: 4,
          name: "Sarah Wilson",
          email: "sarah@example.com",
          role: "qa",
          permissions: getDefaultPermissions("qa"),
          status: "active",
          createdAt: "2026-01-25T13:30:00Z",
          lastLogin: "2026-02-06T14:15:00Z",
        },
      ];
      setUsers(mockUsers);
      localStorage.setItem("managedUsers", JSON.stringify(mockUsers));
    }
  }, []);

  // Save users to localStorage
  const saveUsers = (updatedUsers: ManagedUser[]) => {
    setUsers(updatedUsers);
    localStorage.setItem("managedUsers", JSON.stringify(updatedUsers));
  };

  // Create user validation schema
  const createUserSchema = Yup.object({
    name: Yup.string()
      .min(2, "Name must be at least 2 characters")
      .required("Name is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .required("Password is required"),
    role: Yup.string()
      .oneOf(["admin", "manager", "developer", "qa", "viewer"], "Invalid role")
      .required("Role is required"),
  });

  // Handle create user
  const handleCreateUser = async (values: CreateUserData) => {
    const newUser: ManagedUser = {
      id: Date.now(),
      name: values.name,
      email: values.email,
      role: values.role,
      permissions: values.permissions,
      status: "active",
      createdAt: new Date().toISOString(),
    };

    const updatedUsers = [...users, newUser];
    saveUsers(updatedUsers);
    setShowCreateModal(false);
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000);
    saveSettings();
  };

  // Handle edit user
  const handleEditUser = (user: ManagedUser) => {
    setEditingUser(user);
  };

  // Handle update user
  const handleUpdateUser = async (values: Partial<ManagedUser>) => {
    if (!editingUser) return;

    const updatedUsers = users.map(user =>
      user.id === editingUser.id
        ? { ...user, ...values }
        : user
    );
    saveUsers(updatedUsers);
    setEditingUser(null);
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000);
    saveSettings();
  };

  // Handle delete user
  const handleDeleteUser = (userId: number) => {
    const updatedUsers = users.filter(user => user.id !== userId);
    saveUsers(updatedUsers);
    saveSettings();
  };

  // Handle toggle user status
  const handleToggleStatus = (userId: number) => {
    const updatedUsers = users.map(user =>
      user.id === userId
        ? { ...user, status: user.status === "active" ? "inactive" as const : "active" as const }
        : user
    );
    saveUsers(updatedUsers);
    saveSettings();
  };

  const getRoleColor = (role: string) => {
    const colors = {
      admin: "bg-red-100 border-red-300 text-red-700",
      manager: "bg-blue-100 border-blue-300 text-blue-700",
      developer: "bg-green-100 border-green-300 text-green-700",
      qa: "bg-purple-100 border-purple-300 text-purple-700",
      viewer: "bg-gray-100 border-gray-300 text-gray-700",
    };
    return colors[role as keyof typeof colors];
  };

  const getStatusColor = (status: string) => {
    return status === "active"
      ? "bg-green-100 border-green-300 text-green-700"
      : "bg-red-100 border-red-300 text-red-700";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">User Management</h2>
          <p className="text-gray-600">Create and manage user accounts with role-based permissions</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <FaUserPlus />
          Create User
        </button>
      </div>

      {/* Success Message */}
      {showSuccessMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3"
        >
          <FaCheck className="text-green-600" />
          <span className="text-green-800">User saved successfully!</span>
        </motion.div>
      )}

      {/* Users List */}
      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <FaUsers />
            Users ({users.length})
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Login
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                          <FaUser className="h-5 w-5 text-indigo-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getRoleColor(user.role)}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(user.status)}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : "Never"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEditUser(user)}
                        className="text-indigo-600 hover:text-indigo-900"
                        title="Edit user"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleToggleStatus(user.id)}
                        className={user.status === "active" ? "text-red-600 hover:text-red-900" : "text-green-600 hover:text-green-900"}
                        title={user.status === "active" ? "Deactivate user" : "Activate user"}
                      >
                        {user.status === "active" ? <FaTimes /> : <FaCheck />}
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete user"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 w-full max-w-md mx-4"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Create New User</h3>
            <Formik
              initialValues={{
                name: "",
                email: "",
                password: "",
                role: "viewer" as const,
                permissions: getDefaultPermissions("viewer"),
              }}
              validationSchema={createUserSchema}
              onSubmit={handleCreateUser}
            >
              {({ setFieldValue }) => (
                <Form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name
                    </label>
                    <Field
                      name="name"
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <ErrorMessage name="name" component="div" className="text-red-500 text-sm mt-1" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <Field
                      name="email"
                      type="email"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Password
                    </label>
                    <Field
                      name="password"
                      type="password"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <ErrorMessage name="password" component="div" className="text-red-500 text-sm mt-1" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Role
                    </label>
                    <Field
                      as="select"
                      name="role"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                        const role = e.target.value;
                        setFieldValue("role", role);
                        setFieldValue("permissions", getDefaultPermissions(role));
                      }}
                    >
                      <option value="viewer">Viewer</option>
                      <option value="developer">Developer</option>
                      <option value="qa">QA</option>
                      <option value="manager">Manager</option>
                      <option value="admin">Admin</option>
                    </Field>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowCreateModal(false)}
                      className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      Create User
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </motion.div>
        </div>
      )}

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 w-full max-w-md mx-4"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Edit User</h3>
            <Formik
              initialValues={{
                name: editingUser.name,
                email: editingUser.email,
                role: editingUser.role,
                permissions: editingUser.permissions,
              }}
              onSubmit={handleUpdateUser}
            >
              {({ setFieldValue }) => (
                <Form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name
                    </label>
                    <Field
                      name="name"
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <Field
                      name="email"
                      type="email"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Role
                    </label>
                    <Field
                      as="select"
                      name="role"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                        const role = e.target.value;
                        setFieldValue("role", role);
                        setFieldValue("permissions", getDefaultPermissions(role));
                      }}
                    >
                      <option value="viewer">Viewer</option>
                      <option value="developer">Developer</option>
                      <option value="qa">QA</option>
                      <option value="manager">Manager</option>
                      <option value="admin">Admin</option>
                    </Field>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setEditingUser(null)}
                      className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      Update User
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default UserManagementTab;