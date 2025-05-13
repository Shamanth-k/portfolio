"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowDown, Github, Linkedin, Mail } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";
import ParticleBackground from "./particle-background";

const Hero = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToNext = () => {
    const nextSection = document.getElementById("about");
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="home"
      className="relative w-full min-h-screen flex items-center justify-center overflow-hidden"
    >
      <ParticleBackground />

      <div className="container mx-auto px-4 z-10 pt-20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500">
              Hi, I&apos;m Shamanth Krishna V R
            </h1>
            <h2 className="text-2xl md:text-4xl font-bold mb-6">
              Full Stack Developer & Tech Explorer
            </h2>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-foreground/80 mb-8 max-w-2xl mx-auto"
          >
            Passionate web developer dedicated to creating modern, scalable
            applications using React, Node.js, MongoDB, and AWS. Focused on
            delivering seamless user experiences and continuously learning new
            technologies to stay ahead in the web development space.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
          >
            <Button asChild size="lg" className="rounded-full">
              <Link href="#projects">View Projects</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-full"
            >
              <Link href="mailto:shamanthk2004@gmail.com">
                <Mail className="mr-2 h-4 w-4" /> Contact Me
              </Link>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="flex justify-center gap-4 mb-16"
          >
            <Button
              asChild
              size="icon"
              variant="ghost"
              className="rounded-full"
            >
              <Link
                href="https://github.com/Shamanth-k"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </Link>
            </Button>
            <Button
              asChild
              size="icon"
              variant="ghost"
              className="rounded-full"
            >
              <Link
                href="https://www.linkedin.com/in/shamanth-krishna-v-r-89178b267/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </Link>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: 0.8,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
              repeatDelay: 0.2,
            }}
            className="flex justify-center"
          >
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full animate-bounce"
              onClick={scrollToNext}
            >
              <ArrowDown className="h-6 w-6" />
              <span className="sr-only">Scroll Down</span>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
