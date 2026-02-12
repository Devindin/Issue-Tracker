import React from "react";
import { motion } from "framer-motion";
import { Formik, Form } from "formik";
import type { FormikHelpers } from "formik";
import * as Yup from "yup";
import type { CreateUserData, UserPermissions } from "../types/settings";
import InputField from "../Components/InputField";

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
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Create New User
        </h3>

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
            <Form className="space-y-3">
              <InputField
                label="Name"
                name="name"
                type="text"
                placeholder="Enter full name"
                requiredfiled
                handleChange={handleChange}
                values={values}
                errors={errors as Record<string, string>}
                touched={touched as Record<string, boolean>}
              />

              <InputField
                label="Email"
                name="email"
                type="email"
                placeholder="Enter email"
                requiredfiled
                handleChange={handleChange}
                values={values}
                errors={errors as Record<string, string>}
                touched={touched as Record<string, boolean>}
              />

              <InputField
                label="Password"
                name="password"
                type="password"
                placeholder="Enter password"
                requiredfiled
                showLockIcon
                handleChange={handleChange}
                values={values}
                errors={errors as Record<string, string>}
                touched={touched as Record<string, boolean>}
              />

              <InputField
                label="Role"
                name="role"
                type="select"
                options={roleOptions}
                requiredfiled
                handleChange={(e: any) => {
                  const role = e.target.value as UserRole;
                  setFieldValue("role", role);
                  setFieldValue("permissions", getDefaultPermissions(role));
                }}
                values={values}
                errors={errors as Record<string, string>}
                touched={touched as Record<string, boolean>}
              />

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
