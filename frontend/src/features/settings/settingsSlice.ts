import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  bio: string;
  avatar: string;
}

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

interface SettingsState {
  profile: UserProfile;
  notifications: NotificationSettings;
  security: SecuritySettings;
  preferences: PreferenceSettings;
  activeTab: string;
  showSuccessMessage: boolean;
}

const initialState: SettingsState = {
  profile: {
    name: '',
    email: '',
    phone: '',
    location: '',
    website: '',
    bio: '',
    avatar: '',
  },
  notifications: {
    emailNotifications: true,
    pushNotifications: false,
    issueCreated: true,
    issueUpdated: true,
    issueResolved: true,
    issueAssigned: true,
    weeklyReport: false,
  },
  security: {
    twoFactorAuth: false,
    sessionTimeout: 30,
    loginAlerts: true,
  },
  preferences: {
    language: 'en',
    timezone: 'UTC',
    dateFormat: 'MM/DD/YYYY',
    itemsPerPage: 10,
    defaultView: 'list',
  },
  activeTab: 'profile',
  showSuccessMessage: false,
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setProfile: (state, action: PayloadAction<Partial<UserProfile>>) => {
      state.profile = { ...state.profile, ...action.payload };
    },
    setNotifications: (state, action: PayloadAction<Partial<NotificationSettings>>) => {
      state.notifications = { ...state.notifications, ...action.payload };
    },
    setSecurity: (state, action: PayloadAction<Partial<SecuritySettings>>) => {
      state.security = { ...state.security, ...action.payload };
    },
    setPreferences: (state, action: PayloadAction<Partial<PreferenceSettings>>) => {
      state.preferences = { ...state.preferences, ...action.payload };
    },
    setActiveTab: (state, action: PayloadAction<string>) => {
      state.activeTab = action.payload;
    },
    setShowSuccessMessage: (state, action: PayloadAction<boolean>) => {
      state.showSuccessMessage = action.payload;
    },
    loadSettingsFromStorage: (state, action: PayloadAction<Partial<SettingsState>>) => {
      const { profile, notifications, security, preferences } = action.payload;
      if (profile) state.profile = { ...state.profile, ...profile };
      if (notifications) state.notifications = { ...state.notifications, ...notifications };
      if (security) state.security = { ...state.security, ...security };
      if (preferences) state.preferences = { ...state.preferences, ...preferences };
    },
    resetSettings: () => initialState,
  },
});

export const {
  setProfile,
  setNotifications,
  setSecurity,
  setPreferences,
  setActiveTab,
  setShowSuccessMessage,
  loadSettingsFromStorage,
  resetSettings,
} = settingsSlice.actions;

export default settingsSlice.reducer;
