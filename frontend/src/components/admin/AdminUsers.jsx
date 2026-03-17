import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { useToast } from "../../context/ToastContext";
import Pagination from "../common/Pagination";

const AdminUsers = () => {
    const { showToast } = useToast();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState("student");
    const [menuOpen, setMenuOpen] = useState(null);
    const [showConfirm, setShowConfirm] = useState(null);
    const [editUser, setEditUser] = useState(null);
    const [showUpdateConfirm, setShowUpdateConfirm] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    // Filter state
    const [showFilter, setShowFilter] = useState(false);
    const [filterOptions, setFilterOptions] = useState({ courses: [], specializations: [], years: [] });
    const [activeFilters, setActiveFilters] = useState([]); // which filter categories are toggled: ["courses", "specializations", "years"]
    const [selectedValues, setSelectedValues] = useState({ courses: [], specializations: [], years: [] });
    const [appliedFilters, setAppliedFilters] = useState({ courses: [], specializations: [], years: [] });
    const [currentStep, setCurrentStep] = useState(0); // index into activeFilters array
    const [completedSteps, setCompletedSteps] = useState([]); // steps that passed "Next"

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        fetchUsers(activeTab);
    }, [activeTab]);

    useEffect(() => {
        setCurrentPage(1);
    }, [activeTab, searchQuery, users]);

    // Fetch filter options for the active tab
    useEffect(() => {
        axiosInstance.get(`/auth/users/filters?role=${activeTab}`).then((res) => {
            setFilterOptions(res.data);
        }).catch((err) => console.error("Failed to load filters", err));
    }, [activeTab]);

    const fetchUsers = async (role, filters = appliedFilters) => {
        setLoading(true);
        try {
            const params = { filter: role };
            if (filters.courses.length) params.courses = filters.courses.join(",");
            if (filters.specializations.length) params.specializations = filters.specializations.join(",");
            if (filters.years.length) params.years = filters.years.join(",");
            const res = await axiosInstance.get("/auth/users", { params });
            setUsers(res.data);
        } catch (err) {
            setError("Failed to load users.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!showConfirm) return;
        try {
            await axiosInstance.delete(`/auth/users/${showConfirm}`);
            setUsers(users.filter((u) => u.id !== showConfirm));
            setShowConfirm(null);
            if (showToast) showToast("User deleted successfully!");
        } catch (err) {
            if (showToast) showToast("Failed to delete user.", "error");
            console.error(err);
        }
    };

    const handleUpdate = async () => {
        if (!editUser) return;
        try {
            await axiosInstance.put(`/auth/users/${editUser.id}`, editUser);
            if (showToast) showToast("User updated successfully!");
            setUsers(users.map(u => u.id === editUser.id ? editUser : u));
            setEditUser(null);
            setShowUpdateConfirm(false);
        } catch (err) {
            if (showToast) showToast(err.response?.data?.error || "Failed to update user.", "error");
            console.error(err);
        }
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return "—";
        const d = new Date(dateStr);
        return d.toLocaleString("en-GB", {
            day: "2-digit", month: "2-digit", year: "numeric",
            hour: "2-digit", minute: "2-digit"
        });
    };

    // Filter helpers
    const filterLabels = { courses: "Course", specializations: "Specialization", years: "Year" };

    const toggleFilterCategory = (cat) => {
        if (activeFilters.includes(cat)) {
            setActiveFilters(activeFilters.filter((c) => c !== cat));
            setSelectedValues({ ...selectedValues, [cat]: [] });
            // Remove from completed steps
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
        fetchUsers(activeTab, selectedValues);
    };

    const handleClearFilter = () => {
        const empty = { courses: [], specializations: [], years: [] };
        setSelectedValues(empty);
        setAppliedFilters(empty);
        setActiveFilters([]);
        setCurrentStep(0);
        setCompletedSteps([]);
        setShowFilter(false);
        fetchUsers(activeTab, empty);
    };

    const openFilter = () => {
        // Restore to applied state
        setSelectedValues({ ...appliedFilters });
        const active = [];
        if (appliedFilters.courses.length) active.push("courses");
        if (appliedFilters.specializations.length) active.push("specializations");
        if (appliedFilters.years.length) active.push("years");
        setActiveFilters(active);
        setCompletedSteps([...active]);
        setCurrentStep(0);
        setShowFilter(true);
    };

    const hasActiveFilters = appliedFilters.courses.length || appliedFilters.specializations.length || appliedFilters.years.length;

    return (
        <div>
            {/* Sub-tabs + Filter button */}
            <div className="flex mb-6 items-center justify-between">
                <div className="bg-white p-1 rounded-xl shadow-sm border border-gray-100 inline-flex">
                    <button
                        onClick={() => { setActiveTab("student"); setSearchQuery(""); handleClearFilter(); }}
                        className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${activeTab === "student"
                            ? "bg-blue-600 text-white shadow-md"
                            : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
                            }`}
                    >
                        Students
                    </button>
                    <button
                        onClick={() => { setActiveTab("faculty"); setSearchQuery(""); handleClearFilter(); }}
                        className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${activeTab === "faculty"
                            ? "bg-blue-600 text-white shadow-md"
                            : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
                            }`}
                    >
                        Faculty
                    </button>
                </div>

                <div className="flex items-center gap-3">
                    {/* Search */}
                    <div className="relative">
                        <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search by name..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 pr-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-56 bg-white"
                        />
                    </div>

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
                                {appliedFilters.courses.length + appliedFilters.specializations.length + appliedFilters.years.length}
                            </span>
                        )}
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-y-auto max-h-[310px] min-h-[250px]">
                {loading ? (
                    <div className="text-center py-10 text-gray-500">Loading...</div>
                ) : error ? (
                    <div className="text-center py-10 text-red-500">{error}</div>
                ) : (
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 text-sm uppercase tracking-wider">
                                <th className="pl-6 pr-4 py-3 font-semibold w-12 sticky top-0 bg-gray-50 z-10 text-left">S.No</th>
                                <th className="px-4 py-3 font-semibold w-32 sticky top-0 bg-gray-50 z-10 text-left">Roll Number</th>
                                <th className="px-4 py-3 font-semibold w-48 sticky top-0 bg-gray-50 z-10 text-left">Name</th>
                                <th className="px-4 py-3 font-semibold sticky top-0 bg-gray-50 z-10 text-left">Email</th>
                                {activeTab === "student" && (
                                    <>
                                        <th className="px-4 py-3 font-semibold w-24 sticky top-0 bg-gray-50 z-10 text-left">Year</th>
                                        <th className="px-4 py-3 font-semibold w-32 sticky top-0 bg-gray-50 z-10 text-left">Course</th>
                                        <th className="px-4 py-3 font-semibold w-36 sticky top-0 bg-gray-50 z-10 text-left">Specialization</th>
                                    </>
                                )}
                                {activeTab === "faculty" && (
                                    <th className="px-4 py-3 font-semibold w-36 sticky top-0 bg-gray-50 z-10 text-left">Specialization</th>
                                )}
                                <th className="px-4 py-3 font-semibold w-36 sticky top-0 bg-gray-50 z-10 text-left">Joined</th>
                                <th className="pl-4 pr-6 py-3 font-semibold text-right w-24 sticky top-0 bg-gray-50 z-10">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {(() => {
                                const filteredUsers = users.filter((u) =>
                                    u.name?.toLowerCase().includes(searchQuery.toLowerCase())
                                );
                                const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
                                const paginatedUsers = filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

                                return filteredUsers.length === 0 ? (
                                    <tr>
                                        <td colSpan={activeTab === "student" ? "8" : "6"} className="px-6 py-8 text-center text-gray-500">
                                            {searchQuery
                                                ? `No results for "${searchQuery}"`
                                                : `No ${activeTab === "student" ? "students" : "faculty"} found.`}
                                        </td>
                                    </tr>
                                ) : (
                                    <>
                                        {paginatedUsers.map((user, index) => {
                                            const serialNumber = (currentPage - 1) * itemsPerPage + index + 1;
                                            return (
                                                <tr key={user.id} className="hover:bg-gray-50 transition-colors text-sm text-gray-700">
                                                    <td className="pl-6 pr-4 py-3 font-medium text-gray-900">{serialNumber}</td>
                                                    <td className="px-4 py-3 text-gray-700">{user.roll_number || "—"}</td>
                                                    <td className="px-4 py-3 font-medium text-gray-800">{user.name}</td>
                                                    <td className="px-4 py-3 text-gray-600">{user.email}</td>
                                                    {activeTab === "student" && (
                                                        <>
                                                            <td className="px-4 py-3 text-gray-600">{user.year || "—"}</td>
                                                            <td className="px-4 py-3 text-gray-600">{user.course || "—"}</td>
                                                            <td className="px-4 py-3 text-gray-600">{user.specialization || "—"}</td>
                                                        </>
                                                    )}
                                                    {activeTab === "faculty" && (
                                                        <td className="px-4 py-3 text-gray-600">{user.specialization || "—"}</td>
                                                    )}
                                                    <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">
                                                        {formatDate(user.created_at)}
                                                    </td>
                                                    <td className="pl-4 pr-6 py-3 text-right relative whitespace-nowrap">
                                                        <div className="relative inline-block text-left">
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setMenuOpen(menuOpen === user.id ? null : user.id);
                                                                }}
                                                                className="p-1.5 hover:bg-gray-200 rounded-full transition-colors text-gray-500 focus:outline-none"
                                                            >
                                                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                                                                </svg>
                                                            </button>
                                                            {menuOpen === user.id && (
                                                                <div className="absolute right-full top-1/2 transform -translate-y-1/2 mr-2 w-32 bg-white rounded-lg shadow-xl border border-gray-100 z-50 flex flex-col overflow-hidden">
                                                                    <button
                                                                        onClick={() => {
                                                                            setEditUser({ ...user });
                                                                            setMenuOpen(null);
                                                                        }}
                                                                        className="w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 border-b border-gray-50 transition-colors"
                                                                    >
                                                                        Edit
                                                                    </button>
                                                                    <button
                                                                        onClick={() => {
                                                                            setShowConfirm(user.id);
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
                                        })}
                                    </>
                                );
                            })()}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Pagination for Admin Users */}
            {!loading && !error && (() => {
                const filteredUsers = users.filter((u) =>
                    u.name?.toLowerCase().includes(searchQuery.toLowerCase())
                );
                const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
                return filteredUsers.length > 0 ? (
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                ) : null;
            })()}

            {/* Filter Slide-in Panel */}
            {showFilter && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
                        onClick={() => setShowFilter(false)}
                    />

                    {/* Panel */}
                    <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-2xl z-50 flex flex-col animate-slide-in">
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                            <h3 className="text-lg font-bold text-gray-800">Filter by</h3>
                            <button
                                onClick={() => setShowFilter(false)}
                                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Filter Category Pills */}
                        <div className="px-6 py-4 border-b border-gray-100">
                            <div className="flex gap-2">
                                {(activeTab === "student"
                                    ? ["courses", "specializations", "years"]
                                    : ["specializations"]
                                ).map((cat) => (
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
                                        {/* Section Header */}
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

                                        {/* Show options if current step, or summary if completed */}
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

                                                {/* Next button — if there are more steps */}
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

                    <style>{`
                        @keyframes slideIn {
                            from { transform: translateX(100%); }
                            to { transform: translateX(0); }
                        }
                        .animate-slide-in {
                            animation: slideIn 0.25s ease-out;
                        }
                    `}</style>
                </>
            )}

            {/* Update Confirmation Modal */}
            {showUpdateConfirm && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-xl shadow-2xl p-6 max-w-sm w-full animate-in zoom-in duration-200">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">Update Details?</h3>
                        <p className="text-gray-600 mb-6 text-sm">
                            Are you sure you want to update this user's profile details?
                        </p>
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => setShowUpdateConfirm(false)}
                                className="px-5 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium transition-colors"
                            >
                                No, Cancel
                            </button>
                            <button
                                onClick={handleUpdate}
                                className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium transition-colors shadow-sm"
                            >
                                Yes, Update
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit User Modal */}
            {editUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
                        {/* Modal Header */}
                        <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                            <div className="w-10"></div> {/* Spacer for center alignment */}
                            <h3 className="text-lg font-bold text-gray-800">
                                Edit {editUser.role === "student" ? "Student" : "Faculty"} Details
                            </h3>
                            <button
                                onClick={() => setEditUser(null)}
                                className="flex items-center gap-1.5 text-gray-400 hover:text-red-600 transition-all text-xs font-semibold uppercase tracking-wider bg-white px-2 py-1 rounded-md border border-gray-100 shadow-sm"
                            >
                                <span>cancel edit</span>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
                            <div className="grid grid-cols-2 gap-4">
                                {/* Name */}
                                <div className="col-span-2 space-y-1">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-tight ml-1">Full Name</label>
                                    <input
                                        type="text"
                                        value={editUser.name}
                                        onChange={(e) => setEditUser({ ...editUser, name: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                                    />
                                </div>

                                {/* Email */}
                                <div className="col-span-2 space-y-1">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-tight ml-1">Email Address</label>
                                    <input
                                        type="email"
                                        value={editUser.email}
                                        onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                                    />
                                </div>

                                {/* Role (Read-only) */}
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-tight ml-1">Role</label>
                                    <input
                                        type="text"
                                        value={editUser.role}
                                        readOnly
                                        className="w-full px-4 py-2.5 bg-gray-100 border border-gray-200 rounded-xl text-sm text-gray-500 cursor-not-allowed outline-none"
                                    />
                                </div>

                                {/* Roll Number */}
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-tight ml-1">Roll Number</label>
                                    <input
                                        type="text"
                                        value={editUser.roll_number || ""}
                                        onChange={(e) => setEditUser({ ...editUser, roll_number: e.target.value.toUpperCase() })}
                                        pattern="^[0-9]{2}[A-Z]{2}[0-9]{3}$"
                                        placeholder="e.g. 22CS001"
                                        title="Roll Number must be in YYSSNNN format (e.g., 22CS001)"
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                                    />
                                </div>

                                {editUser.role === "student" && (
                                    <>
                                        {/* Year */}

                                        {/* Year */}
                                        <div className="space-y-1">
                                            <label className="text-xs font-bold text-gray-400 uppercase tracking-tight ml-1">Year</label>
                                            <input
                                                type="text"
                                                value={editUser.year || ""}
                                                onChange={(e) => setEditUser({ ...editUser, year: e.target.value })}
                                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                                            />
                                        </div>

                                        {/* Course */}
                                        <div className="space-y-1">
                                            <label className="text-xs font-bold text-gray-400 uppercase tracking-tight ml-1">Course</label>
                                            <input
                                                type="text"
                                                value={editUser.course || ""}
                                                onChange={(e) => setEditUser({ ...editUser, course: e.target.value })}
                                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                                            />
                                        </div>
                                    </>
                                )}

                                {/* Specialization */}
                                <div className="col-span-2 space-y-1">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-tight ml-1">Specialization</label>
                                    <input
                                        type="text"
                                        value={editUser.specialization || ""}
                                        onChange={(e) => setEditUser({ ...editUser, specialization: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="p-6 bg-gray-50 border-t border-gray-100">
                            <button
                                onClick={() => setShowUpdateConfirm(true)}
                                className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 active:scale-[0.98]"
                            >
                                Update Details
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-xl shadow-2xl p-6 max-w-sm w-full animate-in zoom-in duration-200">
                        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">Delete User?</h3>
                        <p className="text-gray-600 mb-6 text-sm">
                            Are you sure you want to delete this user? This action cannot be undone.
                        </p>
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => setShowConfirm(null)}
                                className="px-5 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium transition-colors shadow-sm"
                            >
                                Delete User
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

export default AdminUsers;
