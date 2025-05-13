import Link from "next/link";
import { Github, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full py-8 border-t bg-background">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-foreground/70">
              © {currentYear} Shamanth Krishna V R. All Rights Reserved.
            </p>
          </div>

          <div className="flex gap-4">
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
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
