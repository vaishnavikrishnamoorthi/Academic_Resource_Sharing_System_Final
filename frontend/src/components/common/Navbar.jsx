import { useNavigate } from "react-router-dom"

function Navbar({ title }) {
  const navigate = useNavigate()
  const name = sessionStorage.getItem("name")

  const handleLogout = () => {
    sessionStorage.clear()
    navigate("/login")
  }

  return (
    <div className="bg-white shadow p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">{title}</h1>

      <div className="flex items-center gap-4">
        <span>Welcome, {name}</span>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-1 rounded"
        >
          Logout
        </button>
      </div>
    </div>
  )
}

export default Navbar
