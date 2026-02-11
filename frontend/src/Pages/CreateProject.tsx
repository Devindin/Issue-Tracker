import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { FaSave, FaTimes, FaInfoCircle } from "react-icons/fa";
import PageLayout from "../Layout/PageLayout";
import PageTitle from "../Components/PageTitle";
import StatusModal from "../Components/StatusModal";
import { useCreateProjectMutation } from "../features/projects/projectApi";
import ErrorModal from "../Components/ErrorModal";

// Validation schema
const validationSchema = Yup.object({
  name: Yup.string()
    .min(3, "Name must be at least 3 characters")
    .max(100, "Name must be less than 100 characters")
    .required("Name is required"),
  key: Yup.string()
    .min(2, "Key must be at least 2 characters")
    .max(10, "Key must be less than 10 characters")
    .matches(/^[A-Z][A-Z0-9]*$/, "Key must start with a letter and contain only uppercase letters and numbers")
    .required("Key is required"),
  description: Yup.string().max(500, "Description must be less than 500 characters"),
  color: Yup.string(),
  icon: Yup.string(),
});

const CreateProject: React.FC = () => {
  const navigate = useNavigate();
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const [createdProjectId, setCreatedProjectId] = useState<string | null>(null);
  const [createdProjectName, setCreatedProjectName] = useState<string>("");
  const [errorModalOpen, setErrorModalOpen] = useState(false);
const [errorMessage, setErrorMessage] = useState("");
  const [createProject, { isLoading }] = useCreateProjectMutation();

  const colors = [
    { name: "Indigo", value: "#6366f1" },
    { name: "Blue", value: "#3b82f6" },
    { name: "Green", value: "#10b981" },
    { name: "Red", value: "#ef4444" },
    { name: "Purple", value: "#a855f7" },
    { name: "Pink", value: "#ec4899" },
    { name: "Orange", value: "#f97316" },
    { name: "Teal", value: "#14b8a6" },
  ];

  const icons = ["📁", "🚀", "💼", "🎯", "⚡", "🔥", "💡", "🌟", "🎨", "🔧", "📊", "🏆"];

  const handleSubmit = async (values: any) => {
  try {
    // Clear previous error
    setErrorMessage("");
    setErrorModalOpen(false);

    const result = await createProject({
      name: values.name,
      key: values.key.toUpperCase(),
      description: values.description || undefined,
      color: values.color,
      icon: values.icon,
    }).unwrap();

    setCreatedProjectId(result._id);
    setCreatedProjectName(result.name);
    setShowSuccessModal(true);

  } catch (error: any) {
    console.error("Error creating project:", error);

    const message =
      error?.data?.message ||
      error?.message ||
      "Failed to create project. Please try again.";

    setErrorMessage(message);
    setErrorModalOpen(true);
  }
};


  return (
    <PageLayout>
      <div className="space-y-6 max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <PageTitle
            title="Create New Project"
            subtitle="Set up a new project to organize your issues"
            textColor="text-white"
          />
        </motion.div>

        {/* Form */}
        <Formik
          initialValues={{
            name: "",
            key: "",
            description: "",
            color: "#6366f1",
            icon: "📁",
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, setFieldValue }) => (
            <Form className="space-y-6">

              {/* Basic Information Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-white rounded-2xl shadow-md p-6"
              >
                <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                  <FaInfoCircle className="text-indigo-600" />
                  Basic Information
                </h2>

                {/* Project Name */}
                <div className="mb-6">
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                    Project Name <span className="text-red-500">*</span>
                  </label>
                  <Field
                    as="input"
                    id="name"
                    name="name"
                    type="text"
                    maxLength={100}
                    placeholder="e.g., Website Redesign"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                  <ErrorMessage name="name" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                {/* Project Key */}
                <div className="mb-6">
                  <label htmlFor="key" className="block text-sm font-semibold text-gray-700 mb-2">
                    Project Key <span className="text-red-500">*</span>
                  </label>
                  <Field
                    as="input"
                    id="key"
                    name="key"
                    type="text"
                    maxLength={10}
                    placeholder="e.g., WEB"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all uppercase"
                    onChange={(e: any) => setFieldValue("key", e.target.value.toUpperCase())}
                  />
                  <ErrorMessage name="key" component="div" className="text-red-500 text-sm mt-1" />
                  <p className="text-xs text-gray-500 mt-1">
                    A unique identifier for your project (e.g., WEB, API, MOB). Must start with a letter.
                  </p>
                </div>

                {/* Description */}
                <div className="mb-6">
                  <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
                    Description
                  </label>
                  <Field
                    as="textarea"
                    id="description"
                    name="description"
                    rows={4}
                    maxLength={500}
                    placeholder="Describe the purpose and goals of this project..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
                  />
                  <ErrorMessage name="description" component="div" className="text-red-500 text-sm mt-1" />
                  <div className="flex justify-end mt-1">
                    <span className="text-xs text-gray-500">
                      {values.description.length}/500
                    </span>
                  </div>
                </div>

                {/* Color Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Project Color
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {colors.map((color) => (
                      <button
                        key={color.value}
                        type="button"
                        onClick={() => setFieldValue("color", color.value)}
                        className={`w-12 h-12 rounded-lg transition-all ${
                          values.color === color.value
                            ? "ring-4 ring-offset-2 ring-indigo-500 scale-110"
                            : "hover:scale-105"
                        }`}
                        style={{ backgroundColor: color.value }}
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>

                {/* Icon Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Project Icon
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {icons.map((icon) => (
                      <button
                        key={icon}
                        type="button"
                        onClick={() => setFieldValue("icon", icon)}
                        className={`w-14 h-14 text-2xl rounded-lg border-2 transition-all ${
                          values.icon === icon
                            ? "border-indigo-500 bg-indigo-50 scale-110"
                            : "border-gray-200 hover:border-indigo-300 hover:scale-105"
                        }`}
                      >
                        {icon}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Preview */}
                <div className="mt-8 p-4 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                  <p className="text-sm font-semibold text-gray-700 mb-3">Preview</p>
                  <div className="flex items-center gap-4">
                    <div
                      className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl"
                      style={{ backgroundColor: `${values.color}20` }}
                    >
                      {values.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800 text-lg">
                        {values.name || "Project Name"}
                      </h3>
                      <p className="text-sm text-gray-500 font-mono">
                        {values.key || "KEY"}
                      </p>
                      {values.description && (
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                          {values.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex gap-4"
              >
                <Link to="/projects" className="flex-1">
                  <button
                    type="button"
                    className="w-full px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                  >
                    <FaTimes /> Cancel
                  </button>
                </Link>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <FaSave /> {isLoading ? "Creating..." : "Create Project"}
                </button>
              </motion.div>
            </Form>
          )}
        </Formik>
      </div>

      {/* Success Modal */}
      <StatusModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        type="success"
        title="Project Created!"
        message={`Your project <span class="font-semibold text-indigo-600">${createdProjectName}</span> has been created successfully.`}
        primaryAction={{
          label: "View Project",
          to: `/projects/${createdProjectId}`,
          onClick: () => navigate(`/projects/${createdProjectId}`),
        }}
        secondaryAction={{
          label: "Create Another Project",
          onClick: () => {
            setShowSuccessModal(false);
            window.location.reload();
          },
        }}
      />
      <ErrorModal
  isOpen={errorModalOpen}
  onClose={() => setErrorModalOpen(false)}
  title="Project Creation Failed"
  message={errorMessage}
/>

    </PageLayout>
  );
};

export default CreateProject;
