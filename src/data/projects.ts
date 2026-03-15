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
  {
    title: "Weather App",
    description:
      "An interactive weather app with city search, current conditions, 7-day forecast, advanced metrics (UV index, pressure, visibility, and more), and a Fahrenheit/Celsius toggle. Powered by the Open-Meteo API.",
    tags: ["Next.js", "React", "TypeScript", "Open-Meteo API", "Tailwind CSS"],
    githubUrl: "https://github.com/jahern94/personal-website",
    liveUrl: "/weather",
  },
  {
    title: "Lemonade Stand Game",
    description:
      "An interactive business simulation game where you run a lemonade stand. Learn pricing strategy, inventory management, supply & demand, and profit & loss through day-by-day gameplay with weather, upgrades, and random events.",
    tags: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Game"],
    githubUrl: "https://github.com/jahern94/personal-website",
    liveUrl: "/lemonade",
  },
];
