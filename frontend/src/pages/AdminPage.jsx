import React, { useState } from "react";
import AdminSidebar from "../components/admin/AdminSidebar";
import AdminResources from "../components/admin/AdminResources";
import UploadResource from "../components/faculty/UploadResource";
import UploadNews from "../components/faculty/UploadNews";
import MyUploads from "../components/faculty/MyUploads";
import AdminNews from "../components/admin/AdminNews";
import AdminUsers from "../components/admin/AdminUsers";
import { useToast } from "../context/ToastContext";
import logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState("academic");
  const [uploadSubTab, setUploadSubTab] = useState("resource");
  const [academicSubTab, setAcademicSubTab] = useState("resources");
  const [resourceToEdit, setResourceToEdit] = useState(null);
  const { showToast } = useToast();

  const handleEdit = (resource) => {
    setResourceToEdit(resource);
    setActiveTab("upload");
    setUploadSubTab("resource");
  };

  const handleCancelEdit = () => {
    setResourceToEdit(null);
    setActiveTab("my-uploads");
  };

  const handleSuccess = () => {
    setResourceToEdit(null);
  };

  const navigate = useNavigate();
  const user = JSON.parse(sessionStorage.getItem("user"));

  const handleLogout = () => {
    sessionStorage.clear();
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 flex">
      {/* Sidebar */}
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} />

      {/* Main Content Area */}
      <div className="flex-1 ml-20 transition-all duration-300">

        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-center py-6 px-8 bg-white border-b border-gray-100 shadow-sm sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <img src={logo} alt="Logo" className="h-10 w-10 object-contain" />
            <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
              Vellalar College for Women
            </h1>
          </div>
          <div className="flex items-center gap-6">
            {user && (
              <span className="text-gray-600 font-medium bg-gray-100 px-4 py-2 rounded-full">
                Hello, {user.name}
              </span>
            )}
          </div>
        </header>

        {/* Content Body */}
        <div className="container mx-auto px-4 py-8">

          {/* Academic Tab */}
          {activeTab === "academic" && (
            <div className="w-[95%] mx-auto">
              {/* Sub-tabs for Resources / News */}
              <div className="flex mb-6">
                <div className="bg-white p-1 rounded-xl shadow-sm border border-gray-100 inline-flex">
                  <button
                    onClick={() => setAcademicSubTab("resources")}
                    className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${academicSubTab === "resources"
                      ? "bg-blue-600 text-white shadow-md"
                      : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
                      }`}
                  >
                    Resources
                  </button>
                  <button
                    onClick={() => setAcademicSubTab("news")}
                    className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${academicSubTab === "news"
                      ? "bg-blue-600 text-white shadow-md"
                      : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
                      }`}
                  >
                    News
                  </button>
                </div>
              </div>

              {/* Content based on sub-tab */}
              <div className="transition-opacity duration-300">
                {academicSubTab === "resources" ? (
                  <AdminResources />
                ) : (
                  <AdminNews />
                )}
              </div>
            </div>
          )}

          {/* Upload Tab */}
          {activeTab === "upload" && (
            <div className="max-w-4xl mx-auto">
              {/* Sub-tabs for Resource/News */}
              <div className="flex justify-center mb-8">
                <div className="bg-white p-1 rounded-xl shadow-sm border border-gray-100 inline-flex">
                  <button
                    onClick={() => setUploadSubTab("resource")}
                    className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${uploadSubTab === "resource"
                      ? "bg-blue-600 text-white shadow-md"
                      : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
                      }`}
                  >
                    Upload Resource
                  </button>
                  <button
                    onClick={() => setUploadSubTab("news")}
                    className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${uploadSubTab === "news"
                      ? "bg-blue-600 text-white shadow-md"
                      : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
                      }`}
                  >
                    Upload News
                  </button>
                </div>
              </div>

              <div className="transition-opacity duration-300">
                {uploadSubTab === "resource" ? (
                  <UploadResource
                    editData={resourceToEdit}
                    onCancelEdit={handleCancelEdit}
                    onSuccess={handleSuccess}
                  />
                ) : (
                  <UploadNews />
                )}
              </div>
            </div>
          )}

          {/* My Uploads Tab */}
          {activeTab === "my-uploads" && (
            <div className="w-[95%] mx-auto">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">My Uploads</h2>
              <MyUploads onEdit={handleEdit} />
            </div>
          )}

          {/* Users Tab */}
          {activeTab === "users" && (
            <div className="w-[95%] mx-auto">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Users</h2>
              <AdminUsers />
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default AdminPage;
