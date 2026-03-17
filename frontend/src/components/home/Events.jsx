function Events() {
  return (
    <div className="bg-gray-100 py-16">

      <h2 className="text-3xl font-bold text-green-800 text-center mb-10">
        Upcoming Events
      </h2>

      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">

        <div className="bg-white p-6 shadow rounded-xl">
          <h3 className="font-semibold">Tech Symposium</h3>
          <p className="text-gray-600 text-sm">
            March 25, 2026
          </p>
        </div>

        <div className="bg-white p-6 shadow rounded-xl">
          <h3 className="font-semibold">Workshop</h3>
          <p className="text-gray-600 text-sm">
            April 3, 2026
          </p>
        </div>

        <div className="bg-white p-6 shadow rounded-xl">
          <h3 className="font-semibold">Placement Drive</h3>
          <p className="text-gray-600 text-sm">
            April 20, 2026
          </p>
        </div>

      </div>
    </div>
  )
}

export default Events