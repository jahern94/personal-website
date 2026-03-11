export interface Project {
  title: string;
  description: string;
  tags: string[];
  githubUrl?: string;
  liveUrl?: string;
}

export const projects: Project[] = [
  {
    title: "Personal Website",
    description:
      "My personal portfolio and blog built with Next.js and Tailwind CSS. Features a blog system powered by MDX and a contact form.",
    tags: ["Next.js", "React", "Tailwind CSS", "MDX"],
    githubUrl: "https://github.com/jahern94",
    liveUrl: "/",
  },
];
