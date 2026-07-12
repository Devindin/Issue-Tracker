import React, { useState } from "react";
import { motion } from "framer-motion";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { hasPermission } from "../utils/permissions";
import {
  FaEdit,
  FaArchive,
  FaTrash,
  FaSpinner,
  FaExclamationTriangle,
  FaUser,
  FaCalendar,
  FaCheckCircle,
  FaClock,
} from "react-icons/fa";
import PageLayout from "../Layout/PageLayout";
import PageTitle from "../Components/PageTitle";
import ConfirmDeleteModal from "../modals/ConfirmDeleteModal";
import StatusModal from "../modals/StatusModal";
import PermissionGate from "../Components/PermissionGate";
import {
  useGetProjectByIdQuery,
  useDeleteProjectMutation,
  useToggleProjectArchiveMutation,
} from "../features/projects/projectApi";
import { useGetIssuesQuery } from "../features/issues/issueApi";

const ViewProject: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const {
    data: project,
    isLoading,
    error,
  } = useGetProjectByIdQuery(id!, {
    skip: !id,
  });

  const {
    data: issuesData,
    isLoading: issuesLoading,
  } = useGetIssuesQuery({
    project: id,
  });

  const issues = issuesData?.issues || [];

  const [deleteProject, { isLoading: isDeleting }] = useDeleteProjectMutation();
  const [toggleArchive, { isLoading: isToggling }] =
    useToggleProjectArchiveMutation();

  const { user } = useSelector((state: any) => state.auth);
  const canEdit = hasPermission(user, 'canEditProjects');
  const canDelete = hasPermission(user, 'canDeleteProjects');

  React.useEffect(() => {
    console.log("ViewProject Component - ID:", id);
    console.log("ViewProject Component - Project:", project);
    console.log("ViewProject Component - Loading:", isLoading);
    console.log("ViewProject Component - Error:", error);
  }, [id, project, isLoading, error]);

  // Guard: No ID provided
  if (!id) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <FaExclamationTriangle className="text-5xl text-red-500 mx-auto mb-4" />
            <p className="text-red-600 text-xl font-semibold mb-4">
              No project ID provided
            </p>
            <Link
              to="/projects"
              className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors inline-block"
            >
              Back to Projects
            </Link>
          </div>
        </div>
      </PageLayout>
    );
  }

  const handleDelete = async () => {
    try {
      await deleteProject(id!).unwrap();
      navigate("/projects");
    } catch (error: any) {
      console.error("Error deleting project:", error);
      setErrorMessage(
        error?.data?.message ||
          "Failed to delete project. It may have associated issues.",
      );
      setShowErrorModal(true);
      setShowDeleteModal(false);
    }
  };

  const handleToggleArchive = async () => {
    try {
      await toggleArchive(id!).unwrap();
    } catch (error: any) {
      console.error("Error toggling archive status:", error);
      setErrorMessage(
        error?.data?.message || "Failed to update project status.",
      );
      setShowErrorModal(true);
    }
  };

  if (isLoading) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <FaSpinner className="text-5xl text-indigo-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600 text-lg">Loading project...</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (error || !project) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <FaExclamationTriangle className="text-5xl text-red-500 mx-auto mb-4" />
            <p className="text-red-600 text-xl font-semibold mb-4">
              Failed to load project
            </p>
            <Link
              to="/projects"
              className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors inline-block"
            >
              Back to Projects
            </Link>
          </div>
        </div>
      </PageLayout>
    );
  }

  const statusConfig = {
    active: { color: "green", label: "Active" },
    archived: { color: "gray", label: "Archived" },
    completed: { color: "blue", label: "Completed" },
  };

  const status =
    statusConfig[project.status as keyof typeof statusConfig] ||
    statusConfig.active;

  return (
    <PageLayout>
      <div className="space-y-6 max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-start justify-between"
        >
          <div className="flex items-center gap-4">
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl shadow-lg"
              style={{ backgroundColor: `${project.color}20` }}
            >
              {project.icon}
            </div>
            <div>
              <PageTitle
                title={project.name}
                subtitle={`${project.key} • ${status.label}`}
                textColor="text-white"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <PermissionGate role={["manager", "admin"]}>
              <button
                onClick={() => navigate(`/projects/${id}/edit`)}
                className="px-4 py-2 bg-white text-indigo-600 rounded-xl font-semibold hover:bg-indigo-50 transition-colors flex items-center gap-2 shadow-md"
              >
                <FaEdit /> Edit
              </button>
            </PermissionGate>
            <PermissionGate role={["manager", "admin"]}>
              <button
                onClick={handleToggleArchive}
                disabled={isToggling}
                className="px-4 py-2 bg-white text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors flex items-center gap-2 shadow-md disabled:opacity-50"
              >
                <FaArchive />{" "}
                {project.status === "archived" ? "Unarchive" : "Archive"}
              </button>
            </PermissionGate>
            <PermissionGate role="admin">
              <button
                onClick={() => setShowDeleteModal(true)}
                className="px-4 py-2 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-colors flex items-center gap-2 shadow-md"
              >
                <FaTrash /> Delete
              </button>
            </PermissionGate>
          </div>
        </motion.div>

        {/* Project Details Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white rounded-2xl shadow-md p-6"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Project Details
          </h2>

          {project.description && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-600 mb-2">
                Description
              </h3>
              <p className="text-gray-700">{project.description}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Project Lead */}
            <div>
              <h3 className="text-sm font-semibold text-gray-600 mb-2 flex items-center gap-2">
                <FaUser /> Project Lead
              </h3>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-semibold">
                  {project.lead?.name?.charAt(0).toUpperCase() || "?"}
                </div>
                <div>
                  <p className="font-medium text-gray-800">
                    {project.lead?.name || "Not assigned"}
                  </p>
                  <p className="text-sm text-gray-500">
                    {project.lead?.email || ""}
                  </p>
                </div>
              </div>
            </div>

            {/* Dates */}
            {(project.startDate || project.endDate) && (
              <div>
                <h3 className="text-sm font-semibold text-gray-600 mb-2 flex items-center gap-2">
                  <FaCalendar /> Timeline
                </h3>
                <div className="space-y-1">
                  {project.startDate && (
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Start:</span>{" "}
                      {new Date(project.startDate).toLocaleDateString()}
                    </p>
                  )}
                  {project.endDate && (
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">End:</span>{" "}
                      {new Date(project.endDate).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Team Members */}
          {project.members && project.members.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-semibold text-gray-600 mb-3">
                Team Members
              </h3>
              <div className="flex flex-wrap gap-3">
                {project.members.map((member: any) => (
                  <div
                    key={member._id}
                    className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm font-semibold">
                      {member.name?.charAt(0).toUpperCase() || "?"}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        {member.name}
                      </p>
                      <p className="text-xs text-gray-500">{member.email}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        {/* Issue Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-2xl shadow-md p-6"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Issue Statistics
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Total Issues */}
            <div className="p-4 bg-indigo-50 rounded-xl border-2 border-indigo-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-indigo-600 font-medium">
                    Total Issues
                  </p>
                  <p className="text-3xl font-bold text-indigo-700 mt-1">
                    {project.issueCount || 0}
                  </p>
                </div>
                <FaExclamationTriangle className="text-3xl text-indigo-400" />
              </div>
            </div>

            {/* Open Issues */}
            <div className="p-4 bg-green-50 rounded-xl border-2 border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600 font-medium">
                    Open Issues
                  </p>
                  <p className="text-3xl font-bold text-green-700 mt-1">
                    {project.openIssueCount || 0}
                  </p>
                </div>
                <FaClock className="text-3xl text-green-400" />
              </div>
            </div>

            {/* Closed Issues */}
            <div className="p-4 bg-gray-50 rounded-xl border-2 border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">
                    Closed Issues
                  </p>
                  <p className="text-3xl font-bold text-gray-700 mt-1">
                    {(project.issueCount || 0) - (project.openIssueCount || 0)}
                  </p>
                </div>
                <FaCheckCircle className="text-3xl text-gray-400" />
              </div>
            </div>
          </div>

          {/* View Issues Button */}
          <div className="mt-6">
            <Link
              to={`/issues?project=${project.key}`}
              className="w-full px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
            >
              <FaExclamationTriangle /> View All Issues in {project.key}
            </Link>
          </div>
        </motion.div>

        {/* Recent Issues */}
        {issues.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="bg-white rounded-2xl shadow-md p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Recent Issues
              </h2>
              <Link
                to={`/issues?project=${project.key}`}
                className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
              >
                View All →
              </Link>
            </div>

            <div className="space-y-3">
              {issues.slice(0, 5).map((issue: Issue) => (
                <Link
                  key={issue.id}
                  to={`/issues/${issue.id}`}
                  className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-gray-400 font-mono text-sm">
                          #{issue.id}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${
                            issue.status === "Open"
                              ? "bg-orange-50 text-orange-700"
                              : issue.status === "In Progress"
                              ? "bg-blue-50 text-blue-700"
                              : issue.status === "Resolved"
                              ? "bg-green-50 text-green-700"
                              : "bg-gray-50 text-gray-700"
                          }`}
                        >
                          {issue.status}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${
                            issue.priority === "High" || issue.priority === "Critical"
                              ? "bg-red-50 text-red-700"
                              : issue.priority === "Medium"
                              ? "bg-yellow-50 text-yellow-700"
                              : "bg-green-50 text-green-700"
                          }`}
                        >
                          {issue.priority}
                        </span>
                      </div>
                      <h3 className="font-medium text-gray-800 truncate">
                        {issue.title}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {issue.description}
                      </p>
                    </div>
                    <div className="text-right text-xs text-gray-500 ml-4">
                      {new Date(issue.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}

        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Link
            to="/projects"
            className="inline-block px-6 py-3 border-2 border-white text-white rounded-xl font-semibold hover:bg-white hover:text-indigo-600 transition-colors"
          >
            ← Back to Projects
          </Link>
        </motion.div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        entityName="Project"
        itemName={project.name}
        confirmText="Delete Project"
        isLoading={isDeleting}
      />

      {/* Error Modal */}
      <StatusModal
        isOpen={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        type="error"
        title="Error"
        message={errorMessage}
        primaryAction={{
          label: "Close",
          onClick: () => setShowErrorModal(false),
        }}
      />
    </PageLayout>
  );
};

export default ViewProject;
