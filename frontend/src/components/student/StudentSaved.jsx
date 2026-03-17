import React, { useEffect, useState } from "react";
import ResourceList from "./ResourceList";
import { getMyBookmarks } from "../../services/resourceService";

const StudentSaved = ({ bookmarkedResources, onDownload, onToggleBookmark, onView }) => {
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch user's bookmarks (full objects)
        getMyBookmarks()
            .then((res) => {
                setResources(res.data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching bookmarks:", err);
                setLoading(false);
            });
    }, [bookmarkedResources]); // Re-fetch or update if bookmarks change (optional, but good for sync)

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Saved Resources</h2>

            {loading && (
                <div className="flex justify-center my-10">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                </div>
            )}

            {!loading && resources.length === 0 && (
                <div className="text-center text-gray-400 mt-12 py-12 bg-white rounded-2xl border border-gray-100">
                    <p>You haven't saved any resources yet.</p>
                </div>
            )}

            {!loading && resources.length > 0 && (
                <ResourceList
                    resources={resources}
                    bookmarkedResources={bookmarkedResources}
                    onDownload={onDownload}
                    onToggleBookmark={onToggleBookmark}
                    onView={onView}
                />
            )}
        </div>
    );
};

export default StudentSaved;
