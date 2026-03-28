import { useEffect, useState } from "react"
import axios from "axios"
import { useNavigate, Link } from "react-router-dom"
import { useToast } from "../context/ToastContext"
import logo from "../assets/logo.png"

function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()
  const { showToast } = useToast()

  const handleLogin = async (e) => {
    e.preventDefault()

    try {
      const res = await axios.post(
        "https://academic-resource-sharing-system-final.onrender.com/api/auth/login",
        { email: email.trim(), password }
      )
      const { token, role, name } = res.data

      sessionStorage.setItem("user", JSON.stringify({ name, role, email: email.trim() }))
      sessionStorage.setItem("token", token)
      sessionStorage.setItem("role", role)

      if (role === "student" || role === "faculty" || role === "admin") {
        navigate("/")
      }

    } catch (err) {
      showToast(err.response?.data?.error || "Invalid credentials", "error")
    }
  }

  useEffect(() => {
    const token = sessionStorage.getItem("token")
    const role = sessionStorage.getItem("role")

    if (token && role) {
      if (role === "student" || role === "faculty" || role === "admin") {
        navigate("/")
      }
    }
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="bg-white p-8 md:p-10 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">

        <div className="flex flex-col items-center mb-8">
          <img src={logo} alt="Logo" className="h-16 w-16 mb-4 object-contain" />
          <h2 className="text-3xl font-bold text-gray-800 tracking-tight text-center">
            Welcome Back
          </h2>
          <p className="text-gray-500 text-center mt-2">
            Sign in to access academic resources
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              placeholder="Enter your mail"
              className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white pr-12"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.97 9.97 0 011.563-3.076m1.902-3.27A9.956 9.956 0 0112 5c4.478 0 8.268 2.943 9.542 7a10.059 10.059 0 01-4.135 5.825m-4.694-4.694A3 3 0 1111.45 9.452m8.4 8.4l-12-12" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button className="w-full bg-blue-600 text-white font-semibold py-3 rounded-xl hover:bg-blue-700 transition-colors duration-200 shadow-lg shadow-blue-200 mt-4">
            Sign In
          </button>

          <div className="text-center mt-6">
            <p className="text-gray-600">
              New user?{" "}
              <Link to="/signup" className="text-blue-600 font-semibold hover:text-blue-700 hover:underline">
                Create an account
              </Link>
            </p>
            <p className="text-gray-400 text-xs mt-8">
              © 2026 Academic Resource Sharing System
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}

export default LoginPage
