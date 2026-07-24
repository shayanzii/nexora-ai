"use client";

import dynamic from "next/dynamic";

const FloatingChatWidget = dynamic(
  () => import("./FloatingChatWidget").then((mod) => mod.FloatingChatWidget),
  { ssr: false },
);

export function ChatWidgetLoader() {
  return <FloatingChatWidget />;
}
