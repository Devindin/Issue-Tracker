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