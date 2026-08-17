// Single QueryClient for the app + shared query-key factory.
// Imported by main.jsx (provider) and by hooks/queries.js (keys).
import { QueryClient } from '@tanstack/react-query'
import { extractErrorMessage } from './api'

// Defaults tuned for this app's data:
// - Course/question content changes rarely (only an admin writes it), so a 5min
//   staleTime avoids refetching on every navigation while still self-healing.
// - No refetchOnWindowFocus: students leave the tab during a quiz and coming
//   back should not trigger a burst of requests.
// - retry 1: the axios instance already fails fast (8s timeout); one retry
//   covers a flaky connection without making the error state feel slow.
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})

// Centralised query keys. Always build keys through this object so that
// invalidation stays in sync with the queries that produced the data.
// Hierarchy matters: invalidating ['courses'] also invalidates
// ['courses','withContent'], because TanStack matches keys by prefix.
export const qk = {
  courses: {
    all: ['courses'],
    list: () => ['courses', 'list'],
    withContent: () => ['courses', 'withContent'],
    countWithContent: () => ['courses', 'countWithContent'],
  },
  questions: {
    all: ['questions'],
    byCourse: (courseId) => ['questions', 'byCourse', String(courseId)],
    settings: (courseId) => ['questions', 'settings', String(courseId)],
  },
  bundles: {
    count: () => ['bundles', 'count'],
  },
  auth: {
    // The logged-in user. Login and logout invalidate this key; everything that
    // needs to know "who am I" reads it instead of keeping its own copy.
    me: () => ['auth', 'me'],
  },
  audit: {
    all: ['audit-logs'],
    list: (params) => ['audit-logs', 'list', params],
  },
  crash: {
    all: ['crash-logs'],
    list: (params) => ['crash-logs', 'list', params],
    stats: () => ['crash-logs', 'stats'],
  },
  inviteCodes: {
    all: ['invite-codes'],
    list: (params) => ['invite-codes', 'list', params],
  },
  users: {
    all: ['users'],
    list: (params) => ['users', 'list', params],
    count: () => ['users', 'count'],
    countActive: () => ['users', 'countActive'],
  },
}

// Shared error mapper so every hook surfaces the same Greek message shape the
// old stores produced (ErrorState/toasts expect a plain string).
export const toMessage = (err, fallback) => extractErrorMessage(err, fallback)
