import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  FaArrowLeft,
  FaExclamationCircle,
  FaSpinner,
} from "react-icons/fa";
import PageLayout from "../Layout/PageLayout";
import PrimaryButton from "../Components/PrimaryButton";
import InputField from "../Components/InputField";

interface Issue {
  id: number;
  title: string;
  description: string;
  status: "Open" | "In Progress" | "Resolved" | "Closed";
  priority: "Low" | "Medium" | "High" | "Critical";
  severity: "Minor" | "Major" | "Critical";
  createdAt: string;
  updatedAt: string;
}

const EditIssue: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [issue, setIssue] = useState<Issue | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);

  // Mock data - replace with actual API call
  const mockIssues: Issue[] = [
    {
      id: 1,
      title: "Login page not responsive on mobile devices",
      description: "The login page layout breaks on mobile devices with screen width less than 375px. The form elements overlap and the submit button is not accessible.",
      status: "Open",
      priority: "High",
      severity: "Major",
      createdAt: "2026-02-05T10:30:00Z",
      updatedAt: "2026-02-05T10:30:00Z",
    },
    {
      id: 2,
      title: "Database connection timeout on high load",
      description: "The application experiences database connection timeouts when there are more than 100 concurrent users. This causes 503 errors and affects user experience.",
      status: "In Progress",
      priority: "Critical",
      severity: "Critical",
      createdAt: "2026-02-04T14:20:00Z",
      updatedAt: "2026-02-06T09:15:00Z",
    },
    {
      id: 3,
      title: "Add export to CSV feature",
      description: "Users want to export issue lists to CSV format for reporting purposes.",
      status: "Open",
      priority: "Medium",
      severity: "Minor",
      createdAt: "2026-02-03T16:45:00Z",
      updatedAt: "2026-02-03T16:45:00Z",
    },
    {
      id: 4,
      title: "Fix typo in dashboard title",
      description: "Spelling mistake in the dashboard header section.",
      status: "Resolved",
      priority: "Low",
      severity: "Minor",
      createdAt: "2026-02-02T11:00:00Z",
      updatedAt: "2026-02-06T10:30:00Z",
    },
    {
      id: 5,
      title: "Performance issues on large datasets",
      description: "Application slows down significantly when handling more than 1000 issues.",
      status: "In Progress",
      priority: "High",
      severity: "Major",
      createdAt: "2026-02-01T08:30:00Z",
      updatedAt: "2026-02-07T08:00:00Z",
    },
    {
      id: 6,
      title: "User authentication not working",
      description: "Some users cannot log in with correct credentials.",
      status: "Open",
      priority: "Critical",
      severity: "Critical",
      createdAt: "2026-01-31T15:20:00Z",
      updatedAt: "2026-01-31T15:20:00Z",
    },
    {
      id: 7,
      title: "Add dark mode support",
      description: "Implement dark mode theme for better user experience.",
      status: "Open",
      priority: "Low",
      severity: "Minor",
      createdAt: "2026-01-30T12:15:00Z",
      updatedAt: "2026-01-30T12:15:00Z",
    },
  ];

  useEffect(() => {
    const fetchIssue = async () => {
      try {
        // TODO: Replace with actual API call
        // const response = await fetch(`/api/issues/${id}`);
        // const data = await response.json();

        // Mock fetch for development
        const issueData = mockIssues.find(issue => issue.id === parseInt(id || "0"));
        setIssue(issueData || null);
      } catch (error) {
        console.error("Error fetching issue:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchIssue();
    }
  }, [id]);

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
  });

  const handleSubmit = async (values: any) => {
    setSaving(true);
    try {
      // TODO: Replace with actual API call
      // const response = await fetch(`/api/issues/${id}`, {
      //   method: "PUT",
      //   headers: {
      //     "Content-Type": "application/json",
      //     Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      //   },
      //   body: JSON.stringify(values),
      // });

      // Mock update for development
      console.log("Issue updated:", { id, ...values });
      navigate(`/issues/${id}`);
    } catch (error) {
      console.error("Error updating issue:", error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
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
              className="p-2 text-gray-600 hover:text-[#1976D2] hover:bg-[#1976D2]/10 rounded-lg transition-colors"
            >
              <FaArrowLeft />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Edit Issue #{issue.id}</h1>
              <p className="text-gray-600 mt-1">Update issue details</p>
            </div>
          </div>
        </motion.div>

        {/* Edit Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-md p-8"
        >
          <Formik
            initialValues={{
              title: issue.title,
              description: issue.description,
              status: issue.status,
              priority: issue.priority,
              severity: issue.severity,
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-6">
                {/* Title */}
                <div>
                  <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">
                    Title *
                  </label>
                  <Field
                    as={InputField}
                    id="title"
                    name="title"
                    type="text"
                    placeholder="Enter issue title"
                    className="w-full"
                  />
                  <ErrorMessage name="title" component="div" className="text-red-600 text-sm mt-1" />
                </div>

                {/* Description */}
                <div>
                  <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
                    Description *
                  </label>
                  <Field
                    as="textarea"
                    id="description"
                    name="description"
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1976D2] focus:border-transparent resize-vertical"
                    placeholder="Describe the issue in detail"
                  />
                  <ErrorMessage name="description" component="div" className="text-red-600 text-sm mt-1" />
                </div>

                {/* Status, Priority, Severity */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Status */}
                  <div>
                    <label htmlFor="status" className="block text-sm font-semibold text-gray-700 mb-2">
                      Status *
                    </label>
                    <Field
                      as="select"
                      id="status"
                      name="status"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1976D2] focus:border-transparent appearance-none bg-white cursor-pointer"
                    >
                      <option value="Open">Open</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                      <option value="Closed">Closed</option>
                    </Field>
                    <ErrorMessage name="status" component="div" className="text-red-600 text-sm mt-1" />
                  </div>

                  {/* Priority */}
                  <div>
                    <label htmlFor="priority" className="block text-sm font-semibold text-gray-700 mb-2">
                      Priority *
                    </label>
                    <Field
                      as="select"
                      id="priority"
                      name="priority"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1976D2] focus:border-transparent appearance-none bg-white cursor-pointer"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                      <option value="Critical">Critical</option>
                    </Field>
                    <ErrorMessage name="priority" component="div" className="text-red-600 text-sm mt-1" />
                  </div>

                  {/* Severity */}
                  <div>
                    <label htmlFor="severity" className="block text-sm font-semibold text-gray-700 mb-2">
                      Severity *
                    </label>
                    <Field
                      as="select"
                      id="severity"
                      name="severity"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1976D2] focus:border-transparent appearance-none bg-white cursor-pointer"
                    >
                      <option value="Minor">Minor</option>
                      <option value="Major">Major</option>
                      <option value="Critical">Critical</option>
                    </Field>
                    <ErrorMessage name="severity" component="div" className="text-red-600 text-sm mt-1" />
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex gap-4 pt-6 border-t border-gray-200">
                  <Link
                    to={`/issues/${issue.id}`}
                    className="flex-1 px-6 py-3 text-center text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-semibold transition-colors"
                  >
                    Cancel
                  </Link>
                  <PrimaryButton
                    label={saving ? "Saving..." : "Save Changes"}
                    type="submit"
                    disabled={isSubmitting || saving}
                  />
                </div>
              </Form>
            )}
          </Formik>
        </motion.div>
      </div>
    </PageLayout>
  );
};

export default EditIssue;