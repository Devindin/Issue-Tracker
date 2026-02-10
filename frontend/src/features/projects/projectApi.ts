import { apiSlice } from "../../services/apiSlice";

export interface ProjectMember {
  _id: string;
  name: string;
  email: string;
}

export interface Project {
  _id: string;
  name: string;
  description?: string;
  key: string;
  status: "active" | "archived" | "completed";
  startDate: string;
  endDate?: string;
  lead?: ProjectMember;
  members: ProjectMember[];
  company: string;
  color: string;
  icon: string;
  issueCount?: number;
  openIssueCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectData {
  name: string;
  description?: string;
  key: string;
  lead?: string;
  members?: string[];
  color?: string;
  icon?: string;
  startDate?: string;
  endDate?: string;
}

export interface UpdateProjectData {
  name?: string;
  description?: string;
  key?: string;
  lead?: string;
  members?: string[];
  status?: "active" | "archived" | "completed";
  color?: string;
  icon?: string;
  startDate?: string;
  endDate?: string;
}

export const projectApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all projects
    getProjects: builder.query<Project[], { status?: string }>({
      query: ({ status } = {}) => ({
        url: '/projects',
        params: status ? { status } : undefined,
      }),
      providesTags: (result) =>
        result
          ? [...result.map(({ _id }) => ({ type: 'Project' as const, id: _id })), { type: 'Project', id: 'LIST' }]
          : [{ type: 'Project', id: 'LIST' }],
      transformResponse: (response: any) => {
        console.log('🌐 GET /projects response:', response);
        return response.projects || [];
      },
    }),

    // Get project by ID
    getProjectById: builder.query<Project, string>({
      query: (id) => `/projects/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Project', id }],
      transformResponse: (response: any) => {
        console.log('🌐 GET /projects/:id response:', response);
        return response.project;
      },
    }),

    // Create new project
    createProject: builder.mutation<Project, CreateProjectData>({
      query: (projectData) => {
        console.log('🌐 POST /projects request:', projectData);
        return {
          url: '/projects',
          method: 'POST',
          body: projectData,
        };
      },
      invalidatesTags: [{ type: 'Project', id: 'LIST' }],
      transformResponse: (response: any) => {
        console.log('✅ Project created:', response);
        return response.project;
      },
    }),

    // Update project
    updateProject: builder.mutation<Project, { id: string; data: UpdateProjectData }>({
      query: ({ id, data }) => {
        console.log('🌐 PUT /projects/:id request:', data);
        return {
          url: `/projects/${id}`,
          method: 'PUT',
          body: data,
        };
      },
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Project', id },
        { type: 'Project', id: 'LIST' },
      ],
      transformResponse: (response: any) => {
        console.log('✅ Project updated:', response);
        return response.project;
      },
    }),

    // Delete project
    deleteProject: builder.mutation<void, string>({
      query: (id) => ({
        url: `/projects/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Project', id },
        { type: 'Project', id: 'LIST' },
      ],
      transformResponse: (response: any) => {
        console.log('✅ Project deleted:', response);
        return response;
      },
    }),

    // Archive/Unarchive project
    toggleProjectArchive: builder.mutation<Project, string>({
      query: (id) => ({
        url: `/projects/${id}/archive`,
        method: 'PATCH',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Project', id },
        { type: 'Project', id: 'LIST' },
      ],
      transformResponse: (response: any) => {
        console.log('✅ Project archive toggled:', response);
        return response.project;
      },
    }),
  }),
});

export const {
  useGetProjectsQuery,
  useGetProjectByIdQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
  useToggleProjectArchiveMutation,
} = projectApi;
