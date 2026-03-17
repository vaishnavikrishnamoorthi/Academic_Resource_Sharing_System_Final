import React from "react";

const ResourceCard = ({ resource, serialNumber, isBookmarked, onDownload, onToggleBookmark, onView }) => {
    return (
        <div
            onClick={() => onView(resource.file_url)}
            className="grid grid-cols-12 gap-4 p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors duration-150 items-center last:border-b-0 cursor-pointer group"
        >
            {/* S.No Column */}
            <div className="col-span-1 text-gray-500 font-medium text-center">
                {serialNumber}
            </div>

            {/* Subject Column */}
            <div className="col-span-3 text-gray-600 font-medium text-center" title={resource.subject}>
                {resource.subject}
            </div>

            {/* Unit Column */}
            <div className="col-span-1 text-gray-600 font-medium text-center">
                {resource.unit}
            </div>

            {/* Title Column */}
            <div className="col-span-5 text-gray-800 font-medium truncate group-hover:text-blue-600 transition-colors" title={resource.title}>
                {resource.title}
            </div>

            {/* Action Column */}
            <div className="col-span-2 flex justify-center gap-3">
                {/* View Action (Eye) */}
                <button
                    onClick={(e) => { e.stopPropagation(); onView(resource.file_url); }}
                    className="p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 rounded-lg transition-colors tooltip"
                    title="View"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                </button>

                {/* Download Action */}
                <button
                    onClick={(e) => { e.stopPropagation(); onDownload(resource.id, resource.file_url); }}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors tooltip"
                    title="Download"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                </button>

                {/* Bookmark Action */}
                <button
                    onClick={(e) => { e.stopPropagation(); onToggleBookmark(resource); }}
                    className={`p-2 rounded-lg transition-colors tooltip ${isBookmarked
                        ? "text-yellow-500 hover:bg-yellow-50"
                        : "text-gray-400 hover:text-yellow-500 hover:bg-yellow-50"
                        }`}
                    title={isBookmarked ? "Remove Bookmark" : "Bookmark"}
                >
                    <svg
                        className="w-5 h-5"
                        fill={isBookmarked ? "currentColor" : "none"}
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default ResourceCard;
