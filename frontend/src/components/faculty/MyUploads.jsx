import React, { useEffect, useState } from "react";
import { getMyUploads, deleteResource } from "../../services/resourceService";
import { getMyNews, deleteNews } from "../../services/newsService";
import { useToast } from "../../context/ToastContext";
import Pagination from "../common/Pagination";

const MyUploads = ({ onEdit }) => {
    const { showToast } = useToast();
    const [activeTab, setActiveTab] = useState("resources"); // "resources" | "news"

    const [uploads, setUploads] = useState([]);
    const [newsList, setNewsList] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [showConfirm, setShowConfirm] = useState(null); // ID of item to delete
    const [deleteType, setDeleteType] = useState(null); // "resource" | "news"

    const [actionMenuOpen, setActionMenuOpen] = useState(null); // ID of item with open menu
    const [selectedResource, setSelectedResource] = useState(null);

    const [searchQuery, setSearchQuery] = useState("");

    // Filter state for resources
    const [showFilter, setShowFilter] = useState(false);
    const [filterOptions, setFilterOptions] = useState({ courses: [], specializations: [], semesters: [] });
    const [activeFilters, setActiveFilters] = useState([]); // ["courses", "specializations", "semesters"]
    const [selectedValues, setSelectedValues] = useState({ courses: [], specializations: [], semesters: [] });
    const [appliedFilters, setAppliedFilters] = useState({ courses: [], specializations: [], semesters: [] });
    const [currentStep, setCurrentStep] = useState(0);
    const [completedSteps, setCompletedSteps] = useState([]);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const filteredUploads = uploads.filter((u) => {
        let match = true;
        if (appliedFilters.courses.length > 0 && !appliedFilters.courses.includes(u.course)) match = false;
        if (appliedFilters.specializations.length > 0 && !appliedFilters.specializations.includes(u.specialization)) match = false;
        // Semester might be number or string
        if (appliedFilters.semesters.length > 0 && !appliedFilters.semesters.includes(String(u.semester))) match = false;
        return match;
    });

    const filteredNews = newsList.filter((n) =>
        n.title?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalResourcesPages = Math.ceil(filteredUploads.length / itemsPerPage);
    const paginatedResources = filteredUploads.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const totalNewsPages = Math.ceil(filteredNews.length / itemsPerPage);
    const paginatedNews = filteredNews.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    useEffect(() => {
        if (uploads.length > 0) {
            const courses = [...new Set(uploads.map(u => u.course).filter(Boolean))];
            const specializations = [...new Set(uploads.map(u => u.specialization).filter(Boolean))];
            const semesters = [...new Set(uploads.map(u => String(u.semester)).filter(Boolean))];
            setFilterOptions({ courses, specializations, semesters });
        }
    }, [uploads]);

    useEffect(() => {
        fetchData();
        setCurrentPage(1);
        setSearchQuery("");
    }, [activeTab]);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            if (activeTab === "resources") {
                const res = await getMyUploads();
                setUploads(res.data);
            } else {
                const res = await getMyNews();
                setNewsList(res.data);
            }
        } catch (err) {
            setError("Failed to fetch data.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!showConfirm) return;

        try {
            if (deleteType === "resource") {
                await deleteResource(showConfirm);
                setUploads(uploads.filter((item) => item.id !== showConfirm));
            } else {
                await deleteNews(showConfirm);
                setNewsList(newsList.filter((item) => item.id !== showConfirm));
            }
            setShowConfirm(null);
            setDeleteType(null);
            if (showToast) showToast(`${deleteType === "resource" ? "Resource" : "News"} deleted successfully!`);
        } catch (err) {
            if (showToast) showToast("Failed to delete item", "error");
            console.error(err);
        }
    };

    const confirmDelete = (id, type) => {
        setShowConfirm(id);
        setDeleteType(type);
        setActionMenuOpen(null);
    }

    const handleDownload = (resource) => {
        if (!resource.file_url) return;
        const normalizedUrl = resource.file_url.replace(/\\/g, "/");
        window.open(`https://academic-resource-sharing-system-final.onrender.com/${normalizedUrl}`, "_blank");
    };

    // Filter helpers
    const filterLabels = { courses: "Course", specializations: "Specialization", semesters: "Semester" };

    const toggleFilterCategory = (cat) => {
        if (activeFilters.includes(cat)) {
            setActiveFilters(activeFilters.filter((c) => c !== cat));
            setSelectedValues({ ...selectedValues, [cat]: [] });
            setCompletedSteps(completedSteps.filter((c) => c !== cat));
        } else {
            setActiveFilters([...activeFilters, cat]);
        }
    };

    const toggleValue = (cat, val) => {
        const current = selectedValues[cat];
        if (current.includes(val)) {
            setSelectedValues({ ...selectedValues, [cat]: current.filter((v) => v !== val) });
        } else {
            setSelectedValues({ ...selectedValues, [cat]: [...current, val] });
        }
    };

    const handleNext = () => {
        const currentCat = activeFilters[currentStep];
        if (!completedSteps.includes(currentCat)) {
            setCompletedSteps([...completedSteps, currentCat]);
        }
        if (currentStep < activeFilters.length - 1) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handleEditStep = (cat) => {
        const idx = activeFilters.indexOf(cat);
        if (idx !== -1) {
            setCurrentStep(idx);
            setCompletedSteps(completedSteps.filter((c) => c !== cat));
        }
    };

    const handleShowResults = () => {
        setAppliedFilters({ ...selectedValues });
        setShowFilter(false);
        setCurrentPage(1);
    };

    const handleClearFilter = () => {
        const empty = { courses: [], specializations: [], semesters: [] };
        setSelectedValues(empty);
        setAppliedFilters(empty);
        setActiveFilters([]);
        setCurrentStep(0);
        setCompletedSteps([]);
        setShowFilter(false);
        setCurrentPage(1);
    };

    const openFilter = () => {
        setSelectedValues({ ...appliedFilters });
        const active = [];
        if (appliedFilters.courses.length) active.push("courses");
        if (appliedFilters.specializations.length) active.push("specializations");
        if (appliedFilters.semesters.length) active.push("semesters");
        setActiveFilters(active);
        setCompletedSteps([...active]);
        setCurrentStep(0);
        setShowFilter(true);
    };

    const hasActiveFilters = appliedFilters.courses.length || appliedFilters.specializations.length || appliedFilters.semesters.length;

    return (
        <div className="space-y-6">
            {/* Tabs & Controls */}
            <div className="flex items-center justify-between border-b border-gray-200">
                <div className="flex gap-6">
                    <button
                        className={`pb-3 px-1 font-medium text-sm transition-all relative ${activeTab === "resources"
                            ? "text-blue-600 border-b-2 border-blue-600"
                            : "text-gray-500 hover:text-gray-700 hover:border-b-2 hover:border-gray-200"
                            }`}
                        onClick={() => { setActiveTab("resources"); setSearchQuery(""); }}
                    >
                        Resources
                    </button>
                    <button
                        className={`pb-3 px-1 font-medium text-sm transition-all relative ${activeTab === "news"
                            ? "text-blue-600 border-b-2 border-blue-600"
                            : "text-gray-500 hover:text-gray-700 hover:border-b-2 hover:border-gray-200"
                            }`}
                        onClick={() => { setActiveTab("news"); }}
                    >
                        News
                    </button>
                </div>

                {/* Filter and Search */}
                <div className="flex items-center gap-3 pb-2">
                    {activeTab === "news" && (
                        <div className="relative">
                            <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                                type="text"
                                placeholder="Search news by title..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9 pr-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64 bg-white"
                            />
                        </div>
                    )}
                    {activeTab === "resources" && (
                        <button
                            onClick={openFilter}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all border ${hasActiveFilters
                                ? "bg-blue-50 text-blue-600 border-blue-200"
                                : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                                }`}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                            </svg>
                            Filter
                            {hasActiveFilters > 0 && (
                                <span className="bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                    {appliedFilters.courses.length + appliedFilters.specializations.length + appliedFilters.semesters.length}
                                </span>
                            )}
                        </button>
                    )}
                </div>
            </div>

            {/* Content Container */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-y-auto max-h-[310px] min-h-[250px]">
                {loading ? (
                    <div className="text-center py-10 text-gray-500">Loading...</div>
                ) : error ? (
                    <div className="text-center py-10 text-red-500">{error}</div>
                ) : (
                    <>
                        {/* RESOURCES TABLE */}
                        {activeTab === "resources" && (
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 text-sm uppercase tracking-wider">
                                        <th className="pl-6 pr-4 py-3 font-semibold w-12 text-left sticky top-0 bg-gray-50 z-10">S.No</th>
                                        <th className="px-4 py-3 font-semibold w-32 text-left sticky top-0 bg-gray-50 z-10">Course</th>
                                        <th className="px-4 py-3 font-semibold w-24 text-left sticky top-0 bg-gray-50 z-10">Semester</th>
                                        <th className="px-4 py-3 font-semibold w-40 text-left sticky top-0 bg-gray-50 z-10">Subject Code</th>
                                        <th className="px-4 py-3 font-semibold w-40 text-left sticky top-0 bg-gray-50 z-10">Specialization</th>
                                        <th className="px-4 py-3 font-semibold w-20 text-left sticky top-0 bg-gray-50 z-10">Unit</th>
                                        <th className="px-4 py-3 font-semibold w-56 text-left sticky top-0 bg-gray-50 z-10">Title</th>
                                        <th className="px-4 py-3 font-semibold w-24 text-left sticky top-0 bg-gray-50 z-10">Resource</th>
                                        <th className="pl-4 pr-6 py-3 font-semibold text-right w-24 sticky top-0 bg-gray-50 z-10">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {filteredUploads.length === 0 ? (
                                        <tr><td colSpan="9" className="px-6 py-8 text-center text-gray-500">No resources found.</td></tr>
                                    ) : (
                                        paginatedResources.map((item, index) => {
                                            const serialNumber = (currentPage - 1) * itemsPerPage + index + 1;
                                            return (
                                                <tr
                                                    key={item.id}
                                                    className="hover:bg-blue-50 cursor-pointer transition-colors text-sm text-gray-700 relative"
                                                    onClick={() => setSelectedResource(item)}
                                                >
                                                    <td className="pl-6 pr-4 py-3 font-medium text-gray-900">{serialNumber}</td>
                                                    <td className="px-4 py-3 truncate max-w-[120px]" title={item.course}>{item.course}</td>
                                                    <td className="px-4 py-3">{item.semester}</td>
                                                    <td className="px-4 py-3 truncate max-w-[150px]" title={item.subject_code}>{item.subject_code || "—"}</td>
                                                    <td className="px-4 py-3 truncate max-w-[150px]" title={item.specialization}>{item.specialization || "—"}</td>
                                                    <td className="px-4 py-3">{item.unit}</td>
                                                    <td className="px-4 py-3 text-gray-900 w-auto">
                                                        <div className="truncate w-56" title={item.title}>{item.title}</div>
                                                    </td>
                                                    <td className="px-4 py-3 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                                                        <button
                                                            onClick={() => handleDownload(item)}
                                                            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors cursor-pointer border border-blue-200"
                                                        >
                                                            View
                                                        </button>
                                                    </td>
                                                    <td className="pl-4 pr-6 py-3 text-right relative whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                                                        <div className="relative inline-block text-left">
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setActionMenuOpen(actionMenuOpen === item.id ? null : item.id);
                                                                }}
                                                                className="p-1.5 hover:bg-gray-200 rounded-full transition-colors text-gray-500 focus:outline-none"
                                                            >
                                                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                                                                </svg>
                                                            </button>
                                                            {actionMenuOpen === item.id && (
                                                                <div className="absolute right-full top-1/2 transform -translate-y-1/2 mr-2 w-32 bg-white rounded-lg shadow-xl border border-gray-100 z-50 flex flex-col overflow-hidden">
                                                                    <button
                                                                        onClick={() => { onEdit(item); setActionMenuOpen(null); }}
                                                                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors border-b border-gray-50 last:border-0"
                                                                    >
                                                                        Update
                                                                    </button>
                                                                    <button
                                                                        onClick={() => confirmDelete(item.id, "resource")}
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

                        {/* NEWS TABLE */}
                        {activeTab === "news" && (
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 text-sm uppercase tracking-wider">
                                        <th className="pl-6 pr-4 py-3 font-semibold w-12 text-left sticky top-0 bg-gray-50 z-10">S.No</th>
                                        <th className="px-4 py-3 font-semibold w-56 text-left sticky top-0 bg-gray-50 z-10">Title</th>
                                        <th className="px-4 py-3 font-semibold w-24 text-left sticky top-0 bg-gray-50 z-10">Type</th>
                                        <th className="px-4 py-3 font-semibold w-24 text-left sticky top-0 bg-gray-50 z-10">Source</th>
                                        <th className="px-4 py-3 font-semibold w-36 text-left sticky top-0 bg-gray-50 z-10">Date</th>
                                        <th className="pl-4 pr-6 py-3 font-semibold text-right w-24 sticky top-0 bg-gray-50 z-10">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {filteredNews.length === 0 ? (
                                        <tr><td colSpan="6" className="px-6 py-8 text-center text-gray-500">No news uploaded.</td></tr>
                                    ) : (
                                        paginatedNews.map((item, index) => {
                                            const serialNumber = (currentPage - 1) * itemsPerPage + index + 1;
                                            return (
                                                <tr key={item.id} className="hover:bg-gray-50 transition-colors text-sm text-gray-700 relative">
                                                    <td className="pl-6 pr-4 py-3 font-medium text-gray-900">{serialNumber}</td>
                                                    <td className="px-4 py-3">
                                                        <span className="font-medium text-gray-900 truncate block max-w-[220px]" title={item.title}>
                                                            {item.title}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3 capitalize whitespace-nowrap">
                                                        <span className={`px-2 py-1 rounded text-xs font-semibold ${item.type === 'file' || item.type === 'image' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'}`}>
                                                            {item.type}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3 whitespace-nowrap">
                                                        {item.type === 'image' && (
                                                            <a
                                                                href={`https://academic-resource-sharing-system-final.onrender.com/${item.content}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700 hover:bg-indigo-200 transition-colors border border-indigo-200"
                                                            >
                                                                View Img
                                                            </a>
                                                        )}
                                                        {item.type === 'file' && (
                                                            <a
                                                                href={`https://academic-resource-sharing-system-final.onrender.com/${item.content}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 hover:bg-green-200 transition-colors border border-green-200"
                                                            >
                                                                View File
                                                            </a>
                                                        )}
                                                        {item.type === 'link' && (
                                                            <a
                                                                href={item.content}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors border border-blue-200"
                                                            >
                                                                Visit
                                                            </a>
                                                        )}
                                                    </td>
                                                    <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">
                                                        {new Date(item.created_at).toLocaleString("en-GB", {
                                                            day: "2-digit", month: "2-digit", year: "numeric",
                                                            hour: "2-digit", minute: "2-digit"
                                                        })}
                                                    </td>
                                                    <td className="pl-4 pr-6 py-3 text-right relative whitespace-nowrap">
                                                        <div className="relative inline-block text-left">
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setActionMenuOpen(actionMenuOpen === item.id ? null : item.id);
                                                                }}
                                                                className="p-1.5 hover:bg-gray-200 rounded-full transition-colors text-gray-500 focus:outline-none"
                                                            >
                                                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                                                                </svg>
                                                            </button>
                                                            {actionMenuOpen === item.id && (
                                                                <div className="absolute right-full top-1/2 transform -translate-y-1/2 mr-2 w-32 bg-white rounded-lg shadow-xl border border-gray-100 z-50 flex flex-col overflow-hidden">
                                                                    <button
                                                                        onClick={() => confirmDelete(item.id, "news")}
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
                    </>
                )}
            </div>

            {/* ── Resource Detail Popup ── */}
            {selectedResource && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4"
                    onClick={() => setSelectedResource(null)}
                >
                    <div
                        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Popup Header */}
                        <div className="relative flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50">
                            <h3 className="text-lg font-bold text-gray-800">
                                Resource Details
                            </h3>
                            <button
                                onClick={() => setSelectedResource(null)}
                                className="flex items-center gap-1.5 text-gray-500 hover:text-gray-800 transition-colors text-sm font-medium"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                Close
                            </button>
                        </div>

                        {/* Popup Body */}
                        <div className="px-6 py-5 grid grid-cols-2 gap-x-6 gap-y-5 text-left">
                            {/* Course */}
                            <div className="flex flex-col gap-1">
                                <span className="text-xs font-semibold text-gray-400">Course</span>
                                <span className="text-gray-800 font-medium">{selectedResource.course || "—"}</span>
                            </div>

                            {/* Specialization */}
                            <div className="flex flex-col gap-1">
                                <span className="text-xs font-semibold text-gray-400">Specialization</span>
                                <span className="text-gray-800 font-medium">{selectedResource.specialization || "—"}</span>
                            </div>

                            {/* Semester */}
                            <div className="flex flex-col gap-1">
                                <span className="text-xs font-semibold text-gray-400">Semester</span>
                                <span className="text-gray-800 font-medium">Semester {selectedResource.semester}</span>
                            </div>

                            {/* Subject */}
                            <div className="flex flex-col gap-1">
                                <span className="text-xs font-semibold text-gray-400">Subject</span>
                                <span className="text-gray-800 font-medium">{selectedResource.subject || "—"}</span>
                            </div>

                            {/* Subject Code */}
                            <div className="flex flex-col gap-1">
                                <span className="text-xs font-semibold text-gray-400">Subject Code</span>
                                <span className="text-gray-800 font-medium">{selectedResource.subject_code || "—"}</span>
                            </div>

                            {/* Unit */}
                            <div className="flex flex-col gap-1">
                                <span className="text-xs font-semibold text-gray-400">Unit</span>
                                <span className="text-gray-800 font-medium">{selectedResource.unit || "—"}</span>
                            </div>

                            {/* Title */}
                            <div className="col-span-2 flex flex-col gap-1">
                                <span className="text-xs font-semibold text-gray-400">Title</span>
                                <span className="text-gray-800 font-medium">{selectedResource.title}</span>
                            </div>

                            {/* Uploaded */}
                            <div className="col-span-2 flex flex-col gap-1">
                                <span className="text-xs font-semibold text-gray-400">Uploaded Date</span>
                                <span className="text-gray-800 font-medium">
                                    {new Date(selectedResource.created_at).toLocaleString("en-GB", {
                                        day: "2-digit", month: "2-digit", year: "numeric",
                                        hour: "2-digit", minute: "2-digit"
                                    })}
                                </span>
                            </div>

                            {/* Resource / View */}
                            <div className="flex flex-col gap-1">
                                <span className="text-xs font-semibold text-gray-400">Resource</span>
                                <button
                                    onClick={() => handleDownload(selectedResource)}
                                    className="inline-flex items-center gap-1.5 w-fit px-4 py-1.5 rounded-full text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-sm"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                    View File
                                </button>
                            </div>
                        </div>

                        {/* Popup Footer */}
                        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
                            <button
                                onClick={() => { onEdit(selectedResource); setSelectedResource(null); }}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 text-sm font-medium transition-colors"
                            >
                                Edit Details
                            </button>
                            <button
                                onClick={() => { confirmDelete(selectedResource.id, "resource"); setSelectedResource(null); }}
                                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium transition-colors shadow-sm"
                            >
                                Delete Resource
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Pagination for Resources */}

            {!loading && !error && activeTab === "news" && newsList.length > 0 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalNewsPages}
                    onPageChange={setCurrentPage}
                />
            )}

            {/* Delete Confirmation Modal */}
            {showConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm transition-all duration-300 p-4">
                    <div className="bg-white rounded-xl shadow-2xl p-6 max-w-sm w-full transform scale-100 transition-transform duration-200">
                        <h3 className="text-xl font-bold text-gray-800 mb-2">Delete {deleteType === "resource" ? "Resource" : "News"}?</h3>
                        <p className="text-gray-600 mb-6 text-sm">
                            Are you sure you want to delete this {deleteType}? This action cannot be undone.
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

            {/* Click outside listener */}
            {actionMenuOpen && (
                <div className="fixed inset-0 z-40 bg-transparent" onClick={() => setActionMenuOpen(null)}></div>
            )}

            {/* Filter Side Panel */}
            {showFilter && (
                <>
                    <div
                        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity"
                        onClick={handleClearFilter}
                    />
                    <div className="fixed inset-y-0 right-0 w-96 bg-white shadow-2xl z-50 animate-slide-in flex flex-col border-l border-gray-100">
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                                </svg>
                                Filter Resources
                            </h3>
                            <button
                                onClick={handleShowResults}
                                className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                            >
                                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Filter Category Pills */}
                        <div className="px-6 py-4 border-b border-gray-100">
                            <div className="flex gap-2">
                                {["courses", "specializations", "semesters"].map((cat) => (
                                    <button
                                        key={cat}
                                        onClick={() => toggleFilterCategory(cat)}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeFilters.includes(cat)
                                            ? "bg-blue-600 text-white"
                                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                            }`}
                                    >
                                        {filterLabels[cat]}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Filter Content */}
                        <div className="flex-1 overflow-y-auto px-6 py-4">
                            {activeFilters.length === 0 && (
                                <p className="text-gray-400 text-sm text-center mt-8">
                                    Select a filter category above to get started.
                                </p>
                            )}

                            {activeFilters.map((cat, idx) => {
                                const isCurrentStep = idx === currentStep;
                                const isCompleted = completedSteps.includes(cat);
                                const values = filterOptions[cat] || [];
                                const selected = selectedValues[cat] || [];

                                return (
                                    <div key={cat} className="mb-5">
                                        <div className="flex items-center justify-between mb-3">
                                            <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                                                {filterLabels[cat]}
                                                {isCompleted && selected.length > 0 && (
                                                    <span className="ml-2 text-blue-600 text-xs font-semibold">
                                                        ({selected.length} selected)
                                                    </span>
                                                )}
                                            </h4>
                                            {isCompleted && !isCurrentStep && (
                                                <button
                                                    onClick={() => handleEditStep(cat)}
                                                    className="text-xs text-blue-600 hover:text-blue-700 font-semibold"
                                                >
                                                    Edit
                                                </button>
                                            )}
                                        </div>

                                        {isCurrentStep ? (
                                            <>
                                                <div className="space-y-1.5 max-h-48 overflow-y-auto">
                                                    {values.length === 0 ? (
                                                        <p className="text-gray-400 text-sm">No options available.</p>
                                                    ) : (
                                                        values.map((val) => (
                                                            <label
                                                                key={val}
                                                                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors ${selected.includes(val) ? "bg-blue-50" : "hover:bg-gray-50"
                                                                    }`}
                                                            >
                                                                <input
                                                                    type="checkbox"
                                                                    checked={selected.includes(val)}
                                                                    onChange={() => toggleValue(cat, val)}
                                                                    className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                                                />
                                                                <span className="text-sm text-gray-700 font-medium">{val}</span>
                                                            </label>
                                                        ))
                                                    )}
                                                </div>

                                                {idx < activeFilters.length - 1 && (
                                                    <button
                                                        onClick={handleNext}
                                                        className="mt-3 text-sm text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1"
                                                    >
                                                        Next
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                                        </svg>
                                                    </button>
                                                )}
                                            </>
                                        ) : isCompleted ? (
                                            <div className="flex flex-wrap gap-1.5">
                                                {selected.map((val) => (
                                                    <span
                                                        key={val}
                                                        className="inline-flex items-center bg-blue-50 text-blue-700 text-xs font-medium px-2.5 py-1 rounded-full"
                                                    >
                                                        {val}
                                                    </span>
                                                ))}
                                                {selected.length === 0 && (
                                                    <span className="text-gray-400 text-xs">None selected</span>
                                                )}
                                            </div>
                                        ) : null}

                                        {idx < activeFilters.length - 1 && (
                                            <div className="border-b border-gray-100 mt-4" />
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Footer Buttons */}
                        {activeFilters.length > 0 && (
                            <div className="px-6 py-4 border-t border-gray-100 space-y-2">
                                <button
                                    onClick={handleShowResults}
                                    className="w-full bg-blue-600 text-white font-semibold py-2.5 rounded-xl hover:bg-blue-700 transition-colors shadow-sm text-sm"
                                >
                                    Show Results
                                </button>
                                <button
                                    onClick={handleClearFilter}
                                    className="w-full text-gray-500 hover:text-red-600 font-medium py-2 rounded-xl hover:bg-red-50 transition-colors text-sm"
                                >
                                    Clear Filters
                                </button>
                            </div>
                        )}
                    </div>
                </>
            )}

            <style>{`
                @keyframes slideIn {
                    from { transform: translateX(100%); }
                    to { transform: translateX(0); }
                }
                .animate-slide-in {
                    animation: slideIn 0.25s ease-out;
                }
            `}</style>
        </div>
    );
};

export default MyUploads;
