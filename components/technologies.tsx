"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Code, Database, Server, GitBranch, Figma, CloudCog, Shield, FileCode } from "lucide-react"

const Technologies = () => {
  const techCategories = [
    {
      title: "Frontend",
      icon: <Code className="h-8 w-8 text-primary" />,
      items: ["React", "HTML5", "CSS3", "JavaScript", "Tailwind CSS"],
    },
    {
      title: "Backend",
      icon: <Server className="h-8 w-8 text-primary" />,
      items: ["Node.js", "Express", "REST APIs", "GraphQL"],
    },
    {
      title: "Database",
      icon: <Database className="h-8 w-8 text-primary" />,
      items: ["MongoDB", "MySQL", "PostgreSQL", "Redis"],
    },
    {
      title: "Tools",
      icon: <GitBranch className="h-8 w-8 text-primary" />,
      items: ["Git", "GitHub", "VS Code", "Postman"],
    },
    {
      title: "Design",
      icon: <Figma className="h-8 w-8 text-primary" />,
      items: ["Figma", "Adobe XD", "Responsive Design", "UI/UX"],
    },
    {
      title: "Cloud",
      icon: <CloudCog className="h-8 w-8 text-primary" />,
      items: ["AWS S3", "AWS EC2", "Firebase", "Vercel"],
    },
    {
      title: "Security",
      icon: <Shield className="h-8 w-8 text-primary" />,
      items: ["WebAuthn", "FIDO2", "JWT", "OAuth"],
    },
    {
      title: "Other",
      icon: <FileCode className="h-8 w-8 text-primary" />,
      items: ["TypeScript", "Next.js", "Redux", "Context API"],
    },
  ]

  return (
    <section id="technologies" className="py-20 w-full bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Technologies</h2>
          <div className="w-20 h-1 bg-primary mx-auto mb-8"></div>
          <p className="text-foreground/80 max-w-2xl mx-auto">
            Here's my tech stack and tools I use to build modern web applications.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {techCategories.map((category, index) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full bg-card/50 backdrop-blur-sm border border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="p-3 rounded-full bg-primary/10 mb-4">{category.icon}</div>
                    <h3 className="text-xl font-semibold mb-4">{category.title}</h3>
                    <ul className="space-y-2">
                      {category.items.map((item) => (
                        <li key={item} className="text-foreground/70">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Technologies
