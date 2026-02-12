import React, { useState } from "react";
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
import {
  type ManagedUser,
  type CreateUserData,
  type UserPermissions,
} from "../../types";
import {
  useGetUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} from "../../features/users/userApi";
import ConfirmDeleteModal from "../../modals/ConfirmDeleteModal";
import CreateUserModal from "../../modals/CreateUserModal";

interface UserManagementTabProps {}

const UserManagementTab: React.FC<UserManagementTabProps> = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingUser, setEditingUser] = useState<ManagedUser | null>(null);
  const [deletingUser, setDeletingUser] = useState<ManagedUser | null>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successUserName, setSuccessUserName] = useState("");

  // RTK Query hooks
  const { data: users = [], isLoading, isError, error } = useGetUsersQuery();
  const [createUser, { isLoading: isCreating }] = useCreateUserMutation();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

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
      case "admin":
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
      case "manager":
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
      case "developer":
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
      case "qa":
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
      case "viewer":
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

  // Handle create user
  const handleCreateUser = async (values: CreateUserData) => {
    try {
      const result = await createUser(values).unwrap();
      setShowCreateModal(false);
      setSuccessUserName(result.name);
      setShowSuccessMessage(true);
      setTimeout(() => {
        setShowSuccessMessage(false);
        setSuccessUserName("");
      }, 3000);
    } catch (err: any) {
      console.error("Failed to create user:", err);
      alert(
        `Failed to create user: ${err.data?.message || err.message || "Unknown error"}`,
      );
    }
  };

  // Handle edit user
  const handleEditUser = (user: ManagedUser) => {
    setEditingUser(user);
  };

  // Handle update user
  const handleUpdateUser = async (values: Partial<ManagedUser>) => {
    if (!editingUser) return;

    try {
      const { id, createdAt, lastLogin, ...updateData } = values;
      const result = await updateUser({
        id: editingUser.id,
        data: updateData as Partial<CreateUserData>,
      }).unwrap();
      setEditingUser(null);
      setSuccessUserName(result.name);
      setShowSuccessMessage(true);
      setTimeout(() => {
        setShowSuccessMessage(false);
        setSuccessUserName("");
      }, 3000);
    } catch (err: any) {
      console.error("Failed to update user:", err);
      alert(
        `Failed to update user: ${err.data?.message || err.message || "Unknown error"}`,
      );
    }
  };

  // Handle delete user - open modal
  const handleDeleteUser = (user: ManagedUser) => {
    setDeletingUser(user);
  };

  // Confirm delete user - actual deletion
  const confirmDeleteUser = async () => {
    if (!deletingUser) return;

    try {
      await deleteUser(deletingUser.id).unwrap();
      setDeletingUser(null);
    } catch (err: any) {
      console.error("Failed to delete user:", err);
      alert(
        `Failed to delete user: ${err.data?.message || err.message || "Unknown error"}`,
      );
      setDeletingUser(null);
    }
  };

  // Handle toggle user status
  const handleToggleStatus = async (user: ManagedUser) => {
    try {
      const newStatus = user.status === "active" ? "inactive" : "active";
      await updateUser({
        id: user.id,
        data: { status: newStatus } as any,
      }).unwrap();
    } catch (err: any) {
      console.error("Failed to toggle user status:", err);
      alert(
        `Failed to toggle user status: ${err.data?.message || err.message || "Unknown error"}`,
      );
    }
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
          <p className="text-gray-600">
            Create and manage user accounts with role-based permissions
          </p>
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
          <span className="text-green-800">
            {successUserName
              ? `User "${successUserName}" saved successfully!`
              : "User saved successfully!"}
          </span>
        </motion.div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <p className="mt-2 text-gray-600">Loading users...</p>
        </div>
      )}

      {/* Error State */}
      {isError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
          <FaTimes className="text-red-600" />
          <span className="text-red-800">
            Failed to load users:{" "}
            {(error as any)?.data?.message ||
              (error as any)?.message ||
              "Unknown error"}
          </span>
        </div>
      )}

      {/* Users List */}
      {!isLoading && !isError && (
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
                          <div className="text-sm font-medium text-gray-900">
                            {user.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getRoleColor(user.role)}`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(user.status)}`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.lastLogin
                        ? new Date(user.lastLogin).toLocaleDateString()
                        : "Never"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditUser(user)}
                          disabled={isUpdating || isDeleting}
                          className="text-indigo-600 hover:text-indigo-900 disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Edit user"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleToggleStatus(user)}
                          disabled={isUpdating || isDeleting}
                          className={`${user.status === "active" ? "text-red-600 hover:text-red-900" : "text-green-600 hover:text-green-900"} disabled:opacity-50 disabled:cursor-not-allowed`}
                          title={
                            user.status === "active"
                              ? "Deactivate user"
                              : "Activate user"
                          }
                        >
                          {user.status === "active" ? <FaTimes /> : <FaCheck />}
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user)}
                          disabled={isUpdating || isDeleting}
                          className="text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed"
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
      )}

      {/* Create User Modal */}
      {showCreateModal && (
        <CreateUserModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateUser}
          isLoading={isCreating}
          getDefaultPermissions={getDefaultPermissions}
        />
      )}

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 w-full max-w-md mx-4"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Edit User
            </h3>
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
                        setFieldValue(
                          "permissions",
                          getDefaultPermissions(role),
                        );
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
                      disabled={isUpdating}
                      className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isUpdating}
                      className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isUpdating ? "Updating..." : "Update User"}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </motion.div>
        </div>
      )}

      {/* Delete User Modal */}
      <ConfirmDeleteModal
        isOpen={!!deletingUser}
        onClose={() => setDeletingUser(null)}
        onConfirm={confirmDeleteUser}
        entityName="User"
        itemName={deletingUser?.name}
        isLoading={isDeleting}
      />
    </motion.div>
  );
};

export default UserManagementTab;
