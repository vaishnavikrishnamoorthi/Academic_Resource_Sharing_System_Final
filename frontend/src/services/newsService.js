import axiosInstance from "../utils/axiosInstance";

export const uploadNews = (formData) => {
    return axiosInstance.post("/news/upload", formData);
};



export const getNews = () => {
    return axiosInstance.get("/news");
};

export const getMyNews = () => {
    return axiosInstance.get("/news/my-news");
};

export const deleteNews = (id) => {
    return axiosInstance.delete(`/news/${id}`);
};
