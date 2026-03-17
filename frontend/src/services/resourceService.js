import axiosInstance from "../utils/axiosInstance";

// 🔹 Upload Resource
export const uploadResource = (formData, onUploadProgress) => {
  return axiosInstance.post("/resources/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    onUploadProgress,
  });
};

export const getMyUploads = () => {
  return axiosInstance.get("/resources/my-uploads");
};

// 🔹 Delete Resource
export const deleteResource = (id) => {
  return axiosInstance.delete(`/resources/${id}`);
};

// 🔹 Update Resource
export const updateResource = (id, data) => {
  return axiosInstance.put(`/resources/${id}`, data);
};

// 🔹 Departments
export const getCourses = () => {
  return axiosInstance.get("/resources/courses");
};

export const getSpecializations = (course) =>
  axiosInstance.get("/resources/specializations", {
    params: { course }
  });

export const getSemesters = (course, specialization) =>
  axiosInstance.get("/resources/semesters", {
    params: { course, specialization }
  });

export const getSubjects = (course, semester) =>
  axiosInstance.get("/resources/subjects", {
    params: { course, semester }
  });


// 🔹 Filtered resources
export const getFilteredResources = (course, semester, subject) => {
  return axiosInstance.get("/resources", {
    params: { course, semester, subject },
  });
};

// 🔹 Download Resource
export const downloadResource = (id) => {
  return axiosInstance.get(`/resources/download/${id}`, {
    responseType: "blob", // Important for file download
  });
};

// 🔹 Bookmarks
export const addBookmark = (resourceId) => {
  return axiosInstance.post("/bookmarks", { resource_id: resourceId });
};

export const removeBookmark = (resourceId) => {
  return axiosInstance.delete(`/bookmarks/${resourceId}`);
};

export const getMyBookmarks = () => {
  return axiosInstance.get("/bookmarks");
};
