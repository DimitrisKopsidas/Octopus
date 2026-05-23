import axios from 'axios'
import { mockCourses, mockQuestions as initialMockQuestions } from './mockData'

// Set FORCE_MOCK to true to bypass the database and test completely with local mock data
// Set FORCE_MOCK to false to fetch from the actual Spring Boot backend
const FORCE_MOCK = false

const BASE_URL = 'http://localhost:8080/api/v1'

const http = axios.create({
  baseURL: BASE_URL,
  timeout: 1500, // short timeout so it fails quickly if backend is offline
})

// In-memory collections for fully functional offline modes
let localCourses = [...mockCourses]
let localQuestions = [...initialMockQuestions]

export const coursesApi = {
  list: () => 
    FORCE_MOCK
      ? Promise.resolve(localCourses)
      : http.get('/courses')
          .then(res => res.data)
          .catch((err) => {
            console.warn('Backend offline, using mock courses', err)
            return localCourses
          }),

  bySemester: (semester) => 
    FORCE_MOCK
      ? Promise.resolve(semester === 'all' ? localCourses : localCourses.filter(c => String(c.semester) === String(semester)))
      : http.get(`/courses/${semester}`)
          .then(res => res.data)
          .catch((err) => {
            console.warn('Backend offline, using mock courses by semester', err)
            if (semester === 'all') return localCourses
            return localCourses.filter(c => String(c.semester) === String(semester))
          }),

  listWithContent: () => 
    FORCE_MOCK
      ? Promise.resolve(localCourses.filter(c => localQuestions.some(q => String(q.courseId) === String(c.id))))
      : http.get('/courses/with-content')
          .then(res => res.data)
          .catch((err) => {
            console.warn('Backend offline, using mock courses with content', err)
            return localCourses.filter(c => localQuestions.some(q => String(q.courseId) === String(c.id)))
          }),
}

export const questionsApi = {
  listByCourse: (courseId) => 
    FORCE_MOCK
      ? Promise.resolve(localQuestions.filter(q => String(q.courseId) === String(courseId)))
      : http.get(`/questions/${courseId}`)
          .then(res => res.data)
          .catch((err) => {
            console.warn('Backend offline, using mock questions by course', err)
            return localQuestions.filter(q => String(q.courseId) === String(courseId))
          }),

  create: (payload) => 
    FORCE_MOCK
      ? Promise.resolve().then(() => {
          const newQuestion = {
            ...payload,
            id: Date.now(),
            courseId: Number(payload.courseId),
            answers: payload.answers.map((a, i) => ({
              ...a,
              id: Date.now() + i + 1,
            }))
          }
          localQuestions.push(newQuestion)
          return newQuestion
        })
      : http.post('/questions', payload)
          .then(res => res.data)
          .catch((err) => {
            console.warn('Backend offline, creating mock question', err)
            const newQuestion = {
              ...payload,
              id: Date.now(),
              courseId: Number(payload.courseId),
              answers: payload.answers.map((a, i) => ({
                ...a,
                id: Date.now() + i + 1,
              }))
            }
            localQuestions.push(newQuestion)
            return newQuestion
          }),

  update: (id, payload) => 
    FORCE_MOCK
      ? Promise.resolve().then(() => {
          const idx = localQuestions.findIndex(q => String(q.id) === String(id))
          if (idx !== -1) {
            localQuestions[idx] = {
              ...localQuestions[idx],
              ...payload,
              answers: payload.answers.map((a, i) => ({
                ...a,
                id: a.id || (Date.now() + i + 1),
              }))
            }
            return localQuestions[idx]
          }
          throw new Error('Question not found in mock data')
        })
      : http.put(`/questions/${id}`, payload)
          .then(res => res.data)
          .catch((err) => {
            console.warn('Backend offline, updating mock question', err)
            const idx = localQuestions.findIndex(q => String(q.id) === String(id))
            if (idx !== -1) {
              localQuestions[idx] = {
                ...localQuestions[idx],
                ...payload,
                answers: payload.answers.map((a, i) => ({
                  ...a,
                  id: a.id || (Date.now() + i + 1),
                }))
              }
              return localQuestions[idx]
            }
            throw new Error('Question not found in mock data')
          }),

  remove: (id) => 
    FORCE_MOCK
      ? Promise.resolve().then(() => {
          localQuestions = localQuestions.filter(q => String(q.id) !== String(id))
        })
      : http.delete(`/questions/${id}`)
          .catch((err) => {
            console.warn('Backend offline, removing mock question', err)
            localQuestions = localQuestions.filter(q => String(q.id) !== String(id))
          }),
}

export default { coursesApi, questionsApi }
