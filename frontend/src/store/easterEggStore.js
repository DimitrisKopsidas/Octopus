// Hidden fun. `octopusAvatars` is flipped by the Konami code on /community and
// turns every UserAvatar into a tiny octopus until it's entered again (or the
// page is left).
import { create } from 'zustand'

export const useEasterEggStore = create((set) => ({
  octopusAvatars: false,
  toggleOctopusAvatars: () => set((s) => ({ octopusAvatars: !s.octopusAvatars })),
  resetOctopusAvatars: () => set({ octopusAvatars: false }),
}))
