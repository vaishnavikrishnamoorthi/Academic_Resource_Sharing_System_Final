import React, { useState } from "react";

const AdminSidebar = ({ activeTab, setActiveTab, onLogout }) => {
    const [isHovered, setIsHovered] = useState(false);

    const menuItems = [
        {
            id: "academic",
            label: "Academic",
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
            ),
        },
        {
            id: "upload",
            label: "Upload",
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
            ),
        },
        {
            id: "my-uploads",
            label: "My Uploads",
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z" />
                </svg>
            ),
        },
        {
            id: "users",
            label: "Users",
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
            ),
        },
    ];

    return (
        <div
            className={`fixed left-0 top-0 h-full bg-white shadow-xl z-50 transition-all duration-300 ease-in-out flex flex-col ${isHovered ? "w-64" : "w-20"}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Logo Area */}
            <div className="h-20 flex items-center justify-center border-b border-gray-100">
                <div className={`font-bold text-blue-600 text-xl transition-opacity duration-200 ${isHovered ? "opacity-100" : "opacity-0 hidden"}`}>
                    Admin Portal
                </div>
                <div className={`${isHovered ? "hidden" : "block"}`}>
                    <span className="text-2xl font-bold text-blue-600">AP</span>
                </div>
            </div>

            {/* Menu Items */}
            <div className="flex-1 py-6 flex flex-col gap-2">
                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`flex items-center px-6 py-4 transition-colors duration-200 relative ${activeTab === item.id
                            ? "text-blue-600 bg-blue-50 border-r-4 border-blue-600"
                            : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                            }`}
                    >
                        <div className="min-w-[24px]">{item.icon}</div>
                        <span
                            className={`ml-4 font-medium whitespace-nowrap transition-all duration-300 ${isHovered ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4 overflow-hidden w-0"
                                }`}
                        >
                            {item.label}
                        </span>
                    </button>
                ))}
            </div>

            {/* Logout Button */}
            <div className="border-t border-gray-100 py-4">
                <button
                    onClick={onLogout}
                    className="w-full flex items-center px-6 py-4 text-red-500 hover:bg-red-50 hover:text-red-700 transition-colors duration-200"
                >
                    <div className="min-w-[24px]">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                    </div>
                    <span
                        className={`ml-4 font-medium whitespace-nowrap transition-all duration-300 ${isHovered ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4 overflow-hidden w-0"
                            }`}
                    >
                        Logout
                    </span>
                </button>
            </div>
        </div>
    );
};

export default AdminSidebar;
