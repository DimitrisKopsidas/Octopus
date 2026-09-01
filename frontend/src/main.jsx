// App entry: mounts React + BrowserRouter with all route definitions.
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { queryClient } from './lib/queryClient'
import './index.css'
import ScrollToTop from './components/layout/ScrollToTop.jsx'
import ErrorBoundary from './components/layout/ErrorBoundary.jsx'
import { installGlobalErrorHandlers } from './lib/clientLog'
import Layout from './components/layout/Layout.jsx'
import RequireRole from './components/layout/RequireRole.jsx'
import { ROLE } from './lib/roles'
import Home from './pages/Home.jsx'
import Courses from './pages/Courses.jsx'
import CourseStart from './pages/CourseStart.jsx'
import Test from './pages/Test.jsx'
import Results from './pages/Results.jsx'
import ControlPanel from './pages/ControlPanel.jsx'
import ControlPanelCoursesPage from './pages/ControlPanelCoursesPage.jsx'
import ControlPanelReportsPage from './pages/ControlPanelReportsPage.jsx'
import AdminCourse from './pages/AdminCourse.jsx'
import AdminPanel from './pages/AdminPanel.jsx'
import AuditLogsPage from './pages/AuditLogsPage.jsx'
import CrashLogsPage from './pages/CrashLogsPage.jsx'
import InviteCodesPage from './pages/InviteCodesPage.jsx'
import UserManagementPage from './pages/UserManagementPage.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Profile from './pages/Profile.jsx'
import Settings from './pages/Settings.jsx'
import Favorites from './pages/Favorites.jsx'
import Quizzes from './pages/Quizzes.jsx'
import Info from './pages/Info.jsx'
import NotFound from './pages/NotFound.jsx'

// Πριν το render: ό,τι σκάσει από εδώ και πέρα -- ακόμα και κατά το mount --
// φτάνει στα crash logs αντί να χαθεί στην κονσόλα του χρήστη.
installGlobalErrorHandlers()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:courseId/start" element={<CourseStart />} />
          <Route path="/test/:courseId" element={<Test />} />
          <Route path="/test/:courseId/results" element={<Results />} />
          <Route path="/control-panel" element={<RequireRole><ControlPanel /></RequireRole>} />
          <Route path="/control-panel/courses" element={<RequireRole><ControlPanelCoursesPage /></RequireRole>} />
          <Route
            path="/control-panel/courses/:courseId"
            element={<RequireRole><AdminCourse /></RequireRole>}
          />
          <Route path="/control-panel/reports" element={<RequireRole><ControlPanelReportsPage /></RequireRole>} />
          <Route
            path="/admin-panel"
            element={<RequireRole allowedRoles={[ROLE.ADMIN]}><AdminPanel /></RequireRole>}
          />
          <Route
            path="/admin-panel/audits"
            element={<RequireRole allowedRoles={[ROLE.ADMIN]}><AuditLogsPage /></RequireRole>}
          />
          <Route
            path="/admin-panel/crashes"
            element={<RequireRole allowedRoles={[ROLE.ADMIN]}><CrashLogsPage /></RequireRole>}
          />
          <Route
            path="/admin-panel/invite-codes"
            element={<RequireRole allowedRoles={[ROLE.ADMIN]}><InviteCodesPage /></RequireRole>}
          />
          <Route
            path="/admin-panel/users"
            element={<RequireRole allowedRoles={[ROLE.ADMIN]}><UserManagementPage /></RequireRole>}
          />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/quizzes" element={<Quizzes />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/info" element={<Info />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
    {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />}
    </QueryClientProvider>
    </ErrorBoundary>
  </StrictMode>,
)
