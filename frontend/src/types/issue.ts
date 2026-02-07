// Common types used across the application
export interface Issue {
  id: number;
  title: string;
  description: string;
  status: IssueStatus;
  priority: IssuePriority;
  severity: IssueSeverity;
  createdAt: string;
  updatedAt: string;
}

export type IssueStatus = "Open" | "In Progress" | "Resolved" | "Closed";
export type IssuePriority = "Low" | "Medium" | "High" | "Critical";
export type IssueSeverity = "Minor" | "Major" | "Critical";
export type SortField = "createdAt" | "updatedAt" | "priority" | "status" | "title";
export type SortOrder = "asc" | "desc";