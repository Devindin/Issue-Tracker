import React from "react";
import LoginHeadings from "../Components/LoginHeadings";
import LoginSecondaryHeadding from "../Components/LoginSecondaryHeadding";
import InputField from "../Components/InputField";
import { Formik, Form } from "formik";
import PrimaryButton from "../Components/PrimaryButton";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../Components/Footer";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";

interface LoginFormValues {
  email: string;
  password: string;
}

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

  const handleSubmit = (values: LoginFormValues): void => {
    console.log("Form submitted:", values);
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0A3D91] via-[#1976D2] to-[#00C6D7]">
      <motion.div
        className="grid lg:grid-cols-2 w-full max-w-6xl rounded-[32px] shadow-2xl overflow-hidden bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg border border-white/20"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* Left Image */}
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="hidden lg:block relative overflow-hidden rounded-l-[32px] bg-gradient-to-br from-[#0A3D91] via-[#1976D2] to-[#00C6D7] flex items-center justify-center"
        >
          <div className="text-white text-center p-8">
            <h2 className="text-2xl font-bold mb-4">Welcome Back!</h2>
            <p className="text-purple-100">Sign in to access your dashboard</p>
          </div>
        </motion.div>

        {/* Right Form */}
        <motion.div
          className="flex flex-col justify-between p-8 sm:p-10 lg:p-12"
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
              onSubmit={handleSubmit}
            >
              {({ handleChange, values, errors, touched }) => (
                <Form className="flex flex-col w-full max-w-md space-y-4">
                  <motion.div variants={itemVariants}>
                    <LoginHeadings content="Welcome Back" />
                  </motion.div>
                  <motion.div variants={itemVariants}>
                    <LoginSecondaryHeadding content="Sign in to your account" />
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
