// Axios instance + namespaced API (courses/questions/bundles) + URL/error helpers. Used app-wide.
import axios from 'axios'

// Default timeout: if a request hangs longer than this, axios aborts it so the
// UI can show an error instead of loading forever. Uploads get a longer one.
const DEFAULT_TIMEOUT = 8000 // 8s
const UPLOAD_TIMEOUT = 60000 // 60s

// Relative by default: requests hit the same origin as the page and get proxied
// to the backend (Vite dev server in development, nginx in production).
// .env.production still sets VITE_API_BASE_URL, so deployed builds are unaffected.
const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api/v1'

const http = axios.create({
  baseURL: API_BASE,
  timeout: DEFAULT_TIMEOUT,
  withCredentials: true,
})

// In-memory access token storage
let memoryAccessToken = null

export function setAccessToken(token) {
  memoryAccessToken = token
}

export function getAccessToken() {
  return memoryAccessToken
}

http.interceptors.request.use((config) => {
  if (memoryAccessToken) {
    config.headers.Authorization = `Bearer ${memoryAccessToken}`
  }
  return config
})

export function resolveImageUrl(url) {
  if (!url) return url
  if (/^(https?:)?\/\//i.test(url) || /^(data|blob):/i.test(url)) return url
  const origin = API_BASE.replace(/\/api\/v1\/?$/, '')
  return `${origin}${url.startsWith('/') ? '' : '/'}${url}`
}

// Normalise hang/network errors for error states and handle 401 refresh
let isRefreshing = false
let failedQueue = []

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

http.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/auth/login') &&
      !originalRequest.url?.includes('/auth/refresh')
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`
            return http(originalRequest)
          })
          .catch((err) => Promise.reject(err))
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const refreshData = await authApi.refresh()
        setAccessToken(refreshData.accessToken)
        processQueue(null, refreshData.accessToken)
        originalRequest.headers.Authorization = `Bearer ${refreshData.accessToken}`
        return http(originalRequest)
      } catch (refreshErr) {
        processQueue(refreshErr, null)
        setAccessToken(null)
        return Promise.reject(refreshErr)
      } finally {
        isRefreshing = false
      }
    }

    if (error.code === 'ECONNABORTED' || /timeout/i.test(error.message || '')) {
      error.message = 'Το αίτημα άργησε πολύ.'
    } else if (!error.response) {
      error.message = 'Πρόβλημα σύνδεσης με τον server.'
    } else if (error.response.status === 413) {
      error.response.data = { message: 'Η εικόνα είναι πολύ μεγάλη (μέγιστο 1MB).' }
    }
    return Promise.reject(error)
  }
)

const unwrap = (promise) => promise.then((res) => res.data)

// Extract the most useful error message from an axios error.
// Handles: JSON body (.message / .error), plain-string body, interceptor-set message.
export function extractErrorMessage(err, fallback = 'Σφάλμα.') {
  const data = err?.response?.data
  if (data) {
    if (typeof data === 'string' && data.length > 0) return data
    if (data.message) return data.message
    if (data.error) return data.error
  }
  return err?.message || fallback
}

export const coursesApi = {
  list: () => unwrap(http.get('/courses')),
  listWithContent: () => unwrap(http.get('/courses/with-content')),
  countWithContent: () => unwrap(http.get('/courses/count-with-content')),
  update: (id, payload) => unwrap(http.put(`/courses/${id}`, payload)),
}

export const questionsApi = {
  listByCourse: (courseId) => unwrap(http.get(`/questions/${courseId}`)),
  settingsInfo: (courseId) => unwrap(http.get(`/questions/${courseId}/info`)),
  bySetNum: (courseId, setNum) =>
    unwrap(http.get(`/questions/${courseId}/setNum=${setNum}`)),
  byRandomCount: (courseId, count) =>
    unwrap(http.get(`/questions/${courseId}/randomCount=${count}`)),
  create: (payload) => unwrap(http.post('/questions', payload)),
  update: (id, payload) => unwrap(http.put(`/questions/${id}`, payload)),
  // Image is a separate two-step concern: save the question first (to get its id),
  // then upload/delete its image via these endpoints (multipart "file" param).
  uploadImage: (id, file) => {
    const fd = new FormData()
    fd.append('file', file)
    return unwrap(http.post(`/questions/${id}/image`, fd, { timeout: UPLOAD_TIMEOUT }))
  },
  deleteImage: (id) => unwrap(http.delete(`/questions/${id}/image`)),
  remove: (id) => http.patch(`/questions/${id}`),
}

export const bundlesApi = {
  create: (payload) => unwrap(http.post('/bundles', payload)),
  count: () => unwrap(http.get('/bundles/count')),
}

export const authApi = {
  register: (payload) => unwrap(http.post('/users', payload)),
  login: (payload) => unwrap(http.post('/auth/login', payload)),
  refresh: () => unwrap(http.post('/auth/refresh')),
  me: async () => {
    if (!getAccessToken()) {
      try {
        const refreshRes = await authApi.refresh()
        setAccessToken(refreshRes.accessToken)
        return refreshRes.user
      } catch {
        return null
      }
    }
    return unwrap(http.get('/auth/me'))
  },
  logout: () => unwrap(http.post('/auth/logout')),
  updateYear: (year) => unwrap(http.patch('/users/me/year', { year })),
  updatePassword: (payload) => unwrap(http.patch('/users/me/password', payload)),
  accessStudent: () => unwrap(http.get('/access/student')),
  accessHelper: () => unwrap(http.get('/access/helper')),
  accessAdmin: () => unwrap(http.get('/access/admin')),
}

export const auditApi = {
  getLogs: (params) => unwrap(http.get('/audit-logs', { params })),
  createLog: (payload) => unwrap(http.post('/logs/audit', payload)),
}

export const crashApi = {
  getLogs: (params) => unwrap(http.get('/crash-logs', { params })),
  getStats: () => unwrap(http.get('/crash-logs/stats')),
  createLog: (payload) => unwrap(http.post('/logs/crash', payload)),
  markAsResolved: (id, resolved) => unwrap(http.patch(`/crash-logs/${id}/resolve`, { resolved })),
}

export const inviteCodesApi = {
  getCodes: (params) => unwrap(http.get('/invite-codes', { params })),
  generateCode: (payload) => unwrap(http.post('/invite-codes', payload)),
  deleteCode: (id) => unwrap(http.delete(`/invite-codes/${id}`)),
}

export const usersApi = {
  getUsers: (params) => unwrap(http.get('/users', { params })),
  count: () => unwrap(http.get('/users/count')),
  updateRole: (userId, role) => unwrap(http.patch(`/users/${userId}/role`, { role })),
  toggleStatus: (userId, active) => unwrap(http.patch(`/users/${userId}/status`, { active })),
}

export default { coursesApi, questionsApi, bundlesApi, authApi, auditApi, crashApi, inviteCodesApi, usersApi }
