// Common types used across the application
import type { User } from "./user";

interface ProjectRef {
  _id: string;
  name: string;
  key: string;
  icon?: string;
}

export interface Issue {
  id: number | string;
  title: string;
  description: string;
  status: IssueStatus;
  priority: IssuePriority;
  severity: IssueSeverity;
  assignee?: User | null;
  assigneeId?: number | string | null;
  reporter?: User | null;
  reporterId?: string | null;
  project?: ProjectRef | null;
  projectId?: string | null;
  company?: string;
  completedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export type IssueStatus = "Open" | "In Progress" | "Resolved" | "Closed";
export type IssuePriority = "Low" | "Medium" | "High" | "Critical";
export type IssueSeverity = "Minor" | "Major" | "Critical";
export type SortField = "createdAt" | "updatedAt" | "priority" | "status" | "title";
export type SortOrder = "asc" | "desc";