import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  company: {
    id: string;
    name: string;
    description?: string;
  };
}

interface AuthState {
  user: User | null;
  token: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: User | null; token: string | null }>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;

      // Store ONLY token in localStorage
      if (action.payload.token) {
        localStorage.setItem("token", action.payload.token);
      } else {
        localStorage.removeItem("token");
      }
    },

    logout: (state) => {
      state.user = null;
      state.token = null;

      localStorage.removeItem("token");
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
