import type { UserPermissions } from '../types/settings';

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
    case 'admin':
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
    case 'manager':
      return {
        canCreateIssues: true,
        canEditIssues: true,
        canDeleteIssues: true,
        canAssignIssues: true,
        canViewAllIssues: true,
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
        canManageUsers: false,
        canViewReports: true,
        canExportData: false,
      };
    case 'viewer':
    default:
      return basePermissions;
  }
};