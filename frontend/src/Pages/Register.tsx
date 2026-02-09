import React from "react";
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

interface RegisterFormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const registerValidationSchema = Yup.object({
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
    try {
      // TODO: Replace with actual API call
      console.log("Registration submitted:", values);

      // Mock registration - in real app, this would be an API call
      if (values.name && values.email && values.password && values.confirmPassword) {
        // Store user data in localStorage (mock)
        localStorage.setItem("authToken", "mock-jwt-token");
        localStorage.setItem("user", JSON.stringify({
          id: 1,
          name: values.name,
          email: values.email
        }));

        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Registration error:", error);
      // In a real app, you would show an error message here
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
              initialValues={{ name: "", email: "", password: "", confirmPassword: "" }}
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
                    <PrimaryButton label="Sign Up" type="submit" />
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