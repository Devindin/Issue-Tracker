import { Formik, Form } from "formik";
import * as Yup from "yup";
import { FaLock, FaArrowLeft } from "react-icons/fa";
import PrimaryButton from "./PrimaryButton";
import InputField from "./InputField";

interface Props {
  email: string;
  onSubmit: (password: string) => void;
  onBack: () => void;
  isLoading: boolean;
  error: string;
}

const schema = Yup.object({
  newPassword: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("New password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword")], "Passwords must match")
    .required("Please confirm your password"),
});

export default function ResetPasswordForm({
  email,
  onSubmit,
  onBack,
  isLoading,
  error,
}: Props) {
  return (
    <Formik
      initialValues={{ newPassword: "", confirmPassword: "" }}
      validationSchema={schema}
      onSubmit={(values) => onSubmit(values.newPassword)}
    >
      {({ handleChange, values, errors, touched }) => (
        <Form className="space-y-4">
          <div className="text-center mb-6">
            <FaLock className="mx-auto text-4xl text-[#00C6D7]" />
            <h1 className="text-2xl font-bold mt-4">Reset Password</h1>
            <p className="text-sm text-gray-500">Email: {email}</p>
          </div>

          {error && (
            <div className="p-3 bg-red-100 text-red-600 rounded">
              {error}
            </div>
          )}

          {/* New Password */}
          <InputField
            label="New Password"
            name="newPassword"
            type="password"
            placeholder="••••••••"
            handleChange={handleChange}
            values={values}
            errors={errors}
            touched={touched}
          />

          {/* Confirm Password */}
          <InputField
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            placeholder="••••••••"
            handleChange={handleChange}
            values={values}
            errors={errors}
            touched={touched}
          />

          <PrimaryButton
            label={isLoading ? "Resetting..." : "Reset Password"}
            type="submit"
            disabled={isLoading}
          />

          <button
            type="button"
            onClick={onBack}
            className="text-sm text-[#00C6D7] flex gap-2 justify-center mt-2"
          >
            <FaArrowLeft /> Back
          </button>
        </Form>
      )}
    </Formik>
  );
}
