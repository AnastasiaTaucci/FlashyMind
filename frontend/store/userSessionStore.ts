import { create } from 'zustand';

interface UserSessionState {
  accessToken: string | null;
  setAccessToken: (token: string) => void;
}

export const useUserSessionStore = create<UserSessionState>((set) => ({
  accessToken: null,
  setAccessToken: (token) => set({ accessToken: token }),
}));