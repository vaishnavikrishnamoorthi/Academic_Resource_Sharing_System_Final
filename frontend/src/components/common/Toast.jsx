// Reusable Toast Notification Component
// Shows in top-right corner, auto-dismisses after a set duration

import React, { useEffect } from "react";

const Toast = ({ message, type = "success", onClose, duration = 20000 }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, duration);
        return () => clearTimeout(timer);
    }, [onClose, duration]);

    const isSuccess = type === "success";

    return (
        <div className="fixed top-6 right-6 z-[100] animate-slide-in-right max-w-sm w-full">
            <div
                className={`flex items-start gap-3 px-5 py-4 rounded-xl shadow-2xl border ${isSuccess
                        ? "bg-green-50 border-green-200 text-green-800"
                        : "bg-red-50 border-red-200 text-red-800"
                    }`}
            >
                {/* Icon */}
                <div className="shrink-0 mt-0.5">
                    {isSuccess ? (
                        <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    ) : (
                        <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    )}
                </div>

                {/* Message */}
                <p className="text-sm font-medium flex-1">{message}</p>

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className={`shrink-0 p-1 rounded-lg transition-colors ${isSuccess ? "hover:bg-green-100" : "hover:bg-red-100"
                        }`}
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <style>{`
                @keyframes slideInRight {
                    from { transform: translateX(120%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                .animate-slide-in-right {
                    animation: slideInRight 0.3s ease-out;
                }
            `}</style>
        </div>
    );
};

export default Toast;
