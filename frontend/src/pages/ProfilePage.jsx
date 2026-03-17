import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import Navbar from "../components/home/Navbar";

const ProfilePage = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

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
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="flex justify-center my-32">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
                </div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="max-w-4xl mx-auto my-16 p-8 bg-white rounded-2xl shadow-sm text-center">
                    <h2 className="text-2xl font-bold text-red-600 mb-4">Profile Unavailable</h2>
                    <p className="text-gray-600 mb-8">We couldn't load your profile information. Please try logging in again.</p>
                    <button
                        onClick={() => navigate("/")}
                        className="bg-green-700 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-800 transition-colors"
                    >
                        Go to Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-16">
            <Navbar />

            <div className="max-w-5xl mx-auto px-6 mt-10">
                {/* Back Button Area */}
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 bg-white rounded-full shadow-sm hover:shadow-md transition-all text-gray-600 hover:text-green-700 border border-gray-100"
                        title="Go Back"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                    </button>
                    <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Profile Page</h1>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left Panel - Avatar & Identity */}
                    <div className="lg:w-80 shrink-0">
                        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 text-center sticky top-24">
                            <div className="w-32 h-32 bg-gradient-to-br from-green-600 to-green-700 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-green-100 ring-4 ring-white">
                                <span className="text-5xl font-bold text-white">
                                    {profile.name?.charAt(0).toUpperCase()}
                                </span>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-1">{profile.name}</h3>
                            <p className="text-gray-500 font-medium mb-6">{profile.email}</p>

                            <div className="flex flex-wrap justify-center gap-2">
                                <span className="inline-block bg-green-50 text-green-700 text-xs font-bold px-4 py-2 rounded-full uppercase tracking-widest border border-green-100">
                                    {profile.role}
                                </span>
                            </div>

                            <div className="mt-8 pt-8 border-t border-gray-50 text-left">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Account Stats</p>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-500">Member Since</span>
                                        <span className="text-gray-900 font-semibold">{formatDate(profile.created_at)}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-500">Status</span>
                                        <span className="flex items-center gap-1.5 text-green-600 font-bold">
                                            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                            Active
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Panel - User Details */}
                    <div className="flex-1 space-y-6">
                        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="px-8 py-6 bg-gray-50/50 border-b border-gray-100 flex items-center gap-3">
                                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                <h4 className="font-bold text-gray-800">Personal Information</h4>
                            </div>

                            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                                <DetailItem label="Full Name" value={profile.name} />
                                <DetailItem label="Email Address" value={profile.email} isEmail />
                                <DetailItem label="Roll Number" value={profile.roll_number} />
                                <DetailItem label="Specialization" value={profile.specialization} />

                                {profile.role === "student" && (
                                    <>
                                        <DetailItem label="Year" value={profile.year} />
                                        <DetailItem label="Course" value={profile.course} />
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Additional Info / Settings Hint */}
                        <div className="bg-green-700 rounded-3xl p-8 text-white shadow-lg shadow-green-100 flex items-center justify-between">
                            <div>
                                <h4 className="text-xl font-bold mb-1">Academic Resource Portal</h4>
                                <p className="text-green-100 text-sm">You are currently logged in as {profile.role}.</p>
                            </div>
                            <svg className="w-12 h-12 text-green-500/30" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const DetailItem = ({ label, value, isEmail }) => (
    <div className="group">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 transition-colors group-hover:text-green-600">{label}</p>
        <p className={`text-gray-800 font-bold text-lg ${isEmail ? "break-all" : ""}`}>
            {value || <span className="text-gray-300 italic font-normal">Not Provided</span>}
        </p>
    </div>
);

export default ProfilePage;
