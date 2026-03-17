import React, { useState } from "react";

const FacultySidebar = ({ activeTab, setActiveTab }) => {
    const [isHovered, setIsHovered] = useState(false);

    const menuItems = [
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
    ];

    const handleLogout = () => {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("role");
        sessionStorage.removeItem("user");
        window.location.href = "/";
    };

    return (
        <div
            className={`fixed left-0 top-0 h-full bg-white shadow-xl z-50 transition-all duration-300 ease-in-out flex flex-col ${isHovered ? "w-64" : "w-20"
                }`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Logo Area */}
            <div className="h-20 flex items-center justify-center border-b border-gray-100">
                <div className={`font-bold text-blue-600 text-xl transition-opacity duration-200 ${isHovered ? "opacity-100" : "opacity-0 hidden"}`}>
                    Faculty Portal
                </div>
                <div className={`${isHovered ? "hidden" : "block"}`}>
                    <span className="text-2xl font-bold text-blue-600">FP</span>
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
                    onClick={handleLogout}
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

export default FacultySidebar;
