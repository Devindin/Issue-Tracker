import React, { useState } from "react";
import InputField from "../Components/InputField";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import PrimaryButton from "../Components/PrimaryButton";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../Components/Footer";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import Logo from "../assets/logo.png";
import AuthBackground from "../Components/AuthBackground";
import { useRegisterCompanyMutation } from "../auth/authApi";

interface RegisterFormValues {
  companyName: string;
  companyDescription: string;
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const registerValidationSchema = Yup.object({
  companyName: Yup.string()
    .min(2, "Company name must be at least 2 characters")
    .required("Company name is required"),
  companyDescription: Yup.string().max(500, "Description is too long"),
  name: Yup.string()
    .min(2, "Name must be at least 2 characters")
    .required("Name is required"),
  email: Yup.string()
    .email("Please enter a valid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required("Please confirm your password"),
});

function Register(): React.JSX.Element {
  const navigate = useNavigate();
  const [registerCompany, { isLoading }] = useRegisterCompanyMutation();
  const [submitError, setSubmitError] = useState<string>("");

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

  const handleSubmit = async (values: RegisterFormValues): Promise<void> => {
    setSubmitError("");
    try {
      const result = await registerCompany({
        companyName: values.companyName,
        companyDescription: values.companyDescription,
        name: values.name,
        email: values.email,
        password: values.password,
      }).unwrap();

      if (result?.token) {
        localStorage.setItem("token", result.token);
      }

      navigate("/");
    } catch (error) {
      console.error("Register error:", error);
      const err = error as
        | { data?: { message?: string; error?: string } }
        | { message?: string }
        | { error?: string }
        | undefined;
      const message =
        err?.data?.message ||
        err?.data?.error ||
        err?.message ||
        err?.error ||
        "Registration failed. Please try again.";
      setSubmitError(message);
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0A3D91] via-[#1976D2] to-[#00C6D7] relative overflow-hidden p-10">
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
          <img src={Logo} alt="Logo" className="w-40 mx-auto " />
          <motion.div
            className="flex flex-col justify-center items-center flex-grow"
            variants={itemVariants}
          >
            <Formik
              initialValues={{
                companyName: "",
                companyDescription: "",
                name: "",
                email: "",
                password: "",
                confirmPassword: "",
              }}
              validationSchema={registerValidationSchema}
              onSubmit={handleSubmit}
            >
              {({ handleChange, values, errors, touched }) => (
                <Form className="flex flex-col w-full max-w-md space-y-1">
                  <motion.div variants={itemVariants}>
                    <h1 className="text-2xl font-bold text-gray-800 text-center  ">
                      Create Account
                    </h1>
                  </motion.div>
                  <motion.div variants={itemVariants}>
                    <p className="text-gray-600 text-center text-sm mb-2">
                      Sign up to get started
                    </p>
                  </motion.div>

                  {submitError && (
                    <div
                      role="alert"
                      aria-live="assertive"
                      className="mb-2 rounded-md border border-red-400 bg-red-50 px-3 py-2 text-sm text-red-700"
                    >
                      {submitError}
                    </div>
                  )}

                  <motion.div variants={itemVariants}>
                    <InputField
                      label="Company Name"
                      name="companyName"
                      type="text"
                      placeholder="Acme Inc."
                      handleChange={handleChange}
                      values={values}
                      errors={errors}
                      touched={touched}
                    />
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <InputField
                      label="Company Description"
                      name="companyDescription"
                      type="text"
                      placeholder="What does your company do?"
                      handleChange={handleChange}
                      values={values}
                      errors={errors}
                      touched={touched}
                    />
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <InputField
                      label="Full Name"
                      name="name"
                      type="text"
                      placeholder="John Doe"
                      handleChange={handleChange}
                      values={values}
                      errors={errors}
                      touched={touched}
                    />
                  </motion.div>

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

                  <motion.div variants={itemVariants}>
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
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <PrimaryButton
                      label={isLoading ? "Signing Up..." : "Sign Up"}
                      type="submit"
                    />
                  </motion.div>


                  <motion.div variants={itemVariants} className="text-center mt-4">
                    <span className="text-gray-600 dark:text-gray-400 text-sm">
                      Already have an account?{" "}
                      <Link
                        to="/"
                        className="text-[#00C6D7] hover:text-[#1976D2] font-medium hover:underline transition-colors"
                      >
                        Sign in
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

export default Register;