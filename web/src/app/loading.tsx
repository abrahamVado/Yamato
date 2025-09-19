import * as React from "react";
import dynamic from "next/dynamic";

// Avoid SSR since it’s purely visual
const CatLoader = dynamic(() => import("@/components/CatLoader"), { ssr: false });

export default function Loading() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <CatLoader label="Summoning yarn balls…" />
    </main>
  );
}
