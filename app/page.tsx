import Hero from "@/components/hero"
import About from "@/components/about"
import Projects from "@/components/projects"
import Technologies from "@/components/technologies"
import Education from "@/components/education"
import Contact from "@/components/contact"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center">
      <Hero />
      <About />
      <Projects />
      <Technologies />
      <Education />
      <Contact />
    </main>
  )
}
