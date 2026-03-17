import { useState, useEffect } from "react"

import img1 from "../../assets/Academics-1.jpg"
import img2 from "../../assets/Academics-2.jpg"
import img3 from "../../assets/Academics-3.jpg"

function Hero() {

  const images = [img1, img2, img3]

  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [images.length])

  return (
    <>
      <style>{`
        @keyframes progress {
          from { width: 0%; }
          to { width: 100%; }
        }
        .animate-progress {
          animation: progress 4000ms linear forwards;
        }
      `}</style>

      <div className="relative h-[500px] w-full overflow-hidden">

        {/* Background Image */}
        <div
          className="absolute inset-0 transition-all duration-1000"
          style={{
            backgroundImage: `url(${images[currentIndex]})`,
            backgroundSize: "cover",
            backgroundPosition: "center"
          }}
        />

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/50"></div>

        {/* Hero Text */}
        <div className="relative z-10 h-full flex items-center justify-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white text-center">
            Welcome to VCWA
          </h1>
        </div>

        {/* Carousel Indicators */}
        <div className="absolute bottom-6 w-full flex justify-center gap-2 z-20">

          {images.map((_, index) => (
            <div
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`relative overflow-hidden rounded-full cursor-pointer ${
                currentIndex === index
                  ? "w-10 h-[4px] bg-white/30"
                  : "w-[6px] h-[6px] bg-white/60"
              }`}
            >

              {currentIndex === index && (
                <div
                  key={currentIndex}
                  className="absolute left-0 top-0 h-full bg-green-500 animate-progress"
                />
              )}

            </div>
          ))}

        </div>

      </div>
    </>
  )
}

export default Hero
