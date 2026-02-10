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

export const issueApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getIssues: builder.query<IssuesListResponse, void>({
      query: () => ({
        url: "/issues",
        method: "GET",
      }),
      providesTags: ["Issue"],
    }),
    createIssue: builder.mutation<IssueResponse, CreateIssuePayload>({
      query: (payload) => ({
        url: "/issues",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Issue"],
    }),
  }),
});

export const { useGetIssuesQuery, useCreateIssueMutation } = issueApi;