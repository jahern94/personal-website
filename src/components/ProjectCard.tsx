import type { Project } from "@/data/projects";

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="group border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-gray-300 transition-all duration-300">
      <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
        {project.title}
      </h3>
      <p className="text-gray-600 text-sm mb-4 leading-relaxed">
        {project.description}
      </p>
      <div className="flex flex-wrap gap-2 mb-4">
        {project.tags.map((tag) => (
          <span
            key={tag}
            className="text-xs font-medium px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full"
          >
            {tag}
          </span>
        ))}
      </div>
      <div className="flex gap-4">
        {project.githubUrl && (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
          >
            GitHub &rarr;
          </a>
        )}
        {project.liveUrl && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
          >
            Live Demo &rarr;
          </a>
        )}
      </div>
    </div>
  );
}
