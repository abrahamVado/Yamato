import * as React from "react";
import CatLoader from "@/components/CatLoader";

export default function Loading() {
  return (
    <main className="grid min-h-[70vh] place-items-center">
      <CatLoader label="Summoning yarn balls…" />
    </main>
  );
}
