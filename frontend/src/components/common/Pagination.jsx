import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    // We want the pagination UI to always be visible, even if there's 1 page or less
    const safeTotalPages = Math.max(1, totalPages);

    const getPageNumbers = () => {
        if (safeTotalPages <= 5) {
            return Array.from({ length: safeTotalPages }, (_, i) => i + 1);
        }

        if (currentPage <= 3) {
            return [1, 2, 3, 4, '...', safeTotalPages];
        }

        if (currentPage >= safeTotalPages - 2) {
            return [1, '...', safeTotalPages - 3, safeTotalPages - 2, safeTotalPages - 1, safeTotalPages];
        }

        return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', safeTotalPages];
    };

    return (
        <div className="flex justify-end mt-4 text-sm">
            <div className="flex items-center gap-1 bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-1.5 rounded-xl text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                </button>

                {getPageNumbers().map((page, idx) => (
                    page === '...' ? (
                        <span key={idx} className="px-2 text-gray-400">...</span>
                    ) : (
                        <button
                            key={idx}
                            onClick={() => onPageChange(page)}
                            className={`min-w-[32px] h-8 flex items-center justify-center rounded-xl font-medium transition-colors ${currentPage === page
                                ? 'bg-blue-600 text-white shadow-md'
                                : 'text-gray-600 hover:bg-gray-100 bg-gray-50'
                                }`}
                        >
                            {page}
                        </button>
                    )
                ))}

                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage >= safeTotalPages}
                    className="p-1.5 rounded-xl text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                </button>
            </div>
        </div>
    );
};

export default Pagination;
