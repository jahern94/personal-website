import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About — Jack Ahern",
  description: "Learn more about me, my skills, and what I'm interested in.",
};

const skills = [
  "HTML & CSS",
  "JavaScript",
  "TypeScript",
  "React",
  "Next.js",
  "Tailwind CSS",
  "Node.js",
  "Git & GitHub",
];

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16 md:py-24">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
        About Me
      </h1>

      {/* Bio */}
      <div className="prose prose-gray max-w-none mb-12">
        <p className="text-lg text-gray-600 leading-relaxed">
          Hello! I&apos;m Jack and I&apos;m a technology sales professional
          learning AI by doing. I plan on updating this page with applications
          I built, lessons I&apos;ve learned and sharing other cool things
          I&apos;ve come across.
        </p>
      </div>

      {/* Skills */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Skills</h2>
        <div className="flex flex-wrap gap-3">
          {skills.map((skill) => (
            <span
              key={skill}
              className="px-4 py-2 bg-blue-50 text-blue-700 text-sm font-medium rounded-full"
            >
              {skill}
            </span>
          ))}
        </div>
      </section>

      {/* Interests */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Interests</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            {
              title: "Web Development",
              desc: "Building modern, responsive websites and applications",
            },
            {
              title: "Open Source",
              desc: "Contributing to and learning from open source projects",
            },
            {
              title: "Design",
              desc: "Clean UI/UX design and making things look great",
            },
            {
              title: "Learning",
              desc: "Always picking up new skills and exploring new tech",
            },
          ].map((interest) => (
            <div
              key={interest.title}
              className="p-4 border border-gray-200 rounded-xl"
            >
              <h3 className="font-semibold text-gray-900 mb-1">
                {interest.title}
              </h3>
              <p className="text-sm text-gray-600">{interest.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
