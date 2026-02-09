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
        localStorage.setItem(
          "user",
          JSON.stringify({
            id: 1,
            name: "John Doe",
            email: values.email,
          }),
        );

        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Login error:", error);
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
                      to="/login-with-email-verification"
                      className="text-[#00C6D7] hover:text-[#1976D2] text-sm font-medium hover:underline transition-colors"
                    >
                      Forgot Password?
                    </Link>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <PrimaryButton label="Sign In" type="submit" />
                  </motion.div>

                  <motion.div variants={itemVariants} className="text-center mt-4">
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
