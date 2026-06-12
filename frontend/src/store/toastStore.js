// Zustand toast store + toast.* helper API. Used app-wide.
import { create } from 'zustand'

let nextId = 1

export const useToastStore = create((set, get) => ({
  toasts: [],
  add: (data) => {
    const toastObj = {
      type: 'info',
      duration: 4000,
      title: undefined,
      ...data,
    }

    const { toasts } = get()

    // Dedupe: if the same toast (type + title + message) is already on screen,
    // don't stack a copy — just bump its `seq` so its auto-dismiss timer restarts.
    const dup = toasts.find(
      (x) => x.type === toastObj.type && x.title === toastObj.title && x.message === toastObj.message
    )
    if (dup) {
      set((s) => ({
        toasts: s.toasts.map((x) => (x.id === dup.id ? { ...x, seq: (x.seq || 0) + 1 } : x)),
      }))
      return dup.id
    }

    // Single-toast policy: only one toast visible at a time. A new (distinct)
    // toast replaces whatever is currently shown — newest wins.
    const id = nextId++
    set({ toasts: [{ id, seq: 0, ...toastObj }] })
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
