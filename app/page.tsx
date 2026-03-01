import nextDynamic from "next/dynamic"
import Hero from "@/components/hero"
import About from "@/components/about"

const Projects = nextDynamic(() => import("@/components/projects"))
const Technologies = nextDynamic(() => import("@/components/technologies"))
const Education = nextDynamic(() => import("@/components/education"))
const Contact = nextDynamic(() => import("@/components/contact"))

export const dynamic = "force-static"
export const revalidate = false

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
