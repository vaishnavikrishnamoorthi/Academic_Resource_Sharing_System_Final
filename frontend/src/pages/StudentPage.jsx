import React, { useEffect, useState } from "react";
import StudentSidebar from "../components/student/StudentSidebar";
import StudentResources from "../components/student/StudentResources";
import StudentSaved from "../components/student/StudentSaved";
import StudentNews from "../components/student/StudentNews";
import StudentProfile from "../components/student/StudentProfile";
import { useNavigate } from "react-router-dom";
import { useToast } from "../context/ToastContext";
import {
  downloadResource,
  addBookmark,
  removeBookmark,
  getMyBookmarks,
} from "../services/resourceService";
import logo from "../assets/logo.png";

const StudentPage = () => {
  const [activeTab, setActiveTab] = useState("resources");
  const [bookmarkedResources, setBookmarkedResources] = useState(new Set()); // Set of IDs
  const navigate = useNavigate();
  const { showToast } = useToast();
  const user = JSON.parse(sessionStorage.getItem("user"));

  // 🔹 Check auth and fetch bookmarks on load
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    // Fetch bookmarks
    getMyBookmarks()
      .then((res) => {
        const ids = new Set(res.data.map((b) => b.id));
        setBookmarkedResources(ids);
      })
      .catch((err) => console.log("Error fetching bookmarks", err));
  }, []);



  const handleDownload = async (resourceId, filename) => {
    try {
      const response = await downloadResource(resourceId);

      // Create a blob link to download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;

      // Extract filename from path or use default
      const name = filename.split(/[/\\]/).pop(); // Handle forward or backslashes
      link.setAttribute('download', name);

      document.body.appendChild(link);
      link.click();

      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download failed:", err);
      showToast("Failed to download resource", "error");
    }
  };

  const handleBookmark = async (resource) => {
    const isBookmarked = bookmarkedResources.has(resource.id);

    // Optimistic Update
    const newSet = new Set(bookmarkedResources);
    if (isBookmarked) {
      newSet.delete(resource.id);
    } else {
      newSet.add(resource.id);
    }
    setBookmarkedResources(newSet);

    try {
      if (isBookmarked) {
        await removeBookmark(resource.id);
      } else {
        await addBookmark(resource.id);
      }
    } catch (err) {
      console.error("Bookmark action failed:", err);
      if (err.response) {
        console.error("Server response:", err.response.data);
        showToast(`Failed to update bookmark: ${err.response.data.error || err.message}`, "error");
      } else {
        showToast("Failed to update bookmark: " + err.message, "error");
      }

      // Revert on failure
      const revertSet = new Set(bookmarkedResources);
      if (isBookmarked) {
        revertSet.add(resource.id);
      } else {
        revertSet.delete(resource.id);
      }
      setBookmarkedResources(revertSet);
      showToast("Failed to update bookmark", "error");
    }
  };

  const handleView = (fileUrl) => {
    if (!fileUrl) return;
    // Ensure URL has forward slashes
    const normalizedUrl = fileUrl.replace(/\\/g, "/");
    window.open(`http://localhost:5000/${normalizedUrl}`, "_blank");
  };

  const handleLogout = () => {
    sessionStorage.clear();
    window.location.href = "/";
  };


  return (
    <div className="min-h-screen bg-gray-50 flex font-sans">

      {/* Sidebar */}
      <StudentSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <div className="flex-1 ml-20 transition-all duration-300"> {/* ml-20 matches collapsed sidebar width */}

        {/* Header (Within Main Content) */}
        <header className="flex flex-col md:flex-row justify-between items-center py-6 px-8 bg-white border-b border-gray-100 shadow-sm sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <img src={logo} alt="Logo" className="h-10 w-10 object-contain" />
            <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
              Vellalar College for Women
            </h1>
          </div>

          <div className="flex items-center gap-6">
            {user && (
              <span
                onClick={() => setActiveTab("profile")}
                className="text-gray-600 font-medium bg-gray-100 px-4 py-2 rounded-full cursor-pointer hover:bg-blue-50 hover:text-blue-600 transition-colors"
              >
                Hello, {user.name}
              </span>
            )}
            <button
              onClick={handleLogout}
              className="bg-red-50 text-red-600 hover:bg-red-100 px-5 py-2 rounded-lg font-medium transition-colors duration-200 border border-red-200"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Content Body */}
        <div className="p-8">
          {/* Resources — always mounted, hidden via CSS to preserve filter state */}
          <div style={{ display: activeTab === "resources" ? "block" : "none" }}>
            <StudentResources
              bookmarkedResources={bookmarkedResources}
              onDownload={handleDownload}
              onToggleBookmark={handleBookmark}
              onView={handleView}
            />
          </div>

          {activeTab === "saved" && (
            <StudentSaved
              bookmarkedResources={bookmarkedResources}
              onDownload={handleDownload}
              onToggleBookmark={handleBookmark}
              onView={handleView}
            />
          )}

          {activeTab === "news" && (
            <StudentNews />
          )}

          {activeTab === "profile" && (
            <StudentProfile />
          )}
        </div>

      </div>
    </div>
  );
};

export default StudentPage;
