import { Navigate } from "react-router-dom"

function ProtectedRoute({ children, allowedRole }) {
  const token = sessionStorage.getItem("token")
  const role = sessionStorage.getItem("role")

  if (!token) {
    return <Navigate to="/login" />
  }

  if (allowedRole && role !== allowedRole) {
    return <Navigate to="/login" />
  }

  return children
}

export default ProtectedRoute
