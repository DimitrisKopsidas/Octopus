import { create } from 'zustand'

export const useAchievementCelebrationStore = create((set) => ({
  open: false,
  achievements: [],
  trigger: (achievements) => set({ open: true, achievements }),
  close: () => set({ open: false, achievements: [] }),
}))

export const triggerAchievementCelebration = (achievements) =>
  useAchievementCelebrationStore.getState().trigger(achievements)
