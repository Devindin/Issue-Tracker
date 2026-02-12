import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaArchive,
  FaSearch,
  FaSpinner,
  FaExclamationCircle,
  FaFolderOpen,
  FaFilter,
} from "react-icons/fa";
import PageLayout from "../Layout/PageLayout";
import PageTitle from "../Components/PageTitle";
import {
  useGetProjectsQuery,
  useDeleteProjectMutation,
  useToggleProjectArchiveMutation,
  type Project,
} from "../features/projects/projectApi";
import Pagination from "../Components/Pagination";
import ConfirmDeleteModal from "../models/ConfirmDeleteModal";
import { useMemo } from "react";
import { filterProjects } from "../utils/projectFilters";
import { getProjectStatusColor } from "../utils/projectStatus";
import { paginate } from "../utils/pagination";
import CommonButton from "../Components/CommonButton";

const ProjectsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("active");
  const [deletingProject, setDeletingProject] = useState<Project | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Fetch projects
  const {
    data: projects = [],
    isLoading,
    isError,
    refetch,
  } = useGetProjectsQuery({
    status: statusFilter === "all" ? undefined : statusFilter,
  });
  const [deleteProject, { isLoading: isDeleting }] = useDeleteProjectMutation();
  const [toggleArchive, { isLoading: isToggling }] =
    useToggleProjectArchiveMutation();

  // Filter projects based on search
  const filteredProjects = useMemo(() => {
    return filterProjects(projects, searchTerm);
  }, [projects, searchTerm]);

  const handleDeleteProject = async () => {
    if (!deletingProject) return;

    try {
      await deleteProject(deletingProject._id).unwrap();

      // Adjust page if last item deleted
      if ((currentPage - 1) * itemsPerPage >= filteredProjects.length - 1) {
        setCurrentPage((prev) => Math.max(prev - 1, 1));
      }

      setDeletingProject(null);
    } catch (error: any) {
      console.error("Failed to delete project:", error);
      alert(error.data?.message || "Failed to delete project");
      setDeletingProject(null);
    }
  };

  const handleToggleArchive = async (projectId: string) => {
    try {
      await toggleArchive(projectId).unwrap();
    } catch (error: any) {
      console.error("Failed to toggle archive:", error);
      alert(error.data?.message || "Failed to update project");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "archived":
        return "bg-gray-100 text-gray-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  const { totalPages, paginatedItems: paginatedProjects } = useMemo(() => {
    return paginate(filteredProjects, currentPage, itemsPerPage);
  }, [filteredProjects, currentPage]);

  return (
    <PageLayout>
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        >
          <PageTitle
            title="Projects"
            subtitle="Organize and manage your projects"
            textColor="text-white"
          />
          <Link to="/projects/new">
            <CommonButton icon={<FaPlus />}>Create Project</CommonButton>
          </Link>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white rounded-2xl shadow-md p-4 space-y-4"
        >
          {/* Search Bar */}
          <div className="relative">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search projects by name, key, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-3">
            <FaFilter className="text-gray-500" />
            <div className="flex gap-2 flex-wrap">
              {["all", "active", "archived", "completed"].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    statusFilter === status
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Projects Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {isLoading ? (
            <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl shadow-md">
              <FaSpinner className="text-5xl text-indigo-500 animate-spin mb-4" />
              <p className="text-gray-600">Loading projects...</p>
            </div>
          ) : isError ? (
            <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl shadow-md text-red-500">
              <FaExclamationCircle className="text-6xl mb-4" />
              <p className="text-lg font-medium">Failed to load projects</p>
              <button
                onClick={() => refetch()}
                className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Try Again
              </button>
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl shadow-md text-gray-500">
              <FaFolderOpen className="text-6xl mb-4 text-gray-300" />
              <p className="text-lg font-medium">No projects found</p>
              {searchTerm && (
                <p className="text-sm mt-1">Try adjusting your search</p>
              )}
              {!searchTerm && statusFilter === "active" && (
                <Link to="/projects/new" className="mt-4">
                  <button className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                    Create Your First Project
                  </button>
                </Link>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedProjects.map((project, index) => (
                <motion.div
                  key={project._id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow p-6 relative"
                  style={{ borderTop: `4px solid ${project.color}` }}
                >
                  {/* Project Icon and Name */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                        style={{ backgroundColor: `${project.color}20` }}
                      >
                        {project.icon}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-800 text-lg">
                          {project.name}
                        </h3>
                        <p className="text-sm text-gray-500 font-mono">
                          {project.key}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  {project.description && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {project.description}
                    </p>
                  )}

                  {/* Status Badge */}
                  <div className="mb-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getProjectStatusColor(project.status)}`}
                    >
                      {project.status}
                    </span>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                    <div>
                      <span className="font-semibold">
                        {project.issueCount || 0}
                      </span>{" "}
                      total issues
                    </div>
                    <div>
                      <span className="font-semibold text-green-600">
                        {project.openIssueCount || 0}
                      </span>{" "}
                      open
                    </div>
                  </div>

                  {/* Lead */}
                  {project.lead && (
                    <div className="text-sm text-gray-600 mb-4">
                      Lead:{" "}
                      <span className="font-medium">{project.lead.name}</span>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
                    <Link
                      to={`/projects/${project._id}`}
                      className="flex-1 text-center px-3 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors font-medium text-sm"
                    >
                      View Details
                    </Link>
                    <button
                      onClick={() => handleToggleArchive(project._id)}
                      disabled={isToggling}
                      className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                      title={
                        project.status === "archived" ? "Restore" : "Archive"
                      }
                    >
                      <FaArchive />
                    </button>
                    <Link
                      to={`/projects/${project._id}/edit`}
                      className="p-2 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <FaEdit />
                    </Link>
                    <button
                      onClick={() => setDeletingProject(project)}
                      disabled={isDeleting}
                      className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                      title="Delete"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Summary */}
        {!isLoading && !isError && filteredProjects.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-center text-gray-600"
          ></motion.div>
        )}

        {/* Pagination */}
        {filteredProjects.length > itemsPerPage && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={filteredProjects.length}
            itemsPerPage={itemsPerPage}
            variant="rounded"
            size="md"
          />
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={!!deletingProject}
        onClose={() => setDeletingProject(null)}
        onConfirm={handleDeleteProject}
        entityName="Project"
        itemName={
          deletingProject
            ? `${deletingProject.name} (${deletingProject.key})`
            : undefined
        }
        isLoading={isDeleting}
      />
    </PageLayout>
  );
};

export default ProjectsPage;
