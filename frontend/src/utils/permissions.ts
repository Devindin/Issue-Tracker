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

interface User {
  role: string;
  permissions?: {
    [key: string]: boolean;
  };
}

export const hasPermission = (user: User | null, permission: string): boolean => {
  if (!user) return false;
  if (user.role === 'admin') return true;
  return user.permissions?.[permission] || false;
};

export const hasRole = (user: User | null, role: string | string[]): boolean => {
  if (!user) return false;
  const roles = Array.isArray(role) ? role : [role];
  return roles.includes(user.role);
};

export const hasAnyPermission = (user: User | null, permissions: string[]): boolean => {
  if (!user) return false;
  if (user.role === 'admin') return true;
  return permissions.some(permission => user.permissions?.[permission]);
};

export const getDefaultPermissions = (role: string): UserPermissions => {
  const basePermissions: UserPermissions = {
    canCreateIssues: false,
    canEditIssues: false,
    canDeleteIssues: false,
    canAssignIssues: false,
    canViewAllIssues: false,
    canManageUsers: false,
    canViewReports: false,
    canExportData: false,
  };

  switch (role) {
    case "admin":
      return {
        canCreateIssues: true,
        canEditIssues: true,
        canDeleteIssues: true,
        canAssignIssues: true,
        canViewAllIssues: true,
        canManageUsers: true,
        canViewReports: true,
        canExportData: true,
      };
    case "manager":
      return {
        canCreateIssues: true,
        canEditIssues: true,
        canDeleteIssues: false,
        canAssignIssues: true,
        canViewAllIssues: true,
        canManageUsers: true,
        canViewReports: true,
        canExportData: true,
      };
    case "developer":
      return {
        canCreateIssues: true,
        canEditIssues: true,
        canDeleteIssues: false,
        canAssignIssues: false,
        canViewAllIssues: true,
        canManageUsers: false,
        canViewReports: false,
        canExportData: false,
      };
    case "qa":
      return {
        canCreateIssues: true,
        canEditIssues: true,
        canDeleteIssues: false,
        canAssignIssues: true,
        canViewAllIssues: true,
        canManageUsers: false,
        canViewReports: true,
        canExportData: true,
      };
    case "viewer":
      return {
        canCreateIssues: false,
        canEditIssues: false,
        canDeleteIssues: false,
        canAssignIssues: false,
        canViewAllIssues: true,
        canManageUsers: false,
        canViewReports: false,
        canExportData: false,
      };
    default:
      return basePermissions;
  }
};