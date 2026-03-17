import { Routes, Route, Navigate } from "react-router-dom"
import LoginPage from "./pages/LoginPage"
import SignupPage from "./pages/SignupPage"
import StudentPage from "./pages/StudentPage"
import FacultyPage from "./pages/FacultyPage"
import AdminPage from "./pages/AdminPage"
import HomePage from "./pages/HomePage"
import ProtectedRoute from "./utils/ProtectedRoute"
import ProfilePage from "./pages/ProfilePage"

function App() {
  return (
    <Routes>

      <Route path="/" element={<HomePage />} />

      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

      <Route
        path="/student"
        element={
          <ProtectedRoute allowedRole="student">
            <StudentPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/faculty"
        element={
          <ProtectedRoute allowedRole="faculty">
            <FacultyPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRole="admin">
            <AdminPage />
          </ProtectedRoute>
        }
      />

    </Routes>
  )
}

export default App
