import axiosInstance from "../utils/axiosInstance";

export const uploadNews = (formData) => {
    return axiosInstance.post("/news/upload", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
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
