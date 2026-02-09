// Common types used across the application
import type { User } from "./user";

export interface Issue {
  id: number;
  title: string;
  description: string;
  status: IssueStatus;
  priority: IssuePriority;
  severity: IssueSeverity;
  assignee?: User;
  assigneeId?: number;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export type IssueStatus = "Open" | "In Progress" | "Resolved" | "Closed";
export type IssuePriority = "Low" | "Medium" | "High" | "Critical";
export type IssueSeverity = "Minor" | "Major" | "Critical";
export type SortField = "createdAt" | "updatedAt" | "priority" | "status" | "title";
export type SortOrder = "asc" | "desc";