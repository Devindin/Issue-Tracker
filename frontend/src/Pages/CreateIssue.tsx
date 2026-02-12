import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useSelector } from "react-redux";
import {
  FaSave,
  FaTimes,
  FaExclamationTriangle,
  FaInfoCircle,
} from "react-icons/fa";
import PageLayout from "../Layout/PageLayout";
import PageTitle from "../Components/PageTitle";
import StatusModal from "../modals/StatusModal";
import { type IssueFormData } from "../types";
import { useCreateIssueMutation } from "../features/issues/issueApi";
import { useGetProjectsQuery } from "../features/projects/projectApi";
import { useGetUsersQuery } from "../features/users/userApi";
import InputField from "../Components/InputField";

// Validation schema
const validationSchema = Yup.object({
  title: Yup.string()
    .min(5, "Title must be at least 5 characters")
    .max(100, "Title must be less than 100 characters")
    .required("Title is required"),
  description: Yup.string()
    .min(10, "Description must be at least 10 characters")
    .max(1000, "Description must be less than 1000 characters")
    .required("Description is required"),
  status: Yup.string()
    .oneOf(["Open", "In Progress", "Resolved", "Closed"], "Invalid status")
    .required("Status is required"),
  priority: Yup.string()
    .oneOf(["Low", "Medium", "High", "Critical"], "Invalid priority")
    .required("Priority is required"),
  severity: Yup.string()
    .oneOf(["Minor", "Major", "Critical"], "Invalid severity")
    .required("Severity is required"),
  assigneeId: Yup.string(),
  projectId: Yup.string(),
});

const statusOptions = [
  { value: "Open", label: "Open" },
  { value: "In Progress", label: "In Progress" },
  { value: "Resolved", label: "Resolved" },
  { value: "Closed", label: "Closed" },
];

const priorityOptions = [
  { value: "Low", label: "Low" },
  { value: "Medium", label: "Medium" },
  { value: "High", label: "High" },
  { value: "Critical", label: "Critical" },
];

const severityOptions = [
  { value: "Minor", label: "Minor" },
  { value: "Major", label: "Major" },
  { value: "Critical", label: "Critical" },
];

