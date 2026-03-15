import type { Metadata } from "next";
import { getAllPosts } from "@/lib/blog";
import BlogPostCard from "@/components/BlogPostCard";

export const metadata: Metadata = {
  title: "Blog — Jack Ahern",
  description: "Thoughts on web development, projects, and learning to code.",
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="max-w-3xl mx-auto px-6 py-16 md:py-24">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
        Blog
      </h1>
      <p className="text-lg text-gray-600 dark:text-gray-400 mb-10">
        Writing about web development, projects I&apos;m working on, and things
        I learn along the way.
      </p>
      {posts.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">No posts yet. Check back soon!</p>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <BlogPostCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
