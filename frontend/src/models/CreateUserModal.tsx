import React from "react";
import { motion } from "framer-motion";
import { Formik, Form, Field, ErrorMessage} from "formik";
import type { FormikHelpers } from "formik";
import * as Yup from "yup";
import type { CreateUserData, UserPermissions } from "../types/settings";

export type UserRole = "admin" | "manager" | "developer" | "qa" | "viewer";

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    values: CreateUserData,
    formikHelpers: FormikHelpers<CreateUserData>
  ) => void | Promise<void>;
  isLoading: boolean;
  getDefaultPermissions: (role: UserRole) => UserPermissions;
}

const validationSchema = Yup.object({
  name: Yup.string().min(2, "Minimum 2 characters").required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().min(8, "Minimum 8 characters").required("Password is required"),
  role: Yup.mixed<UserRole>()
    .oneOf(["admin", "manager", "developer", "qa", "viewer"])
    .required("Role is required"),
  permissions: Yup.object().required(),
});

const roleOptions = [
  { value: "viewer", label: "Viewer" },
  { value: "developer", label: "Developer" },
  { value: "qa", label: "QA" },
  { value: "manager", label: "Manager" },
  { value: "admin", label: "Admin" },
];

const CreateUserModal: React.FC<CreateUserModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  getDefaultPermissions,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl p-6 w-full max-w-md mx-4"
      >
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Create New User</h3>

        <Formik<CreateUserData>
          initialValues={{
            name: "",
            email: "",
            password: "",
            role: "viewer",
            permissions: getDefaultPermissions("viewer"),
          }}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({ values, errors, touched, handleChange, setFieldValue }) => (
            <Form className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={values.name}
                  onChange={handleChange}
                  placeholder="Enter full name"
                  className={`w-full px-3 py-2 border rounded-md ${
                    errors.name && touched.name ? "border-red-500" : "border-gray-300"
                  }`}
                />
                <ErrorMessage name="name" component="div" className="text-red-500 text-xs mt-1" />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={values.email}
                  onChange={handleChange}
                  placeholder="Enter email"
                  className={`w-full px-3 py-2 border rounded-md ${
                    errors.email && touched.email ? "border-red-500" : "border-gray-300"
                  }`}
                />
                <ErrorMessage name="email" component="div" className="text-red-500 text-xs mt-1" />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  name="password"
                  value={values.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                  className={`w-full px-3 py-2 border rounded-md ${
                    errors.password && touched.password ? "border-red-500" : "border-gray-300"
                  }`}
                />
                <ErrorMessage name="password" component="div" className="text-red-500 text-xs mt-1" />
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role <span className="text-red-500">*</span>
                </label>
                <select
                  name="role"
                  value={values.role}
                  onChange={(e) => {
                    const role = e.target.value as UserRole;
                    setFieldValue("role", role);
                    setFieldValue("permissions", getDefaultPermissions(role));
                  }}
                  className={`w-full px-3 py-2 border rounded-md ${
                    errors.role && touched.role ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  {roleOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ErrorMessage name="role" component="div" className="text-red-500 text-xs mt-1" />
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                >
                  {isLoading ? "Creating..." : "Create User"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </motion.div>
    </div>
  );
};

export default CreateUserModal;
