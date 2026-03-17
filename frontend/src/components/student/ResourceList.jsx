import React from "react";
import ResourceCard from "./ResourceCard";

const ResourceList = ({ resources, bookmarkedResources, onDownload, onToggleBookmark, onView }) => {
    if (!resources || resources.length === 0) {
        return (
            <div className="text-center text-gray-400 mt-12">
                No resources found. Try adjusting your filters.
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 p-4 bg-gray-50 border-b border-gray-200 font-semibold text-gray-600 text-sm uppercase tracking-wider">
                <div className="col-span-1 text-center">S.No</div>
                <div className="col-span-3 text-center">Subject</div>
                <div className="col-span-1 text-center">Unit</div>
                <div className="col-span-5">Title</div>
                <div className="col-span-2 text-center">Action</div>
            </div>

            {/* Resource Rows */}
            <div className="divide-y divide-gray-100">
                {resources.map((resource, index) => (
                    <ResourceCard
                        key={resource.id}
                        resource={resource}
                        serialNumber={index + 1}
                        isBookmarked={bookmarkedResources?.has(resource.id)}
                        onDownload={onDownload}
                        onToggleBookmark={onToggleBookmark}
                        onView={onView}
                    />
                ))}
            </div>
        </div>
    );
};

export default ResourceList;
