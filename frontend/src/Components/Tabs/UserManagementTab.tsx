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
import UsersTable from "../UsersTable";
import EditUserModal from "../../modals/EditUserModal";

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

         <UsersTable
  users={users}
  isUpdating={isUpdating}
  isDeleting={isDeleting}
  onEdit={handleEditUser}
  onDelete={handleDeleteUser}
  onToggleStatus={handleToggleStatus}
/>
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
  <EditUserModal
    user={editingUser}
    isUpdating={isUpdating}
    onClose={() => setEditingUser(null)}
    onSubmit={handleUpdateUser}
  />
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
