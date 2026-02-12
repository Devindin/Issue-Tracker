import React, { useState } from "react";
import { FaLock, FaSave } from "react-icons/fa";
import { type SecuritySettings } from "../../types";
import { useChangePasswordMutation } from "../../features/profile/profileApi";
import InputField from "../../Components/InputField";
import StatusModal from "../../modals/StatusModal";

interface SecurityTabProps {
  security: SecuritySettings;
  setSecurity: React.Dispatch<React.SetStateAction<SecuritySettings>>;
  saveSettings: () => void;
  onSuccess?: () => void;
}

const SecurityTab: React.FC<SecurityTabProps> = ({
  security,
  setSecurity,
  saveSettings,
  onSuccess,
}) => {
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [passwordErrors, setPasswordErrors] =
    useState<Record<string, string>>({});

  const [changePassword, { isLoading }] =
    useChangePasswordMutation();

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<"success" | "error">("success");
  const [modalMessage, setModalMessage] = useState("");

  const handlePasswordChange = (field: string, value: string) => {
    setPasswordData((prev) => ({ ...prev, [field]: value }));

    if (passwordErrors[field]) {
      setPasswordErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const updatePassword = async () => {
    const errors: Record<string, string> = {};

    if (!passwordData.currentPassword) {
      errors.currentPassword = "Current password is required";
    }

    if (!passwordData.newPassword) {
      errors.newPassword = "New password is required";
    } else if (passwordData.newPassword.length < 8) {
      errors.newPassword = "Password must be at least 8 characters";
    }

    if (!passwordData.confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (
      passwordData.newPassword !== passwordData.confirmPassword
    ) {
      errors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(errors).length > 0) {
      setPasswordErrors(errors);
      return;
    }

    try {
      await changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      }).unwrap();

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setPasswordErrors({});

      setModalType("success");
      setModalMessage("Your password has been updated successfully.");
      setShowModal(true);

      onSuccess?.();
    } catch (err: any) {
      console.error("Password change failed:", err);

      setModalType("error");
      setModalMessage(
        err?.data?.message ||
          "Failed to change password. Please try again."
      );
      setShowModal(true);
    }
  };

  const values = {
    currentPassword: passwordData.currentPassword,
    newPassword: passwordData.newPassword,
    confirmPassword: passwordData.confirmPassword,
  };

  const touched = {
    currentPassword: true,
    newPassword: true,
    confirmPassword: true,
  };

  return (
    <>
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Security Settings
        </h2>

        <div className="border border-gray-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FaLock className="text-indigo-600" />
            Change Password
          </h3>

          <div className="space-y-4">
            <InputField
              label="Current Password"
              name="currentPassword"
              type="password"
              placeholder="Enter current password"
              values={values}
              errors={passwordErrors}
              touched={touched}
              handleChange={(e) =>
                handlePasswordChange(e.target.name, e.target.value)
              }
            />

            <InputField
              label="New Password"
              name="newPassword"
              type="password"
              placeholder="Enter new password"
              values={values}
              errors={passwordErrors}
              touched={touched}
              handleChange={(e) =>
                handlePasswordChange(e.target.name, e.target.value)
              }
            />

            <InputField
              label="Confirm New Password"
              name="confirmPassword"
              type="password"
              placeholder="Confirm new password"
              values={values}
              errors={passwordErrors}
              touched={touched}
              handleChange={(e) =>
                handlePasswordChange(e.target.name, e.target.value)
              }
            />

            <button
              onClick={updatePassword}
              disabled={isLoading}
              className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              <FaSave />
              {isLoading ? "Updating..." : "Update Password"}
            </button>
          </div>
        </div>
      </div>

      <StatusModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        type={modalType}
        title={modalType === "success" ? "Success!" : "Error"}
        message={modalMessage}
        primaryAction={{
          label: "Close",
          onClick: () => setShowModal(false),
        }}
      />
    </>
  );
};

export default SecurityTab;
