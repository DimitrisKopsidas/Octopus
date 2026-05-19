import axios from 'axios'

const BASE_URL = 'http://localhost:8080/api/v1'

const http = axios.create({
  baseURL: BASE_URL,
})

function unwrap(promise) {
  return promise.then(res => res.data)
}

export const coursesApi = {
  list: () => unwrap(http.get('/courses')),
}

export const questionsApi = {
  listByCourse: (courseId) => unwrap(http.get(`/questions/${courseId}`)),
  create: (payload) => unwrap(http.post('/questions', payload)),
  update: (id, payload) => unwrap(http.put(`/questions/${id}`, payload)),
  remove: (id) => http.delete(`/questions/${id}`),
}

export default { coursesApi, questionsApi }
