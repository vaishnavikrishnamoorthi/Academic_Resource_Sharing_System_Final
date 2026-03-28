import axios from "axios"

const API = "https://academic-resource-sharing-system-final.onrender.com/api"

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
