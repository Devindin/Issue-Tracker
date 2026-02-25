import React, { useState } from "react";
import InputField from "../Components/InputField";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import PrimaryButton from "../Components/PrimaryButton";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Footer from "../Components/Footer";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import AuthBackground from "../Components/AuthBackground";
import Logo from "../assets/logo.png";
import { useLoginMutation } from "../features/auth/authApi";
import { useDispatch } from "react-redux";
import { setCredentials } from "../features/auth/authSlice";

interface LoginFormValues {
  email: string;
  password: string;
}

const bannedPasswords = [
  // Most common
  "123456",
  "12345678",
  "123456789",
  "password",
  "password123",
  "qwerty",
  "qwerty123",
  "abc123",
  "letmein",
  "welcome",
  "admin",
  "admin123",
  "123",
  "456",
  "12345",
  "1234567",

  // Sequential numbers
  "123123",
  "123321",
  "654321",
  "000000",
  "111111",
  "222222",

  // Keyboard patterns
  "asdfgh",
  "zxcvbn",
  "asdf1234",
  "qwertyuiop",
  "1q2w3e4r",

  // Common simple words
  "iloveyou",
  "football",
  "monkey",
  "dragon",
  "sunshine",
  "princess",

  // Year-based
  "2023",
  "2024",
  "2025",
  "password2024",
  "welcome2025",

  // Default device passwords
  "root",
  "root123",
  "guest",
  "test123",
];

const loginValidationSchema = Yup.object({
  email: Yup.string()
    .email("Please enter a valid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .max(12, "Password must be at most 12 characters")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/\d/, "Password must contain at least one number")
    .matches(
      /[!@#$%^&*(),.?":{}|<>]/,
      "Password must contain at least one special character",
    )
    .test(
      "weak-pattern-check",
      "Password contains weak or common patterns.",
      (value) => {
        if (!value) return true;

        const lower = value.toLowerCase();

        const containsBanned = bannedPasswords.some((word) =>
          lower.includes(word),
        );

        const repeated = /^(.)\1+$/.test(value);
        const sequential = /(1234|2345|3456|4567|5678|6789)/.test(value);

        return !(containsBanned || repeated || sequential);
      },
    )
    .required("Password is required"),
});

function Login(): React.JSX.Element {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();
  const [submitError, setSubmitError] = useState<string>("");

  // Get the intended destination from location state, default to dashboard
  const from = location.state?.from?.pathname || "/dashboard";

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

  const handleSubmit = async (values: LoginFormValues): Promise<void> => {
    if (isLoading) return; // prevent duplicate submit
    setSubmitError("");
    try {
      const result = await login({
        email: values.email,
        password: values.password,
      }).unwrap();

      dispatch(
        setCredentials({
          user: result?.user || null,
          token: result?.token || null,
        }),
      );

      navigate(from);
    } catch (error: any) {
      console.error("Login error:", error);
      const message =
        error?.data?.message ||
        error?.data?.error ||
        error?.message ||
        error?.error ||
        "Login failed. Please try again.";
      setSubmitError(message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0A3D91] via-[#1976D2] to-[#00C6D7] relative overflow-hidden p-2">
      <AuthBackground />

      <motion.div
        className="w-full max-w-md rounded-[32px] shadow-2xl overflow-hidden bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg border border-white/20 relative z-10"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* Form */}
        <motion.div
          className="flex flex-col justify-between p-8 sm:p-10"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <img src={Logo} alt="Logo" className="w-40 mx-auto " />
          <motion.div
            className="flex flex-col justify-center items-center flex-grow"
            variants={itemVariants}
          >
            <Formik
              initialValues={{ email: "", password: "" }}
              validationSchema={loginValidationSchema}
              onSubmit={handleSubmit}
            >
              {({ handleChange, values, errors, touched }) => (
                <Form className="flex flex-col w-full max-w-md space-y-2">
                  <motion.div variants={itemVariants}>
                    <InputField
                      label="Email"
                      name="email"
                      type="email"
                      placeholder="example@email.com"
                      handleChange={handleChange}
                      values={values}
                      errors={errors}
                      touched={touched}
                    />
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <InputField
                      label="Password"
                      name="password"
                      type="password"
                      placeholder="••••••••"
                      handleChange={handleChange}
                      values={values}
                      errors={errors}
                      touched={touched}
                    />
                  </motion.div>

                  <motion.div variants={itemVariants} className="text-right">
                    <Link
                      to="/forgot-password"
                      className="text-[#00C6D7] hover:text-[#1976D2] text-sm font-medium hover:underline transition-colors"
                    >
                      Forgot Password?
                    </Link>
                  </motion.div>
                  {submitError && (
                    <div
                      role="alert"
                      aria-live="assertive"
                      className="mb-2 rounded-md px-3 py-2 text-sm text-red-700"
                    >
                      {submitError}
                    </div>
                  )}
                  <motion.div variants={itemVariants}>
                    <PrimaryButton
                      label={isLoading ? "Signing In..." : "Sign In"}
                      type="submit"
                      disabled={isLoading}
                    />
                  </motion.div>

                  <motion.div
                    variants={itemVariants}
                    className="text-center mt-4"
                  >
                    <span className="text-gray-600 dark:text-gray-400 text-sm">
                      Don't have an account?{" "}
                      <Link
                        to="/register"
                        className="text-[#00C6D7] hover:text-[#1976D2] font-medium hover:underline transition-colors"
                      >
                        Sign up
                      </Link>
                    </span>
                  </motion.div>
                </Form>
              )}
            </Formik>
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

export default Login;
