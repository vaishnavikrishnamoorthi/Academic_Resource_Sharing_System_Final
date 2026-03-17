import React, { useState, useEffect } from "react";
import { useToast } from "../../context/ToastContext";
import { uploadResource, updateResource } from "../../services/resourceService";

const UploadResource = ({ editData, onCancelEdit, onSuccess }) => {
    const { showToast } = useToast();
    const initialFormState = {
        year: "2026",
        course: "",
        specialization: "",
        semester: "",
        subject: "",
        unit: "",
        title: "",
        subject_code: "", // Added subject_code to initial state
        file: null,
    };

    const fileInputRef = React.useRef(null);

    const [formData, setFormData] = useState(initialFormState);
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [showConfirm, setShowConfirm] = useState(false);

    // Load edit data if available, or reset if null
    useEffect(() => {
        if (editData) {
            setFormData({
                year: editData.year || "2026",
                course: editData.course || "",
                specialization: editData.specialization || "",
                semester: editData.semester || "",
                subject: editData.subject || "",
                unit: editData.unit || "",
                title: editData.title || "",
                subject_code: editData.subject_code || "", // Added subject_code to edit data load
                file: null,
            });
            if (fileInputRef.current) fileInputRef.current.value = "";
        } else {
            setFormData(initialFormState); // Reset form when not editing
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    }, [editData]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, file: e.target.files[0] });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Validation: File is required only for new uploads
        if (!editData && !formData.file) {
            showToast("Please select a file.", "error");
            return;
        }
        setShowConfirm(true);
    };

    const confirmAction = async () => {
        setShowConfirm(false);
        setLoading(true);
        setProgress(0);

        try {
            // Create FormData object (needed for file upload in both cases)
            const data = new FormData();
            data.append("year", formData.year);
            data.append("course", formData.course);
            data.append("specialization", formData.specialization);
            data.append("semester", formData.semester);
            data.append("subject", formData.subject);
            data.append("subject_code", formData.subject_code);
            data.append("unit", formData.unit);
            data.append("title", formData.title);

            if (formData.file) {
                data.append("file", formData.file);
            }

            if (editData) {
                // Update functionality
                await updateResource(editData.id, data);
                showToast("Resource updated successfully!");

                // Keep form filled or reset? Usually keep filled logic or redirect.
                // User asked to "remove details" on cancel, but on success we usually clear or redirect.
                // Let's clear on success too by calling success callback which usually refreshes list.
            } else {
                // Upload functionality
                await uploadResource(data, (event) => {
                    const percent = Math.round((event.loaded * 100) / event.total);
                    setProgress(percent);
                });
                showToast("Resource uploaded successfully!");

                // Reset form on upload success
                setFormData(initialFormState);
                if (fileInputRef.current) fileInputRef.current.value = "";
                setProgress(0);
            }

            if (onSuccess) onSuccess();

        } catch (err) {
            console.error("Action failed", err);
            showToast(err.response?.data?.error || "Action failed", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                    {editData ? "Update Resource" : "Upload Resource"}
                </h2>
                {editData && (
                    <button
                        onClick={() => {
                            setFormData(initialFormState);
                            if (fileInputRef.current) fileInputRef.current.value = "";
                            onCancelEdit();
                        }}
                        className="text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors border border-transparent hover:border-red-100 flex items-center gap-1"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Cancel Edit
                    </button>
                )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Year */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
                        <input
                            type="text"
                            name="year"
                            value={formData.year}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            required
                        />
                    </div>

                    {/* Course */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Course</label>
                        <input
                            type="text"
                            name="course"
                            value={formData.course}
                            onChange={handleChange}
                            placeholder="e.g. B.Sc"
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            required
                        />
                    </div>

                    {/* Specialization */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Specialization</label>
                        <input
                            type="text"
                            name="specialization"
                            value={formData.specialization}
                            onChange={handleChange}
                            placeholder="e.g. Physics"
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        />
                    </div>

                    {/* Semester */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Semester</label>
                        <input
                            type="number"
                            name="semester"
                            value={formData.semester}
                            onChange={handleChange}
                            placeholder="e.g. 4"
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            required
                        />
                    </div>

                    {/* Subject Code */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Subject Code</label>
                        <input
                            type="text"
                            name="subject_code"
                            value={formData.subject_code}
                            onChange={handleChange}
                            placeholder="e.g. 21CAP01"
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        />
                    </div>

                    {/* Subject */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                        <input
                            type="text"
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            placeholder="e.g. Data Structures"
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            required
                        />
                    </div>

                    {/* Unit */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Unit</label>
                        <input
                            type="text"
                            name="unit"
                            value={formData.unit}
                            onChange={handleChange}
                            placeholder="Eg. 1"
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            required
                        />
                    </div>
                </div>

                {/* Title */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="Resource Title"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        required
                    />
                </div>

                {/* File Upload - Always visible now */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        {editData ? "Update File (Optional)" : "Upload File"}
                    </label>
                    <div className="relative">
                        <input
                            type="file"
                            id="file-upload"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            className="hidden"
                        />
                        <label
                            htmlFor="file-upload"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg cursor-pointer hover:bg-gray-200 transition-colors w-full border border-gray-200"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                            </svg>
                            <span className="truncate">
                                {formData.file ? formData.file.name : (editData ? "Choose new file to replace" : "Choose File")}
                            </span>
                        </label>
                    </div>
                    {editData && (
                        <p className="text-xs text-gray-500 mt-1">
                            Leave empty if you don't want to change the file.
                        </p>
                    )}
                </div>

                {/* Progress Bar - Only for new upload or if we implement progress for update too */}
                {loading && (
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                            style={{ width: `${progress}% ` }}
                        ></div>
                        <p className="text-xs text-gray-500 mt-1 text-right">{progress > 0 ? `${progress}% ` : "Processing..."}</p>
                    </div>
                )}

                {/* Submit Button */}
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    disabled={loading}
                >
                    {loading ? (editData ? "Updating..." : "Uploading...") : (editData ? "Update Resource" : "Upload Resource")}
                </button>
            </form>

            {/* Confirmation Modal */}
            {showConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm transition-all duration-300 p-4">
                    <div className="bg-white rounded-xl shadow-2xl p-6 max-w-sm w-full transform scale-100 transition-transform duration-200">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">{editData ? "Confirm Update" : "Confirm Upload"}</h3>
                        <p className="text-gray-600 mb-6">
                            {editData ? "Are you sure you want to update this resource?" : "Are you sure you want to upload this resource? Please verify all details."}
                        </p>
                        <div className="flex gap-4 justify-end">
                            <button
                                onClick={() => setShowConfirm(false)}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmAction}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UploadResource;
