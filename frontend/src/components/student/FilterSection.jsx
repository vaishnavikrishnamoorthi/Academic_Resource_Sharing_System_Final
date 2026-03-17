import React from "react";

const FilterSection = ({
  course,
  setCourse,
  semester,
  setSemester,
  subject,
  setSubject,
  subjects,
  handleSearch,
}) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md mb-8">
      <div className="grid md:grid-cols-4 gap-4">

        <select
          className="border p-2 rounded-lg"
          value={course}
          onChange={(e) => setCourse(e.target.value)}
        >
          <option value="">Course</option>
          <option value="CSE">CSE</option>
          <option value="ECE">ECE</option>
          <option value="IT">IT</option>
        </select>

        <select
          className="border p-2 rounded-lg"
          value={semester}
          onChange={(e) => setSemester(e.target.value)}
        >
          <option value="">Semester</option>
          {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
            <option key={sem} value={sem}>{sem}</option>
          ))}
        </select>

        <select
          className="border p-2 rounded-lg"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        >
          <option value="">Subject</option>

          {subjects.map((sub, index) => {
            const value =
              typeof sub === "string" ? sub : sub.subject;

            return (
              <option key={index} value={value}>
                {value}
              </option>
            );
          })}
        </select>

        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Search
        </button>

      </div>
    </div>
  );
};

export default FilterSection;
