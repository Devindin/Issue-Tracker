import React, { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import PrimaryButton from "../Components/PrimaryButton";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../Components/Footer";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { FaArrowLeft, FaEnvelope, FaCheckCircle } from "react-icons/fa";

interface ForgotPasswordFormValues {
  email: string;
}

const forgotPasswordValidationSchema = Yup.object({
  email: Yup.string()
    .email("Please enter a valid email address")
    .required("Email is required"),
});

function ForgotPassword(): React.JSX.Element {
  const navigate = useNavigate();
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
      {/* Background Shapes */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Large Circle */}
        <motion.div
          className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Small Circle */}
        <motion.div
          className="absolute top-40 right-20 w-16 h-16 bg-[#00C6D7]/20 rounded-full blur-lg"
          animate={{
            y: [0, -20, 0],
            x: [0, 10, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Triangle */}
        <motion.div
          className="absolute bottom-32 left-1/4 w-0 h-0 border-l-[30px] border-r-[30px] border-b-[52px] border-l-transparent border-r-transparent border-b-white/15 blur-sm"
          animate={{
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        {/* Square */}
        <motion.div
          className="absolute bottom-20 right-1/3 w-20 h-20 bg-[#1976D2]/20 rotate-45 blur-lg"
          animate={{
            scale: [1, 1.3, 1],
            rotate: [45, 135, 45],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Floating Dots */}
        <motion.div
          className="absolute top-1/3 left-1/2 w-3 h-3 bg-white/30 rounded-full"
          animate={{
            y: [0, -30, 0],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <motion.div
          className="absolute top-2/3 right-1/4 w-2 h-2 bg-[#00C6D7]/40 rounded-full"
          animate={{
            y: [0, 25, 0],
            x: [0, -15, 0],
          }}
          transition={{
            duration: 3.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />

        {/* Hexagon */}
        <motion.div
          className="absolute top-1/2 left-20 w-12 h-12 bg-gradient-to-r from-[#1976D2]/20 to-[#00C6D7]/20 blur-sm"
          style={{
            clipPath: 'polygon(50% 0%, 93.3% 25%, 93.3% 75%, 50% 100%, 6.7% 75%, 6.7% 25%)',
          }}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

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