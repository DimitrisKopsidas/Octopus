import axios from 'axios'

const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1',
})

const unwrap = (promise) => promise.then((res) => res.data)

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
  create: (payload) => unwrap(http.post('/questions', payload)),
  update: (id, payload) => unwrap(http.put(`/questions/${id}`, payload)),
  remove: (id) => http.delete(`/questions/${id}`),
}

export const bundlesApi = {
  create: (payload) => unwrap(http.post('/bundles', payload)),
}

export default { coursesApi, questionsApi, bundlesApi }
