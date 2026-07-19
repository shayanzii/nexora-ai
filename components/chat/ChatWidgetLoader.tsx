"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const FloatingChatWidget = dynamic(
  () => import("./FloatingChatWidget").then((mod) => mod.FloatingChatWidget),
  { ssr: false },
);

export function ChatWidgetLoader() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return <FloatingChatWidget />;
}
