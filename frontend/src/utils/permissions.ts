import type { UserPermissions } from '../types/settings';

// default permission map for roles
export const getDefaultPermissions = (role: string): UserPermissions => {
  const basePermissions: UserPermissions = {
    canCreateIssues: false,
    canEditIssues: false,
    canDeleteIssues: false,
    canAssignIssues: false,
    canViewAllIssues: false,
    canViewKanban: false,
    canManageUsers: false,
    canViewReports: false,
    canExportData: false,
  };

  switch (role) {
    case 'admin':
      return {
        canCreateIssues: true,
        canEditIssues: true,
        canDeleteIssues: true,
        canAssignIssues: true,
        canViewAllIssues: true,
        canViewKanban: true,
        canManageUsers: true,
        canViewReports: true,
        canExportData: true,
      };
    case 'manager':
      return {
        canCreateIssues: true,
        canEditIssues: true,
        canDeleteIssues: true,
        canAssignIssues: true,
        canViewAllIssues: true,
        canViewKanban: true,
        canManageUsers: false,
        canViewReports: true,
        canExportData: true,
      };
    case 'developer':
      return {
        canCreateIssues: true,
        canEditIssues: true,
        canDeleteIssues: false,
        canAssignIssues: false,
        canViewAllIssues: true,
        canViewKanban: true,
        canManageUsers: false,
        canViewReports: false,
        canExportData: false,
      };
    case 'qa':
      return {
        canCreateIssues: true,
        canEditIssues: true,
        canDeleteIssues: false,
        canAssignIssues: false,
        canViewAllIssues: true,
        canViewKanban: true,
        canManageUsers: false,
        canViewReports: true,
        canExportData: false,
      };
    case 'viewer':
    default:
      return basePermissions;
  }
};

// helpers that components consume to gate UI
interface User {
  role: string;
  permissions?: {
    [key: string]: boolean;
  };
}

export const hasPermission = (user: User | null, permission: string): boolean => {
  if (!user) return false;
  if (user.role === 'admin') return true;

  // explicit override in user.permissions takes precedence
  if (user.permissions && permission in user.permissions) {
    return !!user.permissions[permission];
  }

  // fall back to role defaults so that viewers with empty object still behave
  const defaults = getDefaultPermissions(user.role);
  // TS doesn't know that `permission` is a valid key, cast safely
  return !!(defaults as any)[permission];
};

export const hasRole = (user: User | null, role: string | string[]): boolean => {
  if (!user) return false;
  const roles = Array.isArray(role) ? role : [role];
  return roles.includes(user.role);
};

export const hasAnyPermission = (user: User | null, permissions: string[]): boolean => {
  if (!user) return false;
  if (user.role === 'admin') return true;
  return permissions.some(p => !!user.permissions?.[p]);
};