import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"

import logo from "../../assets/logo.png"
import year from "../../assets/year.png"
import naac from "../../assets/naac.png"
import iso from "../../assets/iso.png"

function Navbar() {
    const [isHovered, setIsHovered] = useState(false)
    const [isClicked, setIsClicked] = useState(false)
    const dropdownRef = useRef(null)
    const navigate = useNavigate()

    const role = sessionStorage.getItem("role")

    const handleAcademicResources = () => {
        if (!role) {
            navigate("/login")
            return
        }

        if (role === "student") {
            navigate("/student")
        } else if (role === "faculty") {
            navigate("/faculty")
        } else if (role === "admin") {
            navigate("/admin")
        }
    }

    const logout = () => {
        sessionStorage.clear()
        window.location.href = "/"
    }

    // Handle click outside to close dropdown
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsClicked(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const isOpen = isHovered || isClicked;

    return (
        <>
            {/* HEADER SECTION (NEW) */}
            <div className="bg-gray-100 border-b">
                <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">

                    {/* Left side - Logo + College Name */}
                    <div className="flex items-center gap-4">
                        <img
                            src={logo}
                            alt="College Logo"
                            className="h-14"
                        />

                        <div>
                            <h1 className="text-xl font-bold text-green-800">
                                VCWA
                            </h1>

                            <p className="text-sm text-gray-600">
                                Autonomous | Affiliated to Bharathiar University, Coimbatore
                            </p>
                        </div>
                    </div>

                    {/* Right side - Accreditation logos */}
                    <div className="flex items-center gap-6">
                        <img src={year} alt="Year" className="h-12" />
                        <img src={naac} alt="NAAC" className="h-12" />
                        <img src={iso} alt="ISO" className="h-12" />
                    </div>

                </div>
            </div>

            <nav className="bg-green-700 text-white">
                <div className="max-w-7xl mx-auto flex justify-center items-center px-6 py-4">

                    {/* <h1 className="text-lg font-semibold cursor-pointer" onClick={() => navigate("/")}>
                        Academic Portal
                    </h1> */}

                    <ul className="flex items-center space-x-7 text-sm font-medium">

                        <li className="cursor-pointer hover:text-gray-200">
                            Home
                        </li>

                        <li className="cursor-pointer hover:text-gray-200">
                            The College
                        </li>

                        <li className="cursor-pointer hover:text-gray-200">
                            Administration
                        </li>

                        <li className="cursor-pointer hover:text-gray-200">
                            Admission
                        </li>

                        {/* Academics Dropdown */}
                        <li
                            ref={dropdownRef}
                            className="relative"
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}
                        >
                            <span
                                className="cursor-pointer hover:text-gray-200 flex items-center gap-1 py-2"
                                onClick={() => setIsClicked(!isClicked)}
                            >
                                Academics
                                <svg
                                    className={`w-4 h-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                </svg>
                            </span>

                            {isOpen && (
                                <div className="absolute top-full left-0 bg-white text-gray-800 w-64 shadow-2xl rounded-b-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-50 py-2 border border-gray-100">
                                    {[
                                        "Department",
                                        "Programme",
                                        "Faculty",
                                        "PO, PSO & CO",
                                        "Self Learning Courses",
                                        "Additional Courses",
                                        "Co-Curricular",
                                        "Extra Curricular"
                                    ].map((item) => (
                                        <div
                                            key={item}
                                            className="px-4 py-2.5 hover:bg-green-50 hover:text-green-700 cursor-pointer text-sm font-medium transition-colors"
                                        >
                                            {item}
                                        </div>
                                    ))}

                                    <div
                                        className="px-4 py-2.5 hover:bg-green-50 hover:text-green-700 cursor-pointer text-sm font-medium transition-colors"
                                        onClick={handleAcademicResources}
                                    >
                                        Academic Resources
                                    </div>
                                </div>
                            )}
                        </li>

                        <li className="cursor-pointer hover:text-gray-200">
                            Research
                        </li>

                        <li className="cursor-pointer hover:text-gray-200">
                            Examination
                        </li>

                        <li className="cursor-pointer hover:text-gray-200">
                            Infrastructure
                        </li>

                        <li className="cursor-pointer hover:text-gray-200">
                            Placement
                        </li>

                        <li className="cursor-pointer hover:text-gray-200">
                            Contact Us
                        </li>

                        {/* Login and Signup buttons */}
                        <div className="pl-10 flex items-center gap-3">
                            {!role ? (
                                <div className="flex items-center gap-3">
                                    <li
                                        onClick={() => navigate("/login")}
                                        className="hover:text-gray-200 cursor-pointer"
                                    >
                                        Login
                                    </li>
                                    <li
                                        onClick={() => navigate("/signup")}
                                        className="bg-white text-green-700 px-4 py-1.5 rounded-lg border border-white hover:bg-transparent hover:text-white transition-all cursor-pointer font-bold shadow-sm"
                                    >
                                        Sign Up
                                    </li>
                                </div>
                            ) : (
                                <div className="flex items-center gap-4">
                                    {(() => {
                                        const userStr = sessionStorage.getItem("user");
                                        if (userStr) {
                                            try {
                                                const user = JSON.parse(userStr);
                                                const initial = user.name?.charAt(0).toUpperCase() || "U";
                                                return (
                                                    <div
                                                        onClick={() => navigate("/profile")}
                                                        className="w-9 h-9 bg-white text-green-700 rounded-full flex items-center justify-center font-bold cursor-pointer hover:bg-green-100 transition-colors shadow-sm"
                                                        title="View Profile"
                                                    >
                                                        {initial}
                                                    </div>
                                                );
                                            } catch (e) {
                                                return null;
                                            }
                                        }
                                        return null;
                                    })()}
                                    <li
                                        onClick={logout}
                                        className="bg-red-500 px-4 py-1.5 rounded-lg cursor-pointer hover:bg-red-600 transition-colors text-sm font-semibold"
                                    >
                                        Logout
                                    </li>
                                </div>
                            )}
                        </div>
                    </ul>
                </div>
            </nav>
        </>
    )
}

export default Navbar