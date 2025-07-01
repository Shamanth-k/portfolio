"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import SkillBar from "./skill-bar";

const About = () => {
  const skills = [
    { name: "HTML/CSS", level: 90 },
    { name: "React", level: 70 },
    { name: "JavaScript", level: 70 },
    { name: "Git", level: 85 },
    { name: "MongoDB", level: 80 },
    { name: "SQL", level: 70 },
    { name: "Node.js", level: 60 },
    { name: "Express", level: 55 },
    { name: "WebAuthn", level: 60 },
  ];

  return (
    <section id="about" className="py-20 w-full bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">About Me</h2>
          <div className="w-20 h-1 bg-primary mx-auto mb-8"></div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Card className="bg-card/50 backdrop-blur-sm border border-border/50 shadow-lg">
              <CardContent className="p-6">
                <h3 className="text-2xl font-semibold mb-4">Who I Am</h3>
                <p className="text-foreground/80 mb-6 leading-relaxed">
                  I'm a 3rd year Information Science Engineering student at
                  Sahyadri College of Engineering and Management. With a passion
                  for full-stack development, I focus on creating modern,
                  efficient, and user-friendly web applications.
                </p>
                <p className="text-foreground/80 mb-6 leading-relaxed">
                  My journey in web development started with a curiosity about
                  how things work on the internet, which evolved into a deep
                  passion for creating seamless digital experiences. I'm
                  particularly interested in cloud technologies, modern
                  authentication systems, and building scalable applications.
                </p>
                <a href="/shamanth__resume.pdf" download>
                  <Button className="rounded-full">
                    <Download className="mr-2 h-4 w-4" /> Download Resume
                  </Button>
                </a>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <Card className="bg-card/50 backdrop-blur-sm border border-border/50 shadow-lg">
              <CardContent className="p-6">
                <h3 className="text-2xl font-semibold mb-6">My Skills</h3>
                <div className="space-y-4">
                  {skills.map((skill, index) => (
                    <SkillBar
                      key={skill.name}
                      name={skill.name}
                      level={skill.level}
                      delay={index * 0.1}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
