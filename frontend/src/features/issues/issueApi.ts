import { apiSlice } from "../../services/apiSlice";

interface CreateIssuePayload {
  title: string;
  description: string;
  status: string;
  priority: string;
  severity: string;
  assigneeId?: string;
}

interface Issue {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  severity: string;
  assignee?: {
    id: string;
    name: string;
    email: string;
  } | null;
  assigneeId?: string | null;
  reporter?: {
    id: string;
    name: string;
    email: string;
  } | null;
  reporterId?: string | null;
  company: string;
  completedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

interface IssueResponse {
  issue: Issue;
}

interface IssuesListResponse {
  message: string;
  issues: Issue[];
}

interface SearchIssuesParams {
  search?: string;
  status?: string;
  priority?: string;
  severity?: string;
}

interface UpdateIssuePayload {
  id: string;
  title?: string;
  description?: string;
  status?: string;
  priority?: string;
  severity?: string;
  assigneeId?: string | null;
}

export const issueApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getIssues: builder.query<IssuesListResponse, SearchIssuesParams | void>({
      query: (params) => {
        const searchParams = new URLSearchParams();
        if (params?.search) searchParams.append('search', params.search);
        if (params?.status) searchParams.append('status', params.status);
        if (params?.priority) searchParams.append('priority', params.priority);
        if (params?.severity) searchParams.append('severity', params.severity);
        
        const queryString = searchParams.toString();
        console.log('[API] GET Issues - Request:', {
          params,
          url: `/issues${queryString ? `?${queryString}` : ''}`,
          timestamp: new Date().toISOString()
        });
        return {
          url: `/issues${queryString ? `?${queryString}` : ''}`,
          method: "GET",
        };
      },
      transformResponse: (response: IssuesListResponse) => {
        console.log('[API] GET Issues - Success:', {
          issueCount: response.issues?.length || 0,
          message: response.message,
          timestamp: new Date().toISOString()
        });
        return response;
      },
      transformErrorResponse: (error: any) => {
        console.error('[API] GET Issues - Error:', {
          status: error.status,
          data: error.data,
          timestamp: new Date().toISOString()
        });
        return error;
      },
      providesTags: ["Issue"],
    }),
    getIssueById: builder.query<IssueResponse, string>({
      query: (id) => {
        console.log('[API] GET Issue By ID - Request:', {
          id,
          url: `/issues/${id}`,
          timestamp: new Date().toISOString()
        });
        return {
          url: `/issues/${id}`,
          method: "GET",
        };
      },
      transformResponse: (response: IssueResponse) => {
        console.log('[API] GET Issue By ID - Success:', {
          issueId: response.issue?.id,
          title: response.issue?.title,
          timestamp: new Date().toISOString()
        });
        return response;
      },
      transformErrorResponse: (error: any) => {
        console.error('[API] GET Issue By ID - Error:', {
          status: error.status,
          data: error.data,
          timestamp: new Date().toISOString()
        });
        return error;
      },
      providesTags: (result, error, id) => [{ type: "Issue", id }],
    }),
    createIssue: builder.mutation<IssueResponse, CreateIssuePayload>({
      query: (payload) => {
        console.log('[API] CREATE Issue - Request:', {
          payload,
          url: '/issues',
          timestamp: new Date().toISOString()
        });
        return {
          url: "/issues",
          method: "POST",
          body: payload,
        };
      },
      transformResponse: (response: IssueResponse) => {
        console.log('[API] CREATE Issue - Success:', {
          issueId: response.issue?.id,
          title: response.issue?.title,
          status: response.issue?.status,
          priority: response.issue?.priority,
          timestamp: new Date().toISOString()
        });
        return response;
      },
      transformErrorResponse: (error: any) => {
        console.error('[API] CREATE Issue - Error:', {
          status: error.status,
          data: error.data,
          timestamp: new Date().toISOString()
        });
        return error;
      },
      invalidatesTags: ["Issue"],
    }),
    updateIssue: builder.mutation<IssueResponse, UpdateIssuePayload>({
      query: ({ id, ...payload }) => {
        console.log('[API] UPDATE Issue - Request:', {
          id,
          payload,
          url: `/issues/${id}`,
          timestamp: new Date().toISOString()
        });
        return {
          url: `/issues/${id}`,
          method: "PUT",
          body: payload,
        };
      },
      transformResponse: (response: IssueResponse) => {
        console.log('[API] UPDATE Issue - Success:', {
          issueId: response.issue?.id,
          title: response.issue?.title,
          status: response.issue?.status,
          priority: response.issue?.priority,
          timestamp: new Date().toISOString()
        });
        return response;
      },
      transformErrorResponse: (error: any) => {
        console.error('[API] UPDATE Issue - Error:', {
          status: error.status,
          data: error.data,
          timestamp: new Date().toISOString()
        });
        return error;
      },
      invalidatesTags: (result, error, { id }) => [{ type: "Issue", id }, "Issue"],
    }),
  }),
});

export const { 
  useGetIssuesQuery, 
  useGetIssueByIdQuery, 
  useCreateIssueMutation,
  useUpdateIssueMutation 
} = issueApi;