import type { MDXComponents } from "mdx/types";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: ({ children }) => (
      <h1 className="text-3xl font-bold mt-8 mb-4 text-gray-900">{children}</h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-2xl font-semibold mt-6 mb-3 text-gray-900">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-xl font-semibold mt-5 mb-2 text-gray-900">{children}</h3>
    ),
    p: ({ children }) => (
      <p className="mb-4 leading-relaxed text-gray-700">{children}</p>
    ),
    a: ({ href, children }) => (
      <a
        href={href}
        className="text-blue-600 hover:text-blue-800 underline underline-offset-2"
      >
        {children}
      </a>
    ),
    ul: ({ children }) => (
      <ul className="list-disc list-inside mb-4 space-y-1 text-gray-700">{children}</ul>
    ),
    ol: ({ children }) => (
      <ol className="list-decimal list-inside mb-4 space-y-1 text-gray-700">{children}</ol>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-blue-500 pl-4 italic my-4 text-gray-600">
        {children}
      </blockquote>
    ),
    code: ({ children }) => (
      <code className="bg-gray-100 rounded px-1.5 py-0.5 text-sm font-mono text-gray-800">
        {children}
      </code>
    ),
    pre: ({ children }) => (
      <pre className="bg-gray-100 rounded-lg p-4 overflow-x-auto mb-4 text-sm">
        {children}
      </pre>
    ),
    ...components,
  };
}
