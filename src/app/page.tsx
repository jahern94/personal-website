import Hero from "@/components/Hero";
import Link from "next/link";
import { getAllPosts } from "@/lib/blog";
import { projects } from "@/data/projects";
import ProjectCard from "@/components/ProjectCard";
import BlogPostCard from "@/components/BlogPostCard";

export default function Home() {
  const recentPosts = getAllPosts().slice(0, 2);
  const featuredProjects = projects.slice(0, 3);

  return (
    <>
      <Hero />

      {/* Featured Projects */}
      <section className="max-w-5xl mx-auto px-6 py-16 border-t border-gray-100 dark:border-gray-800">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Projects</h2>
          <Link
            href="/projects"
            className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
          >
            View all &rarr;
          </Link>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProjects.map((project) => (
            <ProjectCard key={project.title} project={project} />
          ))}
        </div>
      </section>

      {/* Recent Blog Posts */}
      <section className="max-w-5xl mx-auto px-6 py-16 border-t border-gray-100 dark:border-gray-800">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Recent Posts</h2>
          <Link
            href="/blog"
            className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
          >
            View all &rarr;
          </Link>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {recentPosts.map((post) => (
            <BlogPostCard key={post.slug} post={post} />
          ))}
        </div>
      </section>
    </>
  );
}
