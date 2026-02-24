import React from "react";
import { FaEdit, FaTrash, FaCheck, FaTimes, FaUser } from "react-icons/fa";
import type { ManagedUser } from "../types/settings";

interface UsersTableProps {
  users: ManagedUser[];
  isUpdating: boolean;
  isDeleting: boolean;
  onEdit: (user: ManagedUser) => void;
  onDelete: (user: ManagedUser) => void;
  onToggleStatus: (user: ManagedUser) => void;
}

const UsersTable: React.FC<UsersTableProps> = ({
  users,
  isUpdating,
  isDeleting,
  onEdit,
  onDelete,
  onToggleStatus,
}) => {
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

  const getStatusColor = (status: string) =>
    status === "active"
      ? "bg-green-100 border-green-300 text-green-700"
      : "bg-red-100 border-red-300 text-red-700";

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              User
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Role
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Last Login
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Actions
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200">
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-gray-50">
              <td className="px-6 py-4">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                    <FaUser className="text-indigo-600" />
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium">{user.name}</div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </div>
                </div>
              </td>

              <td className="px-6 py-4">
                <span
                  className={`px-2 py-1 text-xs rounded-full border ${getRoleColor(
                    user.role
                  )}`}
                >
                  {user.role}
                </span>
              </td>

              <td className="px-6 py-4">
                <span
                  className={`px-2 py-1 text-xs rounded-full border ${getStatusColor(
                    user.status
                  )}`}
                >
                  {user.status}
                </span>
              </td>

              <td className="px-6 py-4 text-sm text-gray-500">
                {user.lastLogin
                  ? new Date(user.lastLogin).toLocaleDateString()
                  : "Never"}
              </td>

              <td className="px-6 py-4 flex gap-2">
                <button
                  onClick={() => onEdit(user)}
                  disabled={isUpdating || isDeleting}
                  className="text-indigo-600"
                >
                  <FaEdit />
                </button>

                <button
                  onClick={() => onToggleStatus(user)}
                  disabled={isUpdating || isDeleting}
                  className={
                    user.status === "active"
                      ? "text-red-600"
                      : "text-green-600"
                  }
                >
                  {user.status === "active" ? <FaTimes /> : <FaCheck />}
                </button>

                <button
                  onClick={() => onDelete(user)}
                  disabled={isUpdating || isDeleting}
                  className="text-red-600"
                >
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsersTable;