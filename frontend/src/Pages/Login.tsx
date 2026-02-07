import React from "react";
import LoginHeadings from "../Components/LoginHeadings";
import LoginSecondaryHeadding from "../Components/LoginSecondaryHeadding";
import InputField from "../Components/InputField";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import PrimaryButton from "../Components/PrimaryButton";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../Components/Footer";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";

interface LoginFormValues {
  email: string;
  password: string;
}

const loginValidationSchema = Yup.object({
  email: Yup.string()
    .email("Please enter a valid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

function Login(): React.JSX.Element {
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

  const handleSubmit = async (values: LoginFormValues): Promise<void> => {
    try {
      // TODO: Replace with actual API call
      console.log("Form submitted:", values);

      // Mock authentication - in real app, this would be an API call
      if (values.email && values.password) {
        // Store user data in localStorage (mock)
        localStorage.setItem("authToken", "mock-jwt-token");
        localStorage.setItem("user", JSON.stringify({
          id: 1,
          name: "John Doe",
          email: values.email
        }));

        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Login error:", error);
      // In a real app, you would show an error message here
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0A3D91] via-[#1976D2] to-[#00C6D7]">
      <motion.div
        className="w-full max-w-md rounded-[32px] shadow-2xl overflow-hidden bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg border border-white/20"
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
            <Formik
              initialValues={{ email: "", password: "" }}
              validationSchema={loginValidationSchema}
              onSubmit={handleSubmit}
            >
              {({ handleChange, values, errors, touched }) => (
                <Form className="flex flex-col w-full max-w-md space-y-4">
    

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
                      to="/login-with-email-verification"
                      className="text-[#00C6D7] hover:text-[#1976D2] text-sm font-medium hover:underline transition-colors"
                    >
                      Forgot Password?
                    </Link>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <PrimaryButton label="Sign In" type="submit" />
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
