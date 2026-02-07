// Form data types
export interface IssueFormData {
  title: string;
  description: string;
  priority: IssuePriority;
  severity: IssueSeverity;
  status: IssueStatus;
}

export interface LoginFormData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// Import types that are referenced
import type { IssuePriority, IssueSeverity, IssueStatus } from './issue';