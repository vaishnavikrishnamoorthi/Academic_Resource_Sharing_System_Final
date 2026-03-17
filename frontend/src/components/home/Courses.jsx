function Courses() {
  return (
    <div className="max-w-7xl mx-auto py-16 px-6">

      <h2 className="text-3xl font-bold text-green-800 mb-10 text-center">
        Popular Courses
      </h2>

      <div className="grid md:grid-cols-3 gap-8">

        <div className="group bg-white shadow p-6 rounded-xl transition duration-300 hover:-translate-y-1 hover:bg-green-45 hover:shadow-lg">
          <h3 className="text-xl font-semibold mb-2 text-black group-hover:text-green-700">
            Computer Science
          </h3>
          <p className="text-gray-600">
            Learn programming, AI and modern technologies.
          </p>
        </div>

        <div className="group bg-white shadow p-6 rounded-xl transition duration-300 hover:-translate-y-1 hover:bg-green-45 hover:shadow-lg">
          <h3 className="text-xl font-semibold mb-2 text-black group-hover:text-green-700">
            Mathematics
          </h3>
          <p className="text-gray-600">
            Advanced mathematical concepts and research.
          </p>
        </div>

        <div className="group bg-white shadow p-6 rounded-xl transition duration-300 hover:-translate-y-1 hover:bg-green-45 hover:shadow-lg">
          <h3 className="text-xl font-semibold mb-2 text-black group-hover:text-green-700">
            Commerce
          </h3>
          <p className="text-gray-600">
            Finance, accounting and business analytics.
          </p>
        </div>

      </div>
    </div>
  )
}

export default Courses