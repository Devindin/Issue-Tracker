import type { Project } from "../features/projects/projectApi";

export const filterProjects = (
  projects: Project[],
  searchTerm: string
): Project[] => {
  const term = searchTerm.toLowerCase().trim();

  if (!term) return projects;

  return projects.filter((project) =>
    project.name.toLowerCase().includes(term) ||
    project.key.toLowerCase().includes(term) ||
    project.description?.toLowerCase().includes(term)
  );
};
