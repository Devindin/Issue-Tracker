import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaSpinner,
  FaExclamationCircle,
  FaUserTie,
} from "react-icons/fa";
import PageLayout from "../Layout/PageLayout";
import PageTitle from "../Components/PageTitle";
import {
  useGetEmployeesQuery,
  useDeleteEmployeeMutation,
} from "../features/employees/employeeApi";

const EmployeesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch employees
  const { data: employees = [], isLoading, isError } = useGetEmployeesQuery();
  const [deleteEmployee, { isLoading: isDeleting }] = useDeleteEmployeeMutation();

  // Filter employees based on search
  const filteredEmployees = employees.filter((employee) =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteEmployee = async (id: string | number) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      try {
        await deleteEmployee(id).unwrap();
      } catch (error) {
        console.error("Failed to delete employee:", error);
      }
    }
  };

  return (
    <PageLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        >
          <PageTitle
            title="Employees"
            subtitle="Manage your organization's employees"
            textColor="text-white"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => alert('Add employee functionality coming soon')}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-colors"
          >
            <FaPlus /> Add Employee
          </motion.button>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white rounded-2xl shadow-md p-4"
        >
          <div className="relative">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search employees by name, email, or role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
          </div>
        </motion.div>

        {/* Employees List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-2xl shadow-md overflow-hidden"
        >
          {isLoading ? (
            <div className="flex flex-col items-center justify-center p-12">
              <FaSpinner className="text-5xl text-indigo-500 animate-spin mb-4" />
              <p className="text-gray-600">Loading employees...</p>
            </div>
          ) : isError ? (
            <div className="flex flex-col items-center justify-center p-12 text-red-500">
              <FaExclamationCircle className="text-6xl mb-4" />
              <p className="text-lg font-medium">Failed to load employees</p>
            </div>
          ) : filteredEmployees.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 text-gray-500">
              <FaUserTie className="text-6xl mb-4 text-gray-300" />
              <p className="text-lg font-medium">No employees found</p>
              {searchTerm && (
                <p className="text-sm mt-1">Try adjusting your search</p>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Department
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {filteredEmployees.map((employee, index) => (
                    <motion.tr
                      key={employee.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
                            <span className="text-indigo-600 font-semibold">
                              {employee.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {employee.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600">
                          {employee.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {employee.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600">
                          {employee.department || '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            employee.status === 'active'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {employee.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => alert('Edit functionality coming soon')}
                            className="text-indigo-600 hover:text-indigo-900 p-2 hover:bg-indigo-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDeleteEmployee(employee.id)}
                            disabled={isDeleting}
                            className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                            title="Delete"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>

        {/* Summary */}
        {!isLoading && !isError && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-center text-gray-600"
          >
            Showing {filteredEmployees.length} of {employees.length} employees
          </motion.div>
        )}
      </div>
    </PageLayout>
  );
};

export default EmployeesPage;
