import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lemonade Stand — Jack Ahern",
  description:
    "Run your own lemonade stand! Learn business fundamentals like pricing, inventory management, and profit & loss through an interactive simulation game.",
};

export default function LemonadeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
