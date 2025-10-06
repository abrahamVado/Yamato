import type { Metadata } from "next"
import { WorldExplorer } from "@/components/gameplay/WorldExplorer"
import { worldRegions } from "@/lib/gameplay/world-regions"

export const metadata: Metadata = {
  title: "World explorer",
}

export default function WorldExplorerPage() {
  //1.- Feed the explorer component with the curated world data so guests can roam instantly.
  return <WorldExplorer regions={worldRegions} />
}
