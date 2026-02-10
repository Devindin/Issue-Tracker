import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
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
import StatusModal from "../Components/StatusModal";
import { type IssueFormData } from "../types";
import { useCreateIssueMutation } from "../features/issues/issueApi";
import { useGetProjectsQuery } from "../features/projects/projectApi";

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

const CreateIssue: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state: any) => state.auth);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const [createdIssueId, setCreatedIssueId] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string>("");
  const [createIssue, { isLoading }] = useCreateIssueMutation();
  const { data: projects = [] } = useGetProjectsQuery({ status: "active" });

  // Character count limits
  const TITLE_MAX_LENGTH = 100;
  const DESCRIPTION_MAX_LENGTH = 1000;

  // Handle form submission
  const handleSubmit = async (values: IssueFormData) => {
    setSubmitError("");
    try {
      // Only send assigneeId if it's "me" (current user) or empty
      let assigneeId: string | undefined = undefined;
      if (values.assigneeId === "me" && user?.id) {
        assigneeId = user.id;
      }
      // Ignore all other mock user IDs (1-8) as they're not real MongoDB ObjectIds
      
      const payload = {
        title: values.title,
        description: values.description,
        status: values.status,
        priority: values.priority,
        severity: values.severity,
        assigneeId,
        projectId: values.projectId,
      };
      
      console.log("[CreateIssue] Form values:", values);
      console.log("[CreateIssue] Payload to send:", payload);
      console.log("[CreateIssue] ProjectId being sent:", payload.projectId);
      
      const result = await createIssue(payload).unwrap();
      
      console.log("[CreateIssue] Response from API:", result);
      console.log("[CreateIssue] Created issue project:", result.issue?.project);

      setCreatedIssueId(result?.issue?.id?.toString() || null);
      setShowSuccessModal(true);
    } catch (error: unknown) {
      console.error("Error creating issue:", error);
      const err = error as { data?: { message?: string; error?: string }; message?: string; error?: string };
      const message =
        err?.data?.message ||
        err?.data?.error ||
        err?.message ||
        err?.error ||
        "Failed to create issue. Please try again.";
      setSubmitError(message);
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
      <div className="max-w-4xl mx-auto">
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
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, values }) => (
            <Form className="space-y-6">
              {submitError && (
                <div
                  role="alert"
                  aria-live="assertive"
                  className="rounded-md border border-red-400 bg-red-50 px-3 py-2 text-sm text-red-700"
                >
                  {submitError}
                </div>
              )}
              {/* Main Information Card */}
              <div className="bg-white rounded-2xl shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                  <FaInfoCircle className="text-indigo-600" />
                  Basic Information
                </h2>

                {/* Title */}
                <div className="mb-6">
                  <label
                    htmlFor="title"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Issue Title <span className="text-red-500">*</span>
                  </label>
                  <Field
                    as="input"
                    id="title"
                    name="title"
                    type="text"
                    maxLength={TITLE_MAX_LENGTH}
                    placeholder="e.g., Login page not responsive on mobile devices"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                  <ErrorMessage name="title" component="div" className="text-red-500 text-sm mt-1 flex items-center gap-1" />
                  <div className="flex justify-end mt-1">
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
                </div>

                {/* Description */}
                <div className="mb-6">
                  <label
                    htmlFor="description"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Description <span className="text-red-500">*</span>
                  </label>
                  <Field
                    as="textarea"
                    id="description"
                    name="description"
                    maxLength={DESCRIPTION_MAX_LENGTH}
                    rows={6}
                    placeholder="Provide a detailed description of the issue, including steps to reproduce, expected behavior, and actual behavior..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
                  />
                  <ErrorMessage name="description" component="div" className="text-red-500 text-sm mt-1 flex items-center gap-1" />
                  <div className="flex justify-end mt-1">
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
                    <label
                      htmlFor="status"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Status
                    </label>
                    <div className="relative">
                      <Field
                        as="select"
                        id="status"
                        name="status"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none bg-white cursor-pointer"
                      >
                        <option value="Open">Open</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                        <option value="Closed">Closed</option>
                      </Field>
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                        <svg
                          className="w-4 h-4 text-gray-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>
                    </div>
                    <div className="mt-2">
                      <span
                        className={`inline-block px-3 py-1.5 rounded-lg text-xs font-semibold border ${getStatusColor(
                          values.status
                        )}`}
                      >
                        {values.status}
                      </span>
                    </div>
                  </div>

                  {/* Priority */}
                  <div>
                    <label
                      htmlFor="priority"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Priority
                    </label>
                    <div className="relative">
                      <Field
                        as="select"
                        id="priority"
                        name="priority"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none bg-white cursor-pointer"
                      >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                        <option value="Critical">Critical</option>
                      </Field>
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                        <svg
                          className="w-4 h-4 text-gray-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>
                    </div>
                    <div className="mt-2">
                      <span
                        className={`inline-block px-3 py-1.5 rounded-lg text-xs font-semibold border ${getPriorityColor(
                          values.priority
                        )}`}
                      >
                        {values.priority}
                      </span>
                    </div>
                  </div>

                  {/* Severity */}
                  <div>
                    <label
                      htmlFor="severity"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Severity
                    </label>
                    <div className="relative">
                      <Field
                        as="select"
                        id="severity"
                        name="severity"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none bg-white cursor-pointer"
                      >
                        <option value="Minor">Minor</option>
                        <option value="Major">Major</option>
                        <option value="Critical">Critical</option>
                      </Field>
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                        <svg
                          className="w-4 h-4 text-gray-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>
                    </div>
                    <div className="mt-2">
                      <span
                        className={`inline-block px-3 py-1.5 rounded-lg text-xs font-semibold border ${getSeverityColor(
                          values.severity
                        )}`}
                      >
                        {values.severity}
                      </span>
                    </div>
                  </div>

                  {/* Project */}
                  <div>
                    <label
                      htmlFor="projectId"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Project
                    </label>
                    <div className="relative">
                      <Field
                        as="select"
                        id="projectId"
                        name="projectId"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none bg-white cursor-pointer"
                      >
                        <option value="">No Project</option>
                        {projects.map((project) => (
                          <option key={project._id} value={project._id}>
                            {project.icon} {project.name} ({project.key})
                          </option>
                        ))}
                      </Field>
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                        <svg
                          className="w-4 h-4 text-gray-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>
                    </div>
                    {values.projectId && (
                      <div className="mt-2">
                        <span className="inline-block px-3 py-1.5 rounded-lg text-xs font-semibold border bg-indigo-100 border-indigo-300 text-indigo-700">
                          {projects.find(p => p._id === values.projectId)?.icon} {projects.find(p => p._id === values.projectId)?.name}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Assignee */}
                  <div>
                    <label
                      htmlFor="assigneeId"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Assignee
                    </label>
                    <div className="relative">
                      <Field
                        as="select"
                        id="assigneeId"
                        name="assigneeId"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none bg-white cursor-pointer"
                      >
                        <option value="">Unassigned</option>
                        <option value="me">👤 Assign to me</option>
                        <option value="1">John Doe</option>
                        <option value="2">Jane Smith</option>
                        <option value="3">Mike Johnson</option>
                        <option value="4">Sarah Wilson</option>
                        <option value="5">Alex Chen</option>
                        <option value="6">Emily Davis</option>
                        <option value="7">David Brown</option>
                        <option value="8">Lisa Garcia</option>
                      </Field>
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                        <svg
                          className="w-4 h-4 text-gray-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>
                    </div>
                    <div className="mt-2">
                      <span className={`inline-block px-3 py-1.5 rounded-lg text-xs font-semibold border ${
                        values.assigneeId
                          ? "bg-green-100 border-green-300 text-green-700"
                          : "bg-gray-100 border-gray-300 text-gray-700"
                      }`}>
                        {values.assigneeId === "me" 
                          ? "👤 Assigned to me" 
                          : values.assigneeId 
                            ? `Assigned to ${{
                                "1": "John Doe",
                                "2": "Jane Smith", 
                                "3": "Mike Johnson",
                                "4": "Sarah Wilson",
                                "5": "Alex Chen",
                                "6": "Emily Davis",
                                "7": "David Brown",
                                "8": "Lisa Garcia"
                              }[values.assigneeId]}` 
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
                      <p className="font-semibold mb-1">Classification Guide:</p>
                      <ul className="space-y-1 text-xs">
                        <li>
                          <strong>Priority:</strong> How quickly the issue needs to
                          be addressed
                        </li>
                        <li>
                          <strong>Severity:</strong> The impact of the issue on the
                          system
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
          )}
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
            window.scrollTo({ top: 0, behavior: "smooth" });
          },
        }}
      />
    </PageLayout>
  );
};

export default CreateIssue;