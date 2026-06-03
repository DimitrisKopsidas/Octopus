import axios from 'axios'

// Default timeout: if a request hangs longer than this, axios aborts it so the
// UI can show an error instead of loading forever. Uploads get a longer one.
const DEFAULT_TIMEOUT = 8000 // 8s
const UPLOAD_TIMEOUT = 60000 // 60s

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1'

const http = axios.create({
  baseURL: API_BASE,
  timeout: DEFAULT_TIMEOUT,
})

// Resolves a question image URL coming from the backend.
// - Absolute (http/https) or data/blob URL → used as-is
// - Relative path (e.g. "/images/x.jpg" or "images/x.jpg") → prefixed with the
//   backend origin so the <img> loads from the API server, not the frontend.
export function resolveImageUrl(url) {
  if (!url) return url
  if (/^(https?:)?\/\//i.test(url) || /^(data|blob):/i.test(url)) return url
  const origin = API_BASE.replace(/\/api\/v1\/?$/, '')
  return `${origin}${url.startsWith('/') ? '' : '/'}${url}`
}

// Normalise hang/network errors for error states
http.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.code === 'ECONNABORTED' || /timeout/i.test(error.message || '')) {
      error.message = 'Το αίτημα άργησε πολύ.'
    } else if (!error.response) {
      error.message = 'Πρόβλημα σύνδεσης με τον server.'
    }
    return Promise.reject(error)
  }
)

const unwrap = (promise) => promise.then((res) => res.data)

// Builds the request body + per-request config for question create/update.
// - No image  → plain JSON (existing contract)
// - With image → multipart/form-data with two parts + a longer timeout:
//     `request` (application/json) = the DTO
//     `image`   (file)             = the picked image
// Backend (Spring): @RequestPart("request") Dto, @RequestPart(value="image", required=false) MultipartFile
function questionBody(payload, imageFile) {
  if (!imageFile) return { data: payload, config: undefined }
  const fd = new FormData()
  fd.append('request', new Blob([JSON.stringify(payload)], { type: 'application/json' }))
  fd.append('image', imageFile)
  return { data: fd, config: { timeout: UPLOAD_TIMEOUT } }
}

export const coursesApi = {
  list: () => unwrap(http.get('/courses')),
  listWithContent: () => unwrap(http.get('/courses/with-content')),
  update: (id, payload) => unwrap(http.put(`/courses/${id}`, payload)),
}

export const questionsApi = {
  listByCourse: (courseId) => unwrap(http.get(`/questions/${courseId}`)),
  settingsInfo: (courseId) => unwrap(http.get(`/questions/${courseId}/info`)),
  bySetNum: (courseId, setNum) =>
    unwrap(http.get(`/questions/${courseId}/setNum=${setNum}`)),
  byRandomCount: (courseId, count) =>
    unwrap(http.get(`/questions/${courseId}/randomCount=${count}`)),
  create: (payload, imageFile) => {
    const body = questionBody(payload, imageFile)
    return unwrap(http.post('/questions', body.data, body.config))
  },
  update: (id, payload, imageFile) => {
    const body = questionBody(payload, imageFile)
    return unwrap(http.put(`/questions/${id}`, body.data, body.config))
  },
  remove: (id) => http.delete(`/questions/${id}`),
}

export const bundlesApi = {
  create: (payload) => unwrap(http.post('/bundles', payload)),
}

export default { coursesApi, questionsApi, bundlesApi }
