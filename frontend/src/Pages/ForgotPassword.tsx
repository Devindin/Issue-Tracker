import React, { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import PrimaryButton from "../Components/PrimaryButton";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../Components/Footer";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { FaArrowLeft, FaEnvelope, FaCheckCircle, FaLock } from "react-icons/fa";
import AuthBackground from "../Components/AuthBackground";
import { useVerifyEmailMutation, useResetPasswordMutation } from "../features/auth/authApi";
import InputField from "../Components/InputField";

interface ForgotPasswordFormValues {
  email: string;
}

interface ResetPasswordFormValues {
  newPassword: string;
  confirmPassword: string;
}

const forgotPasswordValidationSchema = Yup.object({
  email: Yup.string()
    .email("Please enter a valid email address")
    .required("Email is required"),
});

const resetPasswordValidationSchema = Yup.object({
  newPassword: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("New password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword")], "Passwords must match")
    .required("Please confirm your password"),
});

function ForgotPassword(): React.JSX.Element {
  const [step, setStep] = useState<'verify' | 'reset' | 'success'>('verify');
  const [verifiedEmail, setVerifiedEmail] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const [verifyEmail, { isLoading: isVerifying }] = useVerifyEmailMutation();
  const [resetPassword, { isLoading: isResetting }] = useResetPasswordMutation();

  // Motion variants
  const containerVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const handleSubmit = async (values: ForgotPasswordFormValues): Promise<void> => {
    try {
      setError('');
      console.log('Verifying email:', values.email);
      
      const result = await verifyEmail({ email: values.email }).unwrap();
      console.log('Verify email result:', result);
      
      if (result.exists) {
        // Email exists, move to reset password step (clear any previous errors)
        console.log('Email verified, moving to reset step');
        setVerifiedEmail(values.email);
        setError(''); // Clear errors before moving to next step
        setStep('reset');
      } else {
        // Email doesn't exist
        console.log('Email not found');
        setError('No account found with this email address');
      }
    } catch (err: any) {
      console.error("Verify email error:", err);
      // Only show error in verify step
      setError(err?.data?.message || 'No account found with this email address');
    }
  };

  const handleResetPassword = async (values: ResetPasswordFormValues): Promise<void> => {
    try {
      setError('');
      
      const result = await resetPassword({ 
        email: verifiedEmail,
        newPassword: values.newPassword 
      }).unwrap();
      
      if (result.success) {
        // Password reset successful (clear errors)
        setError('');
        setStep('success');
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/');
        }, 3000);
      }
    } catch (err: any) {
      console.error("Reset password error:", err);
      // Only show error in reset step
      setError(err?.data?.message || 'Failed to reset password. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0A3D91] via-[#1976D2] to-[#00C6D7] relative overflow-hidden p-6">
      <AuthBackground />

      <motion.div
        className="w-full max-w-md rounded-[32px] shadow-2xl overflow-hidden bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg border border-white/20 relative z-10"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* Form Section */}
        <motion.div
          className="flex flex-col justify-between p-8 sm:p-10"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            className="flex flex-col justify-center items-center flex-grow"
            variants={itemVariants}
          >
            {/* Step 1: Verify Email */}
            {step === 'verify' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="w-full"
              >
                <Formik
                  initialValues={{ email: "" }}
                  validationSchema={forgotPasswordValidationSchema}
                  onSubmit={handleSubmit}
                >
                  {({ handleChange, values, errors, touched }) => (
                    <Form className="flex flex-col w-full max-w-md space-y-4">
                      <div className="text-center mb-6">
                        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-[#00C6D7]/20 mb-4">
                          <FaEnvelope className="h-8 w-8 text-[#00C6D7]" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-800 mb-2">
                          Forgot Password?
                        </h1>
                        <p className="text-gray-600">
                          Enter your email address to verify your account.
                        </p>
                      </div>

                      {/* Only show errors in verify step */}
                      {error && (
                        <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                          {error}
                        </div>
                      )}

                      <InputField
                        label="Email Address"
                        name="email"
                        type="email"
                        placeholder="example@email.com"
                        required
                        handleChange={handleChange}
                        values={values}
                        errors={errors as Record<string, string>}
                        touched={touched as Record<string, boolean>}
                      />

                      <PrimaryButton 
                        label={isVerifying ? "Verifying..." : "Verify Email"} 
                        type="submit"
                        disabled={isVerifying}
                      />

                      <div className="text-center">
                        <Link
                          to="/"
                          className="inline-flex items-center gap-2 text-[#00C6D7] hover:text-[#1976D2] text-sm font-medium hover:underline transition-colors"
                        >
                          <FaArrowLeft className="text-xs" />
                          Back to Sign In
                        </Link>
                      </div>
                    </Form>
                  )}
                </Formik>
              </motion.div>
            )}

            {/* Step 2: Reset Password */}
            {step === 'reset' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="w-full"
              >
                <Formik
                  initialValues={{ newPassword: "", confirmPassword: "" }}
                  validationSchema={resetPasswordValidationSchema}
                  onSubmit={handleResetPassword}
                >
                  {({ handleChange, values, errors, touched }) => (
                    <Form className="flex flex-col w-full max-w-md space-y-4">
                      <div className="text-center mb-6">
                        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-[#00C6D7]/20 mb-4">
                          <FaLock className="h-8 w-8 text-[#00C6D7]" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-800 mb-2">
                          Reset Password
                        </h1>
                        <p className="text-gray-600">
                          Email verified! Now enter your new password.
                        </p>
                        <p className="text-sm text-gray-500 mt-2">
                          Email: <span className="font-medium">{verifiedEmail}</span>
                        </p>
                      </div>

                      {/* Only show errors in reset step */}
                      {error && (
                        <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                          {error}
                        </div>
                      )}

                      <InputField
                        label="New Password"
                        name="newPassword"
                        type="password"
                        placeholder="Enter new password"
                        required
                        handleChange={handleChange}
                        values={values}
                        errors={errors as Record<string, string>}
                        touched={touched as Record<string, boolean>}
                      />

                      <InputField
                        label="Confirm Password"
                        name="confirmPassword"
                        type="password"
                        placeholder="Confirm new password"
                        required
                        handleChange={handleChange}
                        values={values}
                        errors={errors as Record<string, string>}
                        touched={touched as Record<string, boolean>}
                      />

                      <PrimaryButton 
                        label={isResetting ? "Resetting..." : "Reset Password"} 
                        type="submit"
                        disabled={isResetting}
                      />

                      <div className="text-center">
                        <button
                          type="button"
                          onClick={() => {
                            setStep('verify');
                            setError('');
                          }}
                          className="inline-flex items-center gap-2 text-[#00C6D7] hover:text-[#1976D2] text-sm font-medium hover:underline transition-colors"
                        >
                          <FaArrowLeft className="text-xs" />
                          Back to Email Verification
                        </button>
                      </div>
                    </Form>
                  )}
                </Formik>
              </motion.div>
            )}

            {/* Step 3: Success */}
            {step === 'success' && (
              <motion.div
                className="text-center"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                  <FaCheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                  Password Reset Successfully!
                </h1>
                <p className="text-gray-600 mb-6">
                  Your password has been reset successfully. You can now sign in with your new password.
                </p>
                <p className="text-sm text-gray-500 mb-6">
                  Redirecting to sign in page in 3 seconds...
                </p>
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#0A3D91] to-[#00C6D7] hover:from-[#1976D2] hover:to-[#1976D2] text-white rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                >
                  <FaArrowLeft className="text-sm" />
                  Sign In Now
                </Link>
              </motion.div>
            )}
          </motion.div>

          <motion.div
            className="flex justify-center mt-6"
            variants={itemVariants}
          >
            <Footer />
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default ForgotPassword;