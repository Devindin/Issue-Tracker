import React from "react";
import { Formik, Form } from "formik";
import type { ManagedUser } from "../types/settings";
import { getDefaultPermissions } from "../utils/permissions";
import InputField from "../Components/InputField";

interface Props {
  user: ManagedUser;
  isUpdating: boolean;
  onClose: () => void;
  onSubmit: (values: Partial<ManagedUser>) => void;
}

const EditUserModal: React.FC<Props> = ({
  user,
  isUpdating,
  onClose,
  onSubmit,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4">Edit User</h3>

        <Formik
          initialValues={{
            name: user.name,
            email: user.email,
            role: user.role,
            permissions: user.permissions,
          }}
          onSubmit={onSubmit}
        >
          {({ values, errors, touched, handleChange, setFieldValue }) => (
            <Form className="space-y-4">
              {/* Name */}
              <InputField
                label="Name"
                name="name"
                type="text"
                placeholder="Enter name"
                handleChange={handleChange}
                values={values as any}
                errors={errors as Record<string, string>}
                touched={touched as Record<string, boolean>}
                required
              />

              {/* Email */}
              <InputField
                label="Email"
                name="email"
                type="email"
                placeholder="Enter email"
                handleChange={handleChange}
                values={values as any}
                errors={errors as Record<string, string>}
                touched={touched as Record<string, boolean>}
                required
              />

              {/* Role Select */}
              <InputField
                label="Role"
                name="role"
                type="select"
                handleChange={(e) => {
                  handleChange(e);
                  setFieldValue(
                    "permissions",
                    getDefaultPermissions(e.target.value),
                  );
                }}
                values={values as any}
                errors={errors as Record<string, string>}
                touched={touched as Record<string, boolean>}
                options={[
                  { value: "viewer", label: "Viewer" },
                  { value: "developer", label: "Developer" },
                  { value: "qa", label: "QA" },
                  { value: "manager", label: "Manager" },
                  { value: "admin", label: "Admin" },
                ]}
                required
              />

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 bg-gray-200 py-2 rounded"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isUpdating}
                  className="flex-1 bg-indigo-600 text-white py-2 rounded"
                >
                  {isUpdating ? "Updating..." : "Update"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default EditUserModal;
