import React from "react";
import { Formik, Form, Field } from "formik";
import type { ManagedUser } from "../types/settings";

import { getDefaultPermissions } from "../utils/permissions";

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
          {({ setFieldValue }) => (
            <Form className="space-y-4">
              <Field name="name" className="w-full border p-2 rounded" />
              <Field name="email" className="w-full border p-2 rounded" />

              <Field
                as="select"
                name="role"
                className="w-full border p-2 rounded"
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                  const role = e.target.value;
                  setFieldValue("role", role);
                  setFieldValue(
                    "permissions",
                    getDefaultPermissions(role)
                  );
                }}
              >
                <option value="viewer">Viewer</option>
                <option value="developer">Developer</option>
                <option value="qa">QA</option>
                <option value="manager">Manager</option>
                <option value="admin">Admin</option>
              </Field>

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