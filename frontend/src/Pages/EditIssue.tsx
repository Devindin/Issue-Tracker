import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import {
  FaArrowLeft,
  FaExclamationCircle,
  FaSpinner,
  FaSave,
  FaTimes,
  FaExclamationTriangle,
  FaInfoCircle,
} from "react-icons/fa";
import PageLayout from "../Layout/PageLayout";
import PageTitle from "../Components/PageTitle";
import StatusModal from "../models/StatusModal";
import { useGetIssueByIdQuery, useUpdateIssueMutation } from "../features/issues/issueApi";
import { useGetProjectsQuery } from "../features/projects/projectApi";
import { useGetUsersQuery } from "../features/users/userApi";
import InputField from "../Components/InputField";

const EditIssue: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [submitError, setSubmitError] = useState<string>("");
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  
  const { data, isLoading, isError, error } = useGetIssueByIdQuery(id || "", {
    skip: !id, // Skip the query if id is undefined or empty
  });
  const [updateIssue, { isLoading: isUpdating }] = useUpdateIssueMutation();
  
  // Fetch projects for dropdown
  const { data: projectsData } = useGetProjectsQuery({ status: "active" });
  const projects = projectsData || [];
  
  // Fetch users for assignee dropdown
  const { data: users = [] } = useGetUsersQuery();

  // Character count limits
  const TITLE_MAX_LENGTH = 100;
  const DESCRIPTION_MAX_LENGTH = 1000;

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

  // Get issue from API response
  const issue = data?.issue || null;

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
    assigneeId: Yup.string().optional(),
    projectId: Yup.string().required("Project is required"),
  });

  const handleSubmit = async (values: any) => {
    setSubmitError("");
    try {
      const payload: any = {
        id: id || "",
        title: values.title,
        description: values.description,
        status: values.status,
        priority: values.priority,
        severity: values.severity,
        projectId: values.projectId,
      };
      
      // Only include assigneeId if it's a valid MongoDB ObjectId format (24 hex chars)
      if (values.assigneeId && /^[0-9a-fA-F]{24}$/.test(values.assigneeId)) {
        payload.assigneeId = values.assigneeId;
      } else if (values.assigneeId === "") {
        payload.assigneeId = null;
      }
      
      await updateIssue(payload).unwrap();

      setShowSuccessModal(true);
    } catch (error: unknown) {
      console.error("Error updating issue:", error);
      const err = error as { data?: { message?: string; error?: string }; message?: string; error?: string };
      const message =
        err?.data?.message ||
        err?.data?.error ||
        err?.message ||
        err?.error ||
        "Failed to update issue. Please try again.";
      setSubmitError(message);
    }
  };

  if (isLoading) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <FaSpinner className="animate-spin text-4xl text-[#1976D2] mx-auto mb-4" />
            <p className="text-gray-600">Loading issue...</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (isError) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <FaExclamationCircle className="text-6xl text-red-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Issue</h2>
            <p className="text-gray-600 mb-6">
              {(error as any)?.data?.message || "Failed to load issue. Please try again."}
            </p>
            <Link
              to="/issues"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#1976D2] text-white rounded-xl font-semibold hover:bg-[#1565C0] transition-colors"
            >
              <FaArrowLeft /> Back to Issues
            </Link>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (!issue) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <FaExclamationCircle className="text-6xl text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Issue Not Found</h2>
            <p className="text-gray-600 mb-6">The issue you're looking for doesn't exist.</p>
            <Link
              to="/issues"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#1976D2] text-white rounded-xl font-semibold hover:bg-[#1565C0] transition-colors"
            >
              <FaArrowLeft /> Back to Issues
            </Link>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <Link
              to={`/issues/${issue.id}`}
              className="p-2 text-white hover:text-[#1976D2] hover:bg-[#1976D2]/10 rounded-lg transition-colors"
            >
              <FaArrowLeft />
            </Link>
            <PageTitle
              title={`Edit Issue #${issue.id}`}
              subtitle="Update issue details"
              textColor="text-white"
            />
          </div>
        </motion.div>

        {/* Edit Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-6"
        >
          <Formik
            initialValues={{
              title: issue.title,
              description: issue.description,
              status: issue.status,
              priority: issue.priority,
              severity: issue.severity,
              assigneeId: issue.assigneeId || "",
              projectId: issue.project?._id || "",
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, values, errors, touched, handleChange }) => {
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

              const projectOptions = projects.map((project) => ({
                value: project._id,
                label: `${project.icon} ${project.name} (${project.key})`,
              }));

              const assigneeOptions = [
                ...users.map((user) => ({
                  value: user.id,
                  label: `${user.name} (${user.email})`,
                })),
              ];

              return (
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
                    Main Information
                  </h2>

                  <div className="space-y-4">
                    <InputField
                      label="Title"
                      name="title"
                      type="text"
                      placeholder="Enter a clear, concise title for the issue"
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
                            values.status
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
                            values.priority
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
                            values.severity
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
                        required
                        handleChange={handleChange}
                        values={values}
                        errors={errors as Record<string, string>}
                        touched={touched as Record<string, boolean>}
                      />
                    </div>
                  </div>

                  {/* Assignee */}
                  <div className="mt-6 pt-6 border-t border-gray-200">
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
                      <span className={`inline-block px-3 py-1.5 rounded-lg text-xs font-semibold border ${
                        values.assigneeId
                          ? "bg-green-100 border-green-300 text-green-700"
                          : "bg-gray-100 border-gray-300 text-gray-700"
                      }`}
                      >
                        {values.assigneeId
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
                          <strong>Assignee:</strong> Person responsible for the issue
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <motion.button
                    type="submit"
                    disabled={isSubmitting || isUpdating}
                    whileHover={{ scale: (isSubmitting || isUpdating) ? 1 : 1.02 }}
                    whileTap={{ scale: (isSubmitting || isUpdating) ? 1 : 0.98 }}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-indigo-600 text-white rounded-xl font-semibold shadow-lg shadow-indigo-200 hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed transition-all"
                  >
                    {isUpdating || isSubmitting ? (
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
                        Saving Changes...
                      </>
                    ) : (
                      <>
                        <FaSave /> Save Changes
                      </>
                    )}
                  </motion.button>

                  <Link to={`/issues/${issue.id}`} className="flex-1">
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
        </motion.div>
      </div>

      {/* Success Modal */}
      <StatusModal
        isOpen={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false);
          navigate("/issues");
        }}
        type="success"
        title="Issue Updated Successfully!"
        message={`Issue <span class="font-semibold text-indigo-600">#${id}</span> has been updated successfully.`}
        primaryAction={{
          label: "View Issue",
          to: `/issues/${id}`,
        }}
        secondaryAction={{
          label: "Back to Issues",
          to: "/issues",
        }}
      />
    </PageLayout>
  );
};

export default EditIssue;