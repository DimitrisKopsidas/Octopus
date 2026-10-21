// Which user's preview modal is open. Any row, card or author line calls
// openUserPreview(username); UserPreviewModal (mounted once in Layout) reads it.
import { create } from 'zustand'

export const useUserPreviewStore = create((set) => ({
  username: null,
  open: (username) => set({ username }),
  close: () => set({ username: null }),
}))

export const openUserPreview = (username) => useUserPreviewStore.getState().open(username)
