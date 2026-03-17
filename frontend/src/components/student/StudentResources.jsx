import React, { useEffect, useState } from "react";
import { useToast } from "../../context/ToastContext";
import Dropdown from "../../components/common/Dropdown";
import ResourceList from "./ResourceList";
import {
    getCourses,
    getSpecializations,
    getSemesters,
    getSubjects,
    getFilteredResources,
} from "../../services/resourceService";

const StudentResources = ({ bookmarkedResources, onDownload, onToggleBookmark, onView }) => {
    const { showToast } = useToast();
    const [courses, setCourses] = useState([]);
    const [specializations, setSpecializations] = useState([]);
    const [semesters, setSemesters] = useState([]);
    const [subjects, setSubjects] = useState([]);

    const [course, setCourse] = useState("");
    const [specialization, setSpecialization] = useState("");
    const [semester, setSemester] = useState("");
    const [subject, setSubject] = useState("");

    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(false);

    // 🔹 Fetch courses on load
    useEffect(() => {
        getCourses()
            .then((res) => setCourses(res.data))
            .catch((err) => {
                console.error("Error fetching courses", err);
                showToast("Failed to fetch courses", "error");
            });
    }, []);

    // 🔹 Fetch specializations when course changes
    useEffect(() => {
        if (course) {
            getSpecializations(course)
                .then((res) => {
                    setSpecializations(res.data);
                    setSpecialization("");
                    setSemesters([]);
                    setSemester("");
                    setSubjects([]);
                    setSubject("");
                })
                .catch((err) => console.log(err));
        }
    }, [course]);

    // 🔹 Fetch semesters when specialization changes
    useEffect(() => {
        if (course) {
            getSemesters(course, specialization || undefined)
                .then((res) => {
                    setSemesters(res.data);
                    setSemester("");
                    setSubjects([]);
                    setSubject("");
                })
                .catch((err) => console.log(err));
        }
    }, [specialization]);

    // 🔹 Fetch subjects when semester changes
    useEffect(() => {
        if (course && semester) {
            getSubjects(course, semester)
                .then((res) => {
                    setSubjects(res.data);
                    setSubject("");
                })
                .catch((err) => console.log(err));
        }
    }, [semester]);

    const handleSearch = async () => {
        if (!course || !semester || !subject) {
            showToast("Please select all fields", "error");
            return;
        }

        setLoading(true);

        try {
            const res = await getFilteredResources(
                course,
                semester,
                subject
            );
            setResources(res.data);
        } catch (err) {
            console.log(err);
        }

        setLoading(false);
    };

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Academic Resources</h2>

            {/* Filter Section */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 mb-10">
                <div className="grid md:grid-cols-5 gap-6">

                    {/* Course */}
                    <div className="w-full">
                        <Dropdown
                            options={courses}
                            value={course}
                            onChange={(val) => setCourse(val)}
                            placeholder="Select Course"
                            label="course"
                        />
                    </div>

                    {/* Specialization */}
                    <div className="w-full">
                        <Dropdown
                            options={specializations}
                            value={specialization}
                            onChange={(val) => setSpecialization(val)}
                            placeholder="Select Specialization"
                            label="specialization"
                            disabled={!course}
                        />
                    </div>

                    {/* Semester */}
                    <div className="w-full">
                        <Dropdown
                            options={semesters}
                            value={semester}
                            onChange={(val) => setSemester(val)}
                            placeholder="Select Semester"
                            label="semester"
                            disabled={!course}
                        />
                    </div>

                    {/* Subject */}
                    <div className="w-full">
                        <Dropdown
                            options={subjects}
                            value={subject}
                            onChange={(val) => setSubject(val)}
                            placeholder="Select Subject"
                            label="subject"
                            disabled={!semester}
                        />
                    </div>

                    <button
                        onClick={handleSearch}
                        className="bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors duration-200 shadow-lg shadow-blue-200"
                    >
                        Search Resources
                    </button>

                </div>
            </div>

            {/* Results */}
            {loading && (
                <div className="flex justify-center my-10">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                </div>
            )}

            {!loading && (
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

export default StudentResources;
