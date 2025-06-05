"use client";

import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ExternalLink,
  Github,
  Lock,
  Cloud,
  Palette,
  ShoppingCart,
  Home,
  Activity,
} from "lucide-react";
import Link from "next/link";

const Projects = () => {
  const projects = [
    {
      title: "Passwordless Authentication System",
      description:
        "A secure, modern login system using public-key cryptography (WebAuthn and FIDO2), enabling passwordless and biometric login.",
      github:
        "https://github.com/Shrinidhi972004/passwordless-password-authentication-system.git",
      live: "#",
      icon: <Lock className="h-10 w-10 text-primary" />,
      tags: ["React", "Node.js", "WebAuthn", "FIDO2", "Express"],
    },
    {
      title: "Cloud Media Gallery (MERN + AWS S3)",
      description:
        "A scalable media gallery app built with the MERN stack and integrated with AWS S3 for secure image/video storage and retrieval.",
      github: "https://github.com/Shamanth-k/cloud-gallery.git",
      live: "#",
      icon: <Cloud className="h-10 w-10 text-primary" />,
      tags: ["React", "Node.js", "MongoDB", "Express", "AWS S3"],
    },
    {
      title: "Art Gallery Management System",
      description:
        "Full-stack application using React, Node.js, and SQL for managing artists and exhibitions with admin dashboard and secure login.",
      github: "#",
      live: "#",
      icon: <Palette className="h-10 w-10 text-primary" />,
      tags: ["React", "Node.js", "SQL", "Express", "Authentication"],
    },
    {
      title: "E-commerce Website for Handicrafts",
      description:
        "An online platform for buying and selling handcrafted products with responsive UI, cart management, and dynamic product listings.",
      github: "#",
      live: "#",
      icon: <ShoppingCart className="h-10 w-10 text-primary" />,
      tags: ["React", "Node.js", "MongoDB", "Express", "Payment Gateway"],
    },
    {
      title: "Hostel Room Booking System (MERN Stack)",
      description:
        "A full-stack hostel room booking application built using the MERN stack, allowing users to view available rooms, make bookings, and manage hostel accommodations efficiently.",
      github: "https://github.com/Shamanth-k/hostel-room-booking.git",
      live: "#",
      icon: <Home className="h-10 w-10 text-primary" />,
      tags: ["React", "Node.js", "MongoDB", "Express", "Booking System"],
    },
    {
      title: "LifeLine – Emergency Healthcare Web App",
      description:
        "A smart emergency response platform connecting patients, ambulances, and hospitals in real-time using the MERN stack. Designed to reduce delays and streamline medical help during critical situations.",
      github: "https://github.com/Shamanth-k/emergency-health-care-webapp-.git",
      live: "#",
      icon: <Activity className="h-10 w-10 text-primary" />,
      tags: ["React", "Node.js", "MongoDB", "Express", "Emergency Response"],
    },
    
  ];

  return (
    <section id="projects" className="py-20 w-full bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">My Projects</h2>
          <div className="w-20 h-1 bg-primary mx-auto mb-8"></div>
          <p className="text-foreground/80 max-w-2xl mx-auto">
            Here are some of the projects I've worked on. Each project
            represents different skills and technologies I've mastered.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full overflow-hidden group bg-card/50 backdrop-blur-sm border border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                  <div className="p-2 rounded-full bg-primary/10">
                    {project.icon}
                  </div>
                  <h3 className="text-xl font-semibold">{project.title}</h3>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground/70 mb-4">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="bg-primary/10 hover:bg-primary/20"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button asChild variant="outline" size="sm">
                    <Link
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Github className="mr-2 h-4 w-4" /> GitHub
                    </Link>
                  </Button>
                  <Button asChild size="sm">
                    <Link
                      href={project.live}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="mr-2 h-4 w-4" /> Live Demo
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
