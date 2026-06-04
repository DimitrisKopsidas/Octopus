// Zustand toast store + toast.* helper API. Used app-wide.
import { create } from 'zustand'

let nextId = 1

export const useToastStore = create((set) => ({
  toasts: [],
  add: (data) => {
    const id = nextId++
    const toastObj = {
      id,
      type: 'info',
      duration: 4000,
      ...data,
    }
    set((s) => ({ toasts: [...s.toasts, toastObj] }))
    return id
  },
  remove: (id) =>
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}))

// Helper exposed for callers outside React (services, store actions, async handlers).
export const toast = {
  success: (message, opts = {}) =>
    useToastStore.getState().add({ type: 'success', message, duration: 4000, ...opts }),
  error: (message, opts = {}) =>
    useToastStore.getState().add({ type: 'error', message, duration: 6000, ...opts }),
  warning: (message, opts = {}) =>
    useToastStore.getState().add({ type: 'warning', message, duration: 5000, ...opts }),
  info: (message, opts = {}) =>
    useToastStore.getState().add({ type: 'info', message, duration: 4000, ...opts }),
}
