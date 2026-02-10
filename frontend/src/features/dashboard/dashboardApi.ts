import { apiSlice } from "../../services/apiSlice";
import type { IssueStats } from "../../types";

interface DashboardStatsResponse {
  stats: IssueStats;
}

interface Issue {
  id: string | number;
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
  reporter?: {
    id: string;
    name: string;
    email: string;
  } | null;
  createdAt: string;
  updatedAt: string;
}

interface RecentIssuesResponse {
  issues: Issue[];
  total: number;
}

export const dashboardApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardStats: builder.query<DashboardStatsResponse, void>({
      query: () => {
        console.log('[Dashboard API] GET Stats - Request:', {
          url: '/issues',
          timestamp: new Date().toISOString()
        });
        return {
          url: '/issues',
          method: 'GET',
        };
      },
      transformResponse: (response: { issues: Issue[] }) => {
        const issues = response.issues || [];
        const stats: IssueStats = {
          open: issues.filter((i) => i.status === "Open").length,
          inProgress: issues.filter((i) => i.status === "In Progress").length,
          resolved: issues.filter((i) => i.status === "Resolved").length,
          closed: issues.filter((i) => i.status === "Closed").length,
          total: issues.length,
        };
        
        console.log('[Dashboard API] GET Stats - Success:', {
          stats,
          timestamp: new Date().toISOString()
        });
        
        return { stats };
      },
      transformErrorResponse: (error: any) => {
        console.error('[Dashboard API] GET Stats - Error:', {
          status: error.status,
          data: error.data,
          timestamp: new Date().toISOString()
        });
        return error;
      },
      providesTags: ["Issue"],
    }),
    getRecentIssues: builder.query<RecentIssuesResponse, { limit?: number }>({
      query: ({ limit = 10 }) => {
        console.log('[Dashboard API] GET Recent Issues - Request:', {
          url: '/issues',
          limit,
          timestamp: new Date().toISOString()
        });
        return {
          url: '/issues',
          method: 'GET',
        };
      },
      transformResponse: (response: { issues: Issue[] }, _meta, arg) => {
        const issues = response.issues || [];
        const recentIssues = issues.slice(0, arg.limit);
        
        console.log('[Dashboard API] GET Recent Issues - Success:', {
          total: issues.length,
          returned: recentIssues.length,
          timestamp: new Date().toISOString()
        });
        
        return {
          issues: recentIssues,
          total: issues.length,
        };
      },
      transformErrorResponse: (error: any) => {
        console.error('[Dashboard API] GET Recent Issues - Error:', {
          status: error.status,
          data: error.data,
          timestamp: new Date().toISOString()
        });
        return error;
      },
      providesTags: ["Issue"],
    }),
  }),
});

export const { 
  useGetDashboardStatsQuery,
  useGetRecentIssuesQuery 
} = dashboardApi;
