// Zustand demo auth store (in-memory user). Used by Layout, Login, Register.
import { create } from 'zustand'

// In-memory only — interface scaffold until real backend auth lands.
export const useAuthStore = create((set) => ({
  user: null,

  register: ({ username, displayName, role }) =>
    set({ user: { username, displayName, role } }),

  login: ({ username }) =>
    set({ user: { username, displayName: username, role: 'student' } }),

  logout: () => set({ user: null }),
}))
