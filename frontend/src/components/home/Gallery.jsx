import React from "react"

import img1 from "../../assets/Academics-1.jpg"
import img2 from "../../assets/Academics-2.jpg"
import img3 from "../../assets/Academics-3.jpg"
import img4 from "../../assets/Academics-4.jpg"

function Gallery() {
  return (
    <div className="max-w-7xl mx-auto py-16 px-6">

      <h2 className="text-3xl font-bold text-green-800 text-center mb-10">
        Campus Gallery
      </h2>

      <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6">

        <div className="overflow-hidden rounded-lg shadow-md">
          <img
            src={img1}
            alt="gallery"
            className="w-full h-64 object-cover"
          />
        </div>

        <div className="overflow-hidden rounded-lg shadow-md">
          <img
            src={img2}
            alt="gallery"
            className="w-full h-64 object-cover"
          />
        </div>

        <div className="overflow-hidden rounded-lg shadow-md">
          <img
            src={img3}
            alt="gallery"
            className="w-full h-64 object-cover"
          />
        </div>

        <div className="overflow-hidden rounded-lg shadow-md">
          <img
            src={img4}
            alt="gallery"
            className="w-full h-64 object-cover"
          />
        </div>

        <div className="overflow-hidden rounded-lg shadow-md">
          <img
            src={img1}
            alt="gallery"
            className="w-full h-64 object-cover"
          />
        </div>

        <div className="overflow-hidden rounded-lg shadow-md">
          <img
            src={img1}
            alt="gallery"
            className="w-full h-64 object-cover"
          />
        </div>

      </div>
    </div>
  )
}

export default Gallery