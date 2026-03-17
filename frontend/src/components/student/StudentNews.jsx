import React, { useEffect, useState } from "react";
import { getNews } from "../../services/newsService";

const StudentNews = () => {
    const [newsList, setNewsList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchNews();
    }, []);

    const fetchNews = async () => {
        try {
            const res = await getNews();
            setNewsList(res.data);
        } catch (err) {
            setError("Failed to load news.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">News</h2>

            {loading ? (
                <div className="text-center py-10 text-gray-500">Loading news...</div>
            ) : error ? (
                <div className="text-center py-10 text-red-500">{error}</div>
            ) : newsList.length === 0 ? (
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center text-gray-500">
                    <p>No new updates available.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {newsList.map((item) => (
                        <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 relative hover:shadow-md transition-shadow flex flex-col h-full">
                            {/* Type Badge - Top Right */}
                            <div className={`absolute top-4 right-4 text-xs font-semibold px-2 py-1 rounded-full uppercase ${item.type === 'image' ? 'bg-purple-50 text-purple-600' :
                                item.type === 'file' ? 'bg-green-50 text-green-600' :
                                    'bg-blue-50 text-blue-600'
                                }`}>
                                {item.type}
                            </div>

                            {/* Title */}
                            <h3 className="text-lg font-medium text-gray-800 mt-6 mb-4 line-clamp-2 min-h-[3.5rem]">
                                {item.title}
                            </h3>

                            {/* View Button */}
                            <div className="mt-auto">
                                <a
                                    href={item.type === 'link' ? item.content : `http://localhost:5000/${item.content}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-block px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                                >
                                    View News
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default StudentNews;
