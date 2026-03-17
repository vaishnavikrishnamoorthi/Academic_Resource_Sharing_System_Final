import React, { useEffect, useState } from "react";
import { getNews, deleteNews } from "../../services/newsService";
import { useToast } from "../../context/ToastContext";
import Pagination from "../common/Pagination";

const AdminNews = () => {
    const { showToast } = useToast();
    const [newsList, setNewsList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [menuOpen, setMenuOpen] = useState(null);
    const [showConfirm, setShowConfirm] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const filteredNews = newsList.filter((n) =>
        n.title?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalPages = Math.ceil(filteredNews.length / itemsPerPage);
    const paginatedNews = filteredNews.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    useEffect(() => {
        fetchNews();
    }, []);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery]);

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

    const handleDelete = async () => {
        if (!showConfirm) return;
        try {
            await deleteNews(showConfirm);
            setNewsList(newsList.filter((n) => n.id !== showConfirm));
            setShowConfirm(null);
            if (showToast) showToast("News deleted successfully!");
        } catch (err) {
            if (showToast) showToast("Failed to delete news.", "error");
            console.error(err);
        }
    };

    const handleViewSource = (item) => {
        if (!item.content) return;
        if (item.type === "link") {
            window.open(item.content, "_blank");
        } else {
            const normalizedUrl = item.content.replace(/\\/g, "/");
            window.open(`http://localhost:5000/${normalizedUrl}`, "_blank");
        }
    };

    const getSourceChip = (item) => {
        if (item.type === "image") return { label: "View Img", color: "bg-purple-100 text-purple-700 border-purple-200" };
        if (item.type === "file") return { label: "View File", color: "bg-green-100 text-green-700 border-green-200" };
        return { label: "Visit", color: "bg-blue-100 text-blue-700 border-blue-200" };
    };

    const formatDateTime = (dateStr) => {
        const d = new Date(dateStr);
        return d.toLocaleString("en-GB", {
            day: "2-digit", month: "2-digit", year: "numeric",
            hour: "2-digit", minute: "2-digit"
        });
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">All News</h2>

                {/* Search */}
                <div className="relative">
                    <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Search news by title..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 pr-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64 bg-white shadow-sm"
                    />
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-y-auto max-h-[310px] min-h-[250px]">
                {loading ? (
                    <div className="text-center py-10 text-gray-500">Loading...</div>
                ) : error ? (
                    <div className="text-center py-10 text-red-500">{error}</div>
                ) : (
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 text-sm uppercase tracking-wider">
                                <th className="pl-6 pr-4 py-3 font-semibold w-12 text-left sticky top-0 bg-gray-50 z-10">S.No</th>
                                <th className="px-4 py-3 font-semibold w-40 text-left sticky top-0 bg-gray-50 z-10">Faculty Name</th>
                                <th className="px-4 py-3 font-semibold w-56 text-left sticky top-0 bg-gray-50 z-10">Title</th>
                                <th className="px-4 py-3 font-semibold w-24 text-left sticky top-0 bg-gray-50 z-10">Source</th>
                                <th className="px-4 py-3 font-semibold w-36 text-left sticky top-0 bg-gray-50 z-10">Date & Time</th>
                                <th className="pl-4 pr-6 py-3 font-semibold text-right w-24 sticky top-0 bg-gray-50 z-10">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredNews.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                                        No news found.
                                    </td>
                                </tr>
                            ) : (
                                paginatedNews.map((item, index) => {
                                    const chip = getSourceChip(item);
                                    const serialNumber = (currentPage - 1) * itemsPerPage + index + 1;
                                    return (
                                        <tr key={item.id} className="hover:bg-gray-50 transition-colors text-sm text-gray-700 relative">
                                            <td className="pl-6 pr-4 py-3 font-medium text-gray-900">{serialNumber}</td>
                                            <td className="px-4 py-3 font-medium text-gray-800">{item.uploaded_by_name}</td>
                                            <td className="px-4 py-3">
                                                <span className="font-medium text-gray-900 truncate block max-w-[220px]" title={item.title}>
                                                    {item.title}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                <button
                                                    onClick={() => handleViewSource(item)}
                                                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border transition-colors hover:opacity-80 ${chip.color}`}
                                                >
                                                    {chip.label}
                                                </button>
                                            </td>
                                            <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">
                                                {formatDateTime(item.created_at)}
                                            </td>
                                            <td className="pl-4 pr-6 py-3 text-right relative whitespace-nowrap">
                                                <div className="relative inline-block text-left">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setMenuOpen(menuOpen === item.id ? null : item.id);
                                                        }}
                                                        className="p-1.5 hover:bg-gray-200 rounded-full transition-colors text-gray-500 focus:outline-none"
                                                    >
                                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                                                        </svg>
                                                    </button>
                                                    {menuOpen === item.id && (
                                                        <div className="absolute right-full top-1/2 transform -translate-y-1/2 mr-2 w-32 bg-white rounded-lg shadow-xl border border-gray-100 z-50 flex flex-col overflow-hidden">
                                                            <button
                                                                onClick={() => {
                                                                    setShowConfirm(item.id);
                                                                    setMenuOpen(null);
                                                                }}
                                                                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                                            >
                                                                Delete
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                )}
            </div>

            {!loading && !error && newsList.length > 0 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />
            )}

            {/* Delete Confirmation Modal */}
            {showConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-xl shadow-2xl p-6 max-w-sm w-full">
                        <h3 className="text-xl font-bold text-gray-800 mb-2">Delete News?</h3>
                        <p className="text-gray-600 mb-6 text-sm">
                            Are you sure you want to delete this news? This action cannot be undone.
                        </p>
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => setShowConfirm(null)}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium transition-colors shadow-sm"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Click outside listener for menu */}
            {menuOpen && (
                <div className="fixed inset-0 z-40 bg-transparent" onClick={() => setMenuOpen(null)}></div>
            )}
        </div>
    );
};

export default AdminNews;
