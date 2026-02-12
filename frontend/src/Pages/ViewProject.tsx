import React, { useState } from "react";
import { motion } from "framer-motion";
import { useParams, useNavigate, Link } from "react-router-dom";
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
import DeleteModal from "../models/DeleteModal";
import StatusModal from "../models/StatusModal";
import {
  useGetProjectByIdQuery,
  useDeleteProjectMutation,
  useToggleProjectArchiveMutation,
} from "../features/projects/projectApi";

const ViewProject: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { data: project, isLoading, error } = useGetProjectByIdQuery(id!, {
    skip: !id,
  });
  const [deleteProject, { isLoading: isDeleting }] = useDeleteProjectMutation();
  const [toggleArchive, { isLoading: isToggling }] = useToggleProjectArchiveMutation();

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
            <p className="text-red-600 text-xl font-semibold mb-4">No project ID provided</p>
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
      setErrorMessage(error?.data?.message || "Failed to delete project. It may have associated issues.");
      setShowErrorModal(true);
      setShowDeleteModal(false);
    }
  };

  const handleToggleArchive = async () => {
    try {
      await toggleArchive(id!).unwrap();
    } catch (error: any) {
      console.error("Error toggling archive status:", error);
      setErrorMessage(error?.data?.message || "Failed to update project status.");
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
            <p className="text-red-600 text-xl font-semibold mb-4">Failed to load project</p>
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

  const status = statusConfig[project.status as keyof typeof statusConfig] || statusConfig.active;

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
            <button
              onClick={() => navigate(`/projects/${id}/edit`)}
              className="px-4 py-2 bg-white text-indigo-600 rounded-xl font-semibold hover:bg-indigo-50 transition-colors flex items-center gap-2 shadow-md"
            >
              <FaEdit /> Edit
            </button>
            <button
              onClick={handleToggleArchive}
              disabled={isToggling}
              className="px-4 py-2 bg-white text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors flex items-center gap-2 shadow-md disabled:opacity-50"
            >
              <FaArchive /> {project.status === "archived" ? "Unarchive" : "Archive"}
            </button>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="px-4 py-2 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-colors flex items-center gap-2 shadow-md"
            >
              <FaTrash /> Delete
            </button>
          </div>
        </motion.div>

        {/* Project Details Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white rounded-2xl shadow-md p-6"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Project Details</h2>

          {project.description && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-600 mb-2">Description</h3>
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
                  <p className="font-medium text-gray-800">{project.lead?.name || "Not assigned"}</p>
                  <p className="text-sm text-gray-500">{project.lead?.email || ""}</p>
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
              <h3 className="text-sm font-semibold text-gray-600 mb-3">Team Members</h3>
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
                      <p className="text-sm font-medium text-gray-800">{member.name}</p>
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
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Issue Statistics</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Total Issues */}
            <div className="p-4 bg-indigo-50 rounded-xl border-2 border-indigo-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-indigo-600 font-medium">Total Issues</p>
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
                  <p className="text-sm text-green-600 font-medium">Open Issues</p>
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
                  <p className="text-sm text-gray-600 font-medium">Closed Issues</p>
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

      {/* Delete Modal */}
      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Delete Project"
        message={`Are you sure you want to delete the project "${project.name}"? This action cannot be undone.${
          project.issueCount > 0
            ? " This project has issues associated with it and cannot be deleted."
            : ""
        }`}
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
