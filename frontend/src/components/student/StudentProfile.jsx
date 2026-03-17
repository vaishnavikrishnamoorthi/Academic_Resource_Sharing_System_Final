import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";

const StudentProfile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axiosInstance
            .get("/auth/profile")
            .then((res) => {
                setProfile(res.data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching profile:", err);
                setLoading(false);
            });
    }, []);

    const formatDate = (dateStr) => {
        if (!dateStr) return "—";
        const d = new Date(dateStr);
        return d.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "long",
            year: "numeric",
        });
    };

    if (loading) {
        return (
            <div className="flex justify-center my-16">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="text-center text-red-500 my-16">
                Failed to load profile.
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-8">My Profile</h2>

            <div className="flex flex-col md:flex-row gap-8">

                {/* Left — Avatar Card */}
                <div className="md:w-72 shrink-0">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
                        <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-5 shadow-lg shadow-blue-200">
                            <span className="text-4xl font-bold text-white">
                                {profile.name?.charAt(0).toUpperCase()}
                            </span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-800">{profile.name}</h3>
                        <p className="text-gray-500 text-sm mt-1">{profile.email}</p>
                        <div className="mt-4">
                            <span className="inline-block bg-blue-50 text-blue-600 text-xs font-semibold px-4 py-1.5 rounded-full uppercase tracking-wider">
                                {profile.role}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Right — Detail Cards Grid */}
                <div className="flex-1">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

                        {/* Name */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Full Name</p>
                            <p className="text-gray-800 font-semibold text-lg">{profile.name || "—"}</p>
                        </div>

                        {/* Roll Number */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Roll Number</p>
                            <p className="text-gray-800 font-semibold text-lg">{profile.roll_number || "—"}</p>
                        </div>

                        {/* Email */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Email Address</p>
                            <p className="text-gray-800 font-semibold text-lg break-all">{profile.email || "—"}</p>
                        </div>

                        {/* Year */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Year</p>
                            <p className="text-gray-800 font-semibold text-lg">{profile.year || "—"}</p>
                        </div>

                        {/* Course */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Course</p>
                            <p className="text-gray-800 font-semibold text-lg">{profile.course || "—"}</p>
                        </div>

                        {/* Specialization */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Specialization</p>
                            <p className="text-gray-800 font-semibold text-lg">{profile.specialization || "—"}</p>
                        </div>

                        {/* Role */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Role</p>
                            <p className="text-gray-800 font-semibold text-lg capitalize">{profile.role || "—"}</p>
                        </div>

                        {/* Joined */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Joined On</p>
                            <p className="text-gray-800 font-semibold text-lg">{formatDate(profile.created_at)}</p>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
};

export default StudentProfile;
