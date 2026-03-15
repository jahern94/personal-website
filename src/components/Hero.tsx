import Link from "next/link";

export default function Hero() {
  return (
    <section className="max-w-5xl mx-auto px-6 py-24 md:py-32">
      <div className="max-w-2xl">
        <p className="text-blue-600 dark:text-blue-400 font-medium mb-2">Hi, I&apos;m</p>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Jack Ahern
        </h1>
        <p className="text-xl md:text-2xl text-gray-500 dark:text-gray-400 mb-6">
          Developer &amp; Creator
        </p>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
          Welcome to my corner of the internet. I build things for the web,
          write about what I learn, and share my journey as a developer.
        </p>
        <div className="flex flex-wrap gap-4">
          <Link
            href="/projects"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            View My Projects
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:border-gray-400 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            Get In Touch
          </Link>
        </div>
      </div>
    </section>
  );
}
