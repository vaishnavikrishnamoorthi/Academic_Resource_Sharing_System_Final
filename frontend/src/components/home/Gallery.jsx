import React from "react"

function Gallery() {
  return (
    <div className="max-w-7xl mx-auto py-16 px-6">

      <h2 className="text-3xl font-bold text-green-800 text-center mb-10">
        Campus Gallery
      </h2>

      <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6">

        <div className="overflow-hidden rounded-lg shadow-md">
          <img
            src="/src/assets/Academics-1.jpg"
            alt="gallery"
            className="w-full h-64 object-cover"
          />
        </div>

        <div className="overflow-hidden rounded-lg shadow-md">
          <img
            src="/src/assets/Academics-2.jpg"
            alt="gallery"
            className="w-full h-64 object-cover"
          />
        </div>

        <div className="overflow-hidden rounded-lg shadow-md">
          <img
            src="/src/assets/Academics-3.jpg"
            alt="gallery"
            className="w-full h-64 object-cover"
          />
        </div>

        <div className="overflow-hidden rounded-lg shadow-md">
          <img
            src="/src/assets/Academics-4.jpg"
            alt="gallery"
            className="w-full h-64 object-cover"
          />
        </div>

        <div className="overflow-hidden rounded-lg shadow-md">
          <img
            src="/src/assets/Academics-1.jpg"
            alt="gallery"
            className="w-full h-64 object-cover"
          />
        </div>

        <div className="overflow-hidden rounded-lg shadow-md">
          <img
            src="/src/assets/Academics-1.jpg"
            alt="gallery"
            className="w-full h-64 object-cover"
          />
        </div>

      </div>
    </div>
  )
}

export default Gallery