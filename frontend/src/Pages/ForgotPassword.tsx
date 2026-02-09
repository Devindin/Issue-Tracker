import React, { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import PrimaryButton from "../Components/PrimaryButton";
import { Link } from "react-router-dom";
import Footer from "../Components/Footer";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { FaArrowLeft, FaEnvelope, FaCheckCircle } from "react-icons/fa";
import AuthBackground from "../Components/AuthBackground";

interface ForgotPasswordFormValues {
  email: string;
}

const forgotPasswordValidationSchema = Yup.object({
  email: Yup.string()
    .email("Please enter a valid email address")
    .required("Email is required"),
});

function ForgotPassword(): React.JSX.Element {
  const [isSubmitted, setIsSubmitted] = useState(false);

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
      // TODO: Replace with actual API call
      console.log("Forgot password request:", values);

      // Mock API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      setIsSubmitted(true);
    } catch (error) {
      console.error("Forgot password error:", error);
      // In a real app, you would show an error message here
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0A3D91] via-[#1976D2] to-[#00C6D7] relative overflow-hidden">
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
            {!isSubmitted ? (
              <Formik
                initialValues={{ email: "" }}
                validationSchema={forgotPasswordValidationSchema}
                onSubmit={handleSubmit}
              >
                {({ handleChange, values, errors, touched }) => (
                  <Form className="flex flex-col w-full max-w-md space-y-4">
                    <motion.div variants={itemVariants} className="text-center mb-6">
                      <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-[#00C6D7]/20 mb-4">
                        <FaEnvelope className="h-8 w-8 text-[#00C6D7]" />
                      </div>
                      <h1 className="text-2xl font-bold text-gray-800 mb-2">
                        Forgot Password?
                      </h1>
                      <p className="text-gray-600">
                        Enter your email address and we'll send you a link to reset your password.
                      </p>
                    </motion.div>

                    <motion.div variants={itemVariants}>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        placeholder="example@email.com"
                        value={values.email}
                        onChange={handleChange}
                        className={`w-full h-[36px] px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00C6D7] focus:border-transparent transition-colors ${
                          errors.email && touched.email
                            ? "border-red-500 focus:ring-red-500"
                            : "border-gray-300"
                        }`}
                      />
                      {errors.email && touched.email && (
                        <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                      )}
                    </motion.div>

                    <motion.div variants={itemVariants}>
                      <PrimaryButton label="Send Reset Link" type="submit" />
                    </motion.div>

                    <motion.div variants={itemVariants} className="text-center">
                      <Link
                        to="/"
                        className="inline-flex items-center gap-2 text-[#00C6D7] hover:text-[#1976D2] text-sm font-medium hover:underline transition-colors"
                      >
                        <FaArrowLeft className="text-xs" />
                        Back to Sign In
                      </Link>
                    </motion.div>
                  </Form>
                )}
              </Formik>
            ) : (
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
                  Check Your Email
                </h1>
                <p className="text-gray-600 mb-6">
                  We've sent a password reset link to your email address. Please check your inbox and follow the instructions to reset your password.
                </p>
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#0A3D91] to-[#00C6D7] hover:from-[#1976D2] hover:to-[#1976D2] text-white rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                >
                  <FaArrowLeft className="text-sm" />
                  Back to Sign In
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