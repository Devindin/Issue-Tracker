import { apiSlice } from "../services/apiSlice";

interface CreateIssuePayload {
  title: string;
  description: string;
  status: string;
  priority: string;
  severity: string;
  assigneeId?: string;
}

interface IssueResponse {
  issue: {
    id: string;
    title: string;
    description: string;
    status: string;
    priority: string;
    severity: string;
    assigneeId?: string;
    createdAt: string;
    updatedAt: string;
  };
}

export const issueApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
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

export const { useCreateIssueMutation } = issueApi;