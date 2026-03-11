import type { Metadata } from "next";
import { projects } from "@/data/projects";
import ProjectCard from "@/components/ProjectCard";

export const metadata: Metadata = {
  title: "Projects — Jack Ahern",
  description: "A collection of projects I've built and am working on.",
};

export default function ProjectsPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-16 md:py-24">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
        Projects
      </h1>
      <p className="text-lg text-gray-600 mb-10">
        Here are some of the things I&apos;ve been building. Each project has
        been a learning experience and a chance to try new technologies.
      </p>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <ProjectCard key={project.title} project={project} />
        ))}
      </div>
      <p className="text-center text-gray-500 mt-12">
        More coming soon!
      </p>
    </div>
  );
}
