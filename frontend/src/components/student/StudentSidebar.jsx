import React, { useState } from "react";

const StudentSidebar = ({ activeTab, setActiveTab }) => {
    const [isHovered, setIsHovered] = useState(false);

    const menuItems = [
        {
            id: "resources",
            label: "Resources",
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
            ),
        },
        {
            id: "saved",
            label: "Saved",
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
            ),
        },
        {
            id: "news",
            label: "News",
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
            ),
        },
    ];

    return (
        <div
            className={`fixed left-0 top-0 h-full bg-white shadow-xl z-50 transition-all duration-300 ease-in-out flex flex-col ${isHovered ? "w-64" : "w-20"
                }`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Logo Area */}
            <div className="h-23 flex items-center justify-center border-b border-gray-100">
                <div className={`font-bold text-blue-600 text-xl transition-opacity duration-200 ${isHovered ? "opacity-100" : "opacity-0 hidden"}`}>
                    Student Portal
                </div>
                <div className={`${isHovered ? "hidden" : "block"}`}>
                    <span className="text-2xl font-bold text-blue-600">SP</span>
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
        </div>
    );
};

export default StudentSidebar;