const CreateIssue: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state: any) => state.auth);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const [createdIssueId, setCreatedIssueId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isErrorModalOpen, setErrorModalOpen] = useState<boolean>(false);
  const [createIssue, { isLoading }] = useCreateIssueMutation();
  const { data: projects = [] } = useGetProjectsQuery({ status: "active" });
  const { data: users = [] } = useGetUsersQuery();

  // Character count limits
  const TITLE_MAX_LENGTH = 100;
  const DESCRIPTION_MAX_LENGTH = 1000;

  // Handle form submission
  const handleSubmit = async (values: IssueFormData, resetForm?: () => void) => {
    try {
      setErrorMessage("");
      setErrorModalOpen(false);

      let assigneeId: string | undefined = undefined;

      if (values.assigneeId === "me" && user?.id) {
        assigneeId = user.id;
      } else if (values.assigneeId && values.assigneeId !== "") {
        assigneeId = values.assigneeId;
      }

      const payload: any = {
        title: values.title,
        description: values.description,
        status: values.status,
        priority: values.priority,
        severity: values.severity,
        assigneeId,
        projectId: values.projectId || undefined,
      };

      const result = await createIssue(payload).unwrap();

      setCreatedIssueId(result?.issue?.id?.toString() || null);
      setShowSuccessModal(true);
      
      // Reset form after successful issue creation
      if (resetForm) {
        resetForm();
      }
    } catch (error: any) {
      console.error("Error creating issue:", error);

      const message =
        error?.data?.message ||
        error?.data?.error ||
        error?.message ||
        "Failed to create issue. Please try again.";

      setErrorMessage(message);
      setErrorModalOpen(true);
    }
  };

  // Get priority color classes
  const getPriorityColor = (priority: string) => {
    const colors = {
      Low: "bg-gray-100 border-gray-300 text-gray-700",
      Medium: "bg-orange-100 border-orange-300 text-orange-700",
      High: "bg-red-100 border-red-300 text-red-700",
      Critical: "bg-purple-100 border-purple-300 text-purple-700",
    };
    return colors[priority as keyof typeof colors];
  };

  const getSeverityColor = (severity: string) => {
    const colors = {
      Minor: "bg-blue-100 border-blue-300 text-blue-700",
      Major: "bg-yellow-100 border-yellow-300 text-yellow-700",
      Critical: "bg-red-100 border-red-300 text-red-700",
    };
    return colors[severity as keyof typeof colors];
  };

  const getStatusColor = (status: string) => {
    const colors = {
      Open: "bg-blue-100 border-blue-300 text-blue-700",
      "In Progress": "bg-yellow-100 border-yellow-300 text-yellow-700",
      Resolved: "bg-green-100 border-green-300 text-green-700",
      Closed: "bg-gray-100 border-gray-300 text-gray-700",
    };
    return colors[status as keyof typeof colors];
  };

  return (
    <PageLayout>
      <div className=" mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        >
          <div className="flex items-center gap-4 mb-4">
            <PageTitle
              title="Create New Issue"
              subtitle="Fill in the details below to report a new issue"
              textColor="text-white"
            />
          </div>
        </motion.div>

        {/* Form */}
        <Formik
          initialValues={{
            title: "",
            description: "",
            status: "Open",
            priority: "Medium",
            severity: "Minor",
            assigneeId: "",
            projectId: "",
          }}
          validationSchema={validationSchema}
          onSubmit={async (values, { resetForm }) => {
            await handleSubmit(values, resetForm);
          }}
        >
          {({ isSubmitting, values, errors, touched, handleChange }) => {
            // Create dynamic options
            const projectOptions = projects.map((project) => ({
              value: project._id,
              label: `${project.icon} ${project.name} (${project.key})`,
            }));

            const assigneeOptions = [
              { value: "me", label: "👤 Assign to me" },
              ...users.map((user) => ({
                value: user.id,
                label: `${user.name} (${user.email})`,
              })),
            ];

            return (
            <Form className="space-y-6">
              {/* Main Information Card */}
              <div className="bg-white rounded-2xl shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                  <FaInfoCircle className="text-indigo-600" />
                  Basic Information
                </h2>

                <div className="space-y-4">
                  <InputField
                    label="Issue Title"
                    name="title"
                    type="text"
                    placeholder="e.g., Login page not responsive on mobile devices"
                    required
                    handleChange={handleChange}
                    values={values}
                    errors={errors as Record<string, string>}
                    touched={touched as Record<string, boolean>}
                  />
                  <div className="flex justify-end -mt-2">
                    <span
                      className={`text-xs ${
                        values.title.length > TITLE_MAX_LENGTH * 0.9
                          ? "text-red-500"
                          : "text-gray-500"
                      }`}
                    >
                      {values.title.length}/{TITLE_MAX_LENGTH}
                    </span>
                  </div>

                  <InputField
                    label="Description"
                    name="description"
                    type="textarea"
                    placeholder="Provide a detailed description of the issue, including steps to reproduce, expected behavior, and actual behavior..."
                    required
                    handleChange={handleChange}
                    values={values}
                    errors={errors as Record<string, string>}
                    touched={touched as Record<string, boolean>}
                  />
                  <div className="flex justify-end -mt-2">
                    <span
                      className={`text-xs ${
                        values.description.length > DESCRIPTION_MAX_LENGTH * 0.9
                          ? "text-red-500"
                          : "text-gray-500"
                      }`}
                    >
                      {values.description.length}/{DESCRIPTION_MAX_LENGTH}
                    </span>
                  </div>
                </div>
              </div>

              {/* Classification Card */}
              <div className="bg-white rounded-2xl shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                  <FaExclamationTriangle className="text-indigo-600" />
                  Classification
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Status */}
                  <div>
                    <InputField
                      label="Status"
                      name="status"
                      type="select"
                      options={statusOptions}
                      handleChange={handleChange}
                      values={values}
                      errors={errors as Record<string, string>}
                      touched={touched as Record<string, boolean>}
                    />
                    <div className="mt-2">
                      <span
                        className={`inline-block px-3 py-1.5 rounded-lg text-xs font-semibold border ${getStatusColor(
                          values.status,
                        )}`}
                      >
                        {values.status}
                      </span>
                    </div>
                  </div>

                  {/* Priority */}
                  <div>
                    <InputField
                      label="Priority"
                      name="priority"
                      type="select"
                      options={priorityOptions}
                      handleChange={handleChange}
                      values={values}
                      errors={errors as Record<string, string>}
                      touched={touched as Record<string, boolean>}
                    />
                    <div className="mt-2">
                      <span
                        className={`inline-block px-3 py-1.5 rounded-lg text-xs font-semibold border ${getPriorityColor(
                          values.priority,
                        )}`}
                      >
                        {values.priority}
                      </span>
                    </div>
                  </div>

                  {/* Severity */}
                  <div>
                    <InputField
                      label="Severity"
                      name="severity"
                      type="select"
                      options={severityOptions}
                      handleChange={handleChange}
                      values={values}
                      errors={errors as Record<string, string>}
                      touched={touched as Record<string, boolean>}
                    />
                    <div className="mt-2">
                      <span
                        className={`inline-block px-3 py-1.5 rounded-lg text-xs font-semibold border ${getSeverityColor(
                          values.severity,
                        )}`}
                      >
                        {values.severity}
                      </span>
                    </div>
                  </div>

                  {/* Project */}
                  <div>
                    <InputField
                      label="Project"
                      name="projectId"
                      type="select"
                      options={projectOptions}
                      placeholder="No Project"
                      handleChange={handleChange}
                      values={values}
                      errors={errors as Record<string, string>}
                      touched={touched as Record<string, boolean>}
                    />
                    {values.projectId && (
                      <div className="mt-2">
                        <span className="inline-block px-3 py-1.5 rounded-lg text-xs font-semibold border bg-indigo-100 border-indigo-300 text-indigo-700">
                          {
                            projects.find((p) => p._id === values.projectId)
                              ?.icon
                          }{" "}
                          {
                            projects.find((p) => p._id === values.projectId)
                              ?.name
                          }
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Assignee */}
                  <div>
                    <InputField
                      label="Assignee"
                      name="assigneeId"
                      type="select"
                      options={assigneeOptions}
                      placeholder="Unassigned"
                      handleChange={handleChange}
                      values={values}
                      errors={errors as Record<string, string>}
                      touched={touched as Record<string, boolean>}
                    />
                    <div className="mt-2">
                      <span
                        className={`inline-block px-3 py-1.5 rounded-lg text-xs font-semibold border ${
                          values.assigneeId
                            ? "bg-green-100 border-green-300 text-green-700"
                            : "bg-gray-100 border-gray-300 text-gray-700"
                        }`}
                      >
                        {values.assigneeId === "me"
                          ? "👤 Assigned to me"
                          : values.assigneeId
                            ? `Assigned to ${users.find((u) => u.id === values.assigneeId)?.name || "User"}`
                            : "Unassigned"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Info Box */}
                <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <div className="flex gap-3">
                    <FaInfoCircle className="text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-800">
                      <p className="font-semibold mb-1">
                        Classification Guide:
                      </p>
                      <ul className="space-y-1 text-xs">
                        <li>
                          <strong>Priority:</strong> How quickly the issue needs
                          to be addressed
                        </li>
                        <li>
                          <strong>Severity:</strong> The impact of the issue on
                          the system
                        </li>
                        <li>
                          <strong>Status:</strong> Current state of the issue
                        </li>
                        <li>
                          <strong>Assignee:</strong> Team member responsible for
                          resolving the issue
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex flex-col sm:flex-row gap-4">
                <motion.button
                  type="submit"
                  disabled={isSubmitting || isLoading}
                  whileHover={{ scale: isSubmitting || isLoading ? 1 : 1.02 }}
                  whileTap={{ scale: isSubmitting || isLoading ? 1 : 0.98 }}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-indigo-600 text-white rounded-xl font-semibold shadow-lg shadow-indigo-200 hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed transition-all"
                >
                  {isSubmitting || isLoading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      >
                        <FaSave />
                      </motion.div>
                      Creating Issue...
                    </>
                  ) : (
                    <>
                      <FaSave /> Create Issue
                    </>
                  )}
                </motion.button>

                <Link to="/issues" className="flex-1">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all"
                  >
                    <FaTimes /> Cancel
                  </motion.button>
                </Link>
              </div>
            </Form>
            );
          }}
        </Formik>
      </div>

      {/* Success Modal */}
      <StatusModal
        isOpen={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false);
          navigate("/issues");
        }}
        type="success"
        title="Issue Created Successfully!"
        message={`Your issue has been created with ID <span class="font-semibold text-indigo-600">#${createdIssueId}</span>`}
        primaryAction={{
          label: "View Issue",
          to: `/issues/${createdIssueId}`,
        }}
        secondaryAction={{
          label: "Back to Issues",
          to: "/issues",
        }}
        tertiaryAction={{
          label: "Create Another Issue",
          onClick: () => {
            setShowSuccessModal(false);
            navigate("/issues/new");
          },
        }}
      />
      {/* Error Modal */}
      <StatusModal
        isOpen={isErrorModalOpen}
        onClose={() => setErrorModalOpen(false)}
        type="error"
        title="Issue Creation Failed"
        message={errorMessage}
        primaryAction={{
          label: "Try Again",
          onClick: () => setErrorModalOpen(false),
        }}
      />
    </PageLayout>
  );
};

export default CreateIssue;
