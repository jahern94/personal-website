import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Weather — Jack Ahern",
  description:
    "Search for any city and view current weather conditions and a 7-day forecast.",
};

export default function WeatherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
