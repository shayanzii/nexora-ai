import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nexora Assistant | Nexora AI",
  description:
    "Chat with Nexora AI — premium automation and strategy guidance.",
};

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
