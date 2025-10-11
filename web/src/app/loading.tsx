import * as React from "react";
import CatLoader from "@/components/CatLoader";

export default function Loading() {
  //1.- Render the CatLoader directly so server fallbacks show the animation immediately.
  return (
    <main className="flex min-h-screen items-center justify-center">
      <CatLoader label="Summoning yarn balls…" />
    </main>
  );
}
