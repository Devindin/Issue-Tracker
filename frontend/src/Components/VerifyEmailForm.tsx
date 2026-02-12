import { Formik, Form } from "formik";
import * as Yup from "yup";
import { FaEnvelope, FaArrowLeft } from "react-icons/fa";
import { Link } from "react-router-dom";
import PrimaryButton from "./PrimaryButton";

interface Props {
  onSubmit: (email: string) => void;
  isLoading: boolean;
  error: string;
}

const schema = Yup.object({
  email: Yup.string().email().required("Email is required"),
});

export default function VerifyEmailForm({
  onSubmit,
  isLoading,
  error,
}: Props) {
  return (
    <Formik
      initialValues={{ email: "" }}
      validationSchema={schema}
      onSubmit={(values) => onSubmit(values.email)}
    >
      {({ handleChange, values, errors, touched }) => (
        <Form className="space-y-4">
          <div className="text-center mb-6">
            <FaEnvelope className="mx-auto text-4xl text-[#00C6D7]" />
            <h1 className="text-2xl font-bold mt-4">Forgot Password?</h1>
          </div>

          {error && (
            <div className="p-3 bg-red-100 text-red-600 rounded">
              {error}
            </div>
          )}

          <input
            type="email"
            name="email"
            value={values.email}
            onChange={handleChange}
            placeholder="Enter your email"
            className="w-full border p-2 rounded"
          />

          {errors.email && touched.email && (
            <p className="text-red-500 text-sm">{errors.email}</p>
          )}

          <PrimaryButton
            label={isLoading ? "Verifying..." : "Verify Email"}
            type="submit"
          />

          <Link to="/" className="text-sm text-[#00C6D7] flex gap-2 justify-center">
            <FaArrowLeft /> Back to Sign In
          </Link>
        </Form>
      )}
    </Formik>
  );
}
