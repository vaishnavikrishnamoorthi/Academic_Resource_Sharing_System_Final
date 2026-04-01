import { useState } from "react"
import axios from "axios"
import { useNavigate, Link } from "react-router-dom"
import { useToast } from "../context/ToastContext"

import logo from "../assets/logo.png"

function SignupPage() {
  const [activeTab, setActiveTab] = useState("student")
  const [formData, setFormData] = useState({
    name: "",
    roll_number: "",
    year: "",
    course: "",
    specialization: "",
    email: "",
    password: "",
  })
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()
  const { showToast } = useToast()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleTabSwitch = (tab) => {
    setActiveTab(tab)
    setFormData({
      name: "",
      roll_number: "",
      year: "",
      course: "",
      specialization: "",
      email: "",
      password: "",
    })
  }

  const handleSignup = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await axios.post("https://academic-resource-sharing-system-final.onrender.com/api/auth/signup", {
        ...formData,
        email: formData.email.trim(),
        role: activeTab,
      })

      showToast("Signup successful. Please login.")
      navigate("/login")
    } catch (err) {
      showToast(err.response?.data?.error || "Signup failed", "error")
    } finally {
      setLoading(false)
    }
  }

  const inputClass =
    "w-full border border-gray-300 px-3 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">

        {/* Header */}
        <div className="flex flex-col items-center mb-5">
          <img src={logo} alt="Logo" className="h-14 w-14 mb-3 object-contain" />
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight text-center">
            Create Account
          </h2>
        </div>

        {/* Tabs */}
        <div className="flex mb-5 bg-gray-100 rounded-xl p-1">
          <button
            type="button"
            onClick={() => handleTabSwitch("student")}
            className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${activeTab === "student"
              ? "bg-blue-600 text-white shadow-md"
              : "text-gray-500 hover:text-gray-800"
              }`}
          >
            Student
          </button>
          <button
            type="button"
            onClick={() => handleTabSwitch("faculty")}
            className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${activeTab === "faculty"
              ? "bg-blue-600 text-white shadow-md"
              : "text-gray-500 hover:text-gray-800"
              }`}
          >
            Faculty
          </button>
          {/* --- ADMIN TAB START --- */}
          <button
            type="button"
            onClick={() => handleTabSwitch("admin")}
            className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${activeTab === "admin"
              ? "bg-blue-600 text-white shadow-md"
              : "text-gray-500 hover:text-gray-800"
              }`}
          >
            Admin
          </button>
          {/* --- ADMIN TAB END --- */}
        </div>

        {/* Form */}
        <form onSubmit={handleSignup} className="space-y-3.5">

          {/* Row 1: Name + Roll Number */}
          <div className={activeTab === "admin" ? "block" : "grid grid-cols-2 gap-3"}>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Full Name</label>
              <input
                type="text"
                name="name"
                placeholder="Enter full name"
                className={inputClass}
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            {activeTab !== "admin" && (
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  {activeTab === "student" ? "Roll Number" : "Faculty ID"}
                </label>
                <input
                  type="text"
                  name="roll_number"
                  placeholder={activeTab === "student" ? "e.g. 21CS001" : "e.g. FFCS001"}
                  className={inputClass}
                  value={formData.roll_number}
                  onChange={(e) => setFormData({ ...formData, roll_number: e.target.value.toUpperCase() })}
                  pattern={activeTab === "student" ? "^[0-9]{2}[A-Z]{2}[0-9]{3}$" : "^[A-Z]{2}[A-Z]{2}[0-9]{3}$"}
                  title={activeTab === "student" 
                    ? "Roll Number must be in YYSSNNN format (e.g., 22CS001)" 
                    : "Faculty ID must be in RRSSNNN format (e.g., FFCS001)"}
                  required
                />
              </div>
            )}
          </div>

          {/* Student-only: Year + Course */}
          {activeTab === "student" && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Year</label>
                <input
                  type="text"
                  name="year"
                  placeholder="e.g. III"
                  className={inputClass}
                  value={formData.year}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Course</label>
                <input
                  type="text"
                  name="course"
                  placeholder="e.g. B.Sc"
                  className={inputClass}
                  value={formData.course}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          )}

          {/* Specialization */}
          {activeTab !== "admin" && (
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Specialization</label>
              <input
                type="text"
                name="specialization"
                placeholder="e.g. Computer Science"
                className={inputClass}
                value={formData.specialization}
                onChange={handleChange}
                required
              />
            </div>
          )}

          {/* Email */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Email Address</label>
            <input
              type="email"
              name="email"
              placeholder={`Enter your ${activeTab === 'student' ? '@vcw.com' : activeTab === 'faculty' ? '@vcw.edu' : '@admin.vcw.edu'} email`}
              className={inputClass}
              value={formData.email}
              onChange={handleChange}
              pattern={activeTab === "student" ? ".*@vcw\\.com$" : activeTab === "faculty" ? ".*@vcw\\.edu$" : ".*@admin\\.vcw\\.edu$"}
              title={`Please use your ${activeTab === "student" ? "@vcw.com" : activeTab === "faculty" ? "@vcw.edu" : "@admin.vcw.edu"} email address`}
              required
            />
            <p className="mt-1 text-[10px] text-gray-400 italic">
              * Required: Use <strong>{activeTab === "student" ? "@vcw.com" : activeTab === "faculty" ? "@vcw.edu" : "@admin.vcw.edu"}</strong> for {activeTab} accounts.
            </p>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Create a password"
                className={`${inputClass} pr-10`}
                value={formData.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                {showPassword ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.97 9.97 0 011.563-3.076m1.902-3.27A9.956 9.956 0 0112 5c4.478 0 8.268 2.943 9.542 7a10.059 10.059 0 01-4.135 5.825m-4.694-4.694A3 3 0 1111.45 9.452m8.4 8.4l-12-12" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white font-semibold py-2.5 rounded-xl hover:bg-blue-700 transition-colors duration-200 shadow-lg shadow-blue-200 mt-1 text-sm"
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>

          <div className="text-center pt-1">
            <p className="text-gray-600 text-sm">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-600 font-semibold hover:text-blue-700 hover:underline">
                Login here
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}

export default SignupPage
