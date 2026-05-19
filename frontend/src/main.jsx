import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import Layout from './components/Layout.jsx'
import Home from './pages/Home.jsx'
import Courses from './pages/Courses.jsx'
import CourseStart from './pages/CourseStart.jsx'
import Test from './pages/Test.jsx'
import Results from './pages/Results.jsx'
import Admin from './pages/Admin.jsx'
import AdminCourse from './pages/AdminCourse.jsx'
import NotFound from './pages/NotFound.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:courseId/start" element={<CourseStart />} />
          <Route path="/test/:courseId" element={<Test />} />
          <Route path="/test/:courseId/results" element={<Results />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/courses/:courseId" element={<AdminCourse />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
