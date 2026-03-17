import React, { useState } from "react";
import { useToast } from "../../context/ToastContext";
import { uploadNews } from "../../services/newsService";
import NewsRecommendations from "./NewsRecommendations"; // AI Feature — remove this line to disable

const UploadNews = () => {
    const { showToast } = useToast();
    const [title, setTitle] = useState("");
    const [source, setSource] = useState(""); // Stores link text or file name for display
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setSource(selectedFile.name); // Show filename in input
        }
    };

    const handleSourceChange = (e) => {
        setSource(e.target.value);
        setFile(null); // Clear file if typing manually (assuming link)
    };

    const handleUploadClick = () => {
        if (!title || (!source && !file)) {
            showToast("Please enter a title and a source (link or file).", "error");
            return;
        }
        setShowConfirm(true);
    };

    const confirmUpload = async () => {
        setShowConfirm(false);
        setLoading(true);

        try {
            const formData = new FormData();
            formData.append("title", title);

            if (file) {
                formData.append("file", file);
            } else {
                formData.append("source", source);
            }

            await uploadNews(formData);
            showToast("News uploaded successfully!");

            // Reset form
            setTitle("");
            setSource("");
            setFile(null);

        } catch (error) {
            console.error("Upload failed", error);
            showToast(
                error.response?.data?.details || error.response?.data?.error || "Failed to upload news.",
                "error"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            {/* AI News Suggestions — remove this block to disable the AI feature */}
            <div className="mb-6">
                <NewsRecommendations
                    onSelectArticle={(article) => {
                        setTitle(article.title);
                        setSource(article.source);
                        setFile(null);
                    }}
                />
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Upload News</h2>

                <div className="space-y-6">
                    {/* Title Field */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            placeholder="News Heading"
                        />
                    </div>

                    {/* Source Field with External Upload Icon */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Source</label>
                        <div className="flex items-center gap-3">
                            <input
                                type="text"
                                value={source}
                                onChange={handleSourceChange}
                                className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                placeholder="pdf, link, img"
                            />

                            <div className="relative">
                                <input
                                    type="file"
                                    id="news-file-upload"
                                    onChange={handleFileChange}
                                    className="hidden"
                                    accept="image/*,.pdf"
                                />
                                <label
                                    htmlFor="news-file-upload"
                                    className="p-3 bg-blue-50 text-blue-600 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors border border-blue-200 flex items-center justify-center"
                                    title="Upload File"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                    </svg>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Upload Button */}
                    <button
                        onClick={handleUploadClick}
                        className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 mt-4"
                        disabled={loading}
                    >
                        {loading ? "Uploading..." : "Upload News"}
                    </button>
                </div>

                {/* Confirmation Popup with Background Blur */}
                {showConfirm && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm transition-all duration-300">
                        <div className="bg-white rounded-xl shadow-2xl p-6 max-w-sm w-full transform scale-100 transition-transform duration-200">
                            <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">Confirm Upload</h3>
                            <p className="text-gray-600 mb-6 text-center text-sm">
                                Are you sure you want to upload this news?
                            </p>
                            <div className="flex gap-3 justify-center">
                                <button
                                    onClick={() => setShowConfirm(false)}
                                    className="px-5 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmUpload}
                                    className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium transition-colors shadow-sm"
                                >
                                    Confirm
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UploadNews;
