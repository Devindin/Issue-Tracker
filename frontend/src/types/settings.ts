// Settings and preferences types
export interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  issueCreated: boolean;
  issueUpdated: boolean;
  issueResolved: boolean;
  issueAssigned: boolean;
  weeklyReport: boolean;
}

export interface SecuritySettings {
  twoFactorAuth: boolean;
  sessionTimeout: number;
  loginAlerts: boolean;
}

export interface PreferenceSettings {
  language: string;
  timezone: string;
  dateFormat: string;
  itemsPerPage: number;
  defaultView: string;
}

export interface UserPermissions {
  canCreateIssues: boolean;
  canEditIssues: boolean;
  canDeleteIssues: boolean;
  canAssignIssues: boolean;
  canViewAllIssues: boolean;
  canManageUsers: boolean;
  canViewReports: boolean;
  canExportData: boolean;
}

export interface ManagedUser {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'developer' | 'qa' | 'viewer';
  permissions: UserPermissions;
  status: 'active' | 'inactive';
  createdAt: string;
  lastLogin?: string;
}

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'manager' | 'developer' | 'qa' | 'viewer';
  permissions: UserPermissions;
}