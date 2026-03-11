import Link from "next/link";
import type { BlogPost } from "@/lib/blog";

export default function BlogPostCard({ post }: { post: BlogPost }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-gray-300 transition-all duration-300"
    >
      <time className="text-sm text-gray-400">
        {new Date(post.date).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </time>
      <h3 className="text-lg font-semibold text-gray-900 mt-1 mb-2 group-hover:text-blue-600 transition-colors">
        {post.title}
      </h3>
      <p className="text-gray-600 text-sm leading-relaxed">
        {post.description}
      </p>
      {post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs font-medium px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </Link>
  );
}
