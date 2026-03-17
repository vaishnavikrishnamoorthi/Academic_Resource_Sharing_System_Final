import axios from "axios"

const API = "http://localhost:5000/api"

const getToken = () => {
  return sessionStorage.getItem("token")
}

export const bookmarkResource = async (id) => {
  const response = await axios.post(
    `${API}/bookmark/${id}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    }
  )

  return response.data
}
