import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface ReportStats {
  totalIssues: number;
  openIssues: number;
  inProgressIssues: number;
  resolvedIssues: number;
  closedIssues: number;
  highPriorityIssues: number;
  averageResolutionTime: number;
}

export interface TrendDataPoint {
  date: string;
  open: number;
  resolved: number;
  total: number;
}

export interface TrendData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor?: string;
    backgroundColor?: string;
    fill?: boolean;
  }[];
}

export interface ReportIssue {
  id: string;
  title: string;
  status: string;
  priority: string;
  severity: string;
  assignee: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
}

interface ReportsState {
  loading: boolean;
  issues: ReportIssue[];
  stats: ReportStats | null;
  trendData: TrendData | null;
  dateRange: string; // in days
  error: string | null;
}

const initialState: ReportsState = {
  loading: true,
  issues: [],
  stats: null,
  trendData: null,
  dateRange: '7',
  error: null,
};

const reportsSlice = createSlice({
  name: 'reports',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setIssues: (state, action: PayloadAction<ReportIssue[]>) => {
      state.issues = action.payload;
    },
    setStats: (state, action: PayloadAction<ReportStats | null>) => {
      state.stats = action.payload;
    },
    setTrendData: (state, action: PayloadAction<TrendData | null>) => {
      state.trendData = action.payload;
    },
    setDateRange: (state, action: PayloadAction<string>) => {
      state.dateRange = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    resetReports: () => initialState,
  },
});

export const {
  setLoading,
  setIssues,
  setStats,
  setTrendData,
  setDateRange,
  setError,
  resetReports,
} = reportsSlice.actions;

export default reportsSlice.reducer;
