import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  password: Yup.string()
    .min(8, "Minimum 8 characters")
    .required("Password is required"),
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
  // Close on ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
    }

    return () => {
      document.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose} // close when clicking outside
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()} // prevent close when clicking inside
            className="bg-white rounded-2xl p-6 w-full max-w-md mx-4 shadow-xl"
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
                    required
                    handleChange={handleChange}
                    values={values as any}
                    errors={errors as Record<string, string>}
                    touched={touched as Record<string, boolean>}
                  />

                  <InputField
                    label="Email"
                    name="email"
                    type="email"
                    placeholder="Enter email"
                    required
                    handleChange={handleChange}
                    values={values as any}
                    errors={errors as Record<string, string>}
                    touched={touched as Record<string, boolean>}
                  />

                  <InputField
                    label="Password"
                    name="password"
                    type="password"
                    placeholder="Enter password"
                    required
                    showLockIcon
                    handleChange={handleChange}
                    values={values as any}
                    errors={errors as Record<string, string>}
                    touched={touched as Record<string, boolean>}
                  />

                  <InputField
                    label="Role"
                    name="role"
                    type="select"
                    options={roleOptions}
                    required
                    handleChange={(e) => {
                      const role = (e.target as HTMLSelectElement)
                        .value as UserRole;
                      setFieldValue("role", role);
                      setFieldValue(
                        "permissions",
                        getDefaultPermissions(role)
                      );
                    }}
                    values={values as any}
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
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CreateUserModal;