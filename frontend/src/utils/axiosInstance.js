import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://academic-resource-sharing-system-final.onrender.com/api",
});

axiosInstance.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("role");
      sessionStorage.removeItem("user");
      window.location.href = "/"; // Redirect to login
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
