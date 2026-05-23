import axios from 'axios'

const http = axios.create({
  baseURL: 'http://localhost:8080/api/v1',
})

const unwrap = (promise) => promise.then((res) => res.data)

export const coursesApi = {
  list: () => unwrap(http.get('/courses')),
  bySemester: (semester) => unwrap(http.get(`/courses/${semester}`)),
  listWithContent: () => unwrap(http.get('/courses/with-content')),
}

export const questionsApi = {
  listByCourse: (courseId) => unwrap(http.get(`/questions/${courseId}`)),
  create: (payload) => unwrap(http.post('/questions', payload)),
  update: (id, payload) => unwrap(http.put(`/questions/${id}`, payload)),
  remove: (id) => http.delete(`/questions/${id}`),
}

export default { coursesApi, questionsApi }
