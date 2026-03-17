import Navbar from "../components/home/Navbar"
import Hero from "../components/home/Hero"
import AnnouncementBar from "../components/home/AnnouncementBar"
import Courses from "../components/home/Courses"
import Events from "../components/home/Events"
import Gallery from "../components/home/Gallery"
import Milestones from "../components/home/Milestones"
import Footer from "../components/home/Footer"

function HomePage() {
  return (
    <>
      <Navbar />
      <Hero />
      <AnnouncementBar />
      <Courses />
      <Events />
      <Gallery />
      <Milestones />
      <Footer />
    </>
  )
}

export default HomePage