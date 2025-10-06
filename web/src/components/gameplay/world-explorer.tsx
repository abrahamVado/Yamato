"use client"

import { useMemo, useState } from "react"

//1.- Model each region of the open world so we can render interactive hotspots the player can explore.
const worldRegions = [
  {
    id: "aurora-basin",
    name: "Aurora Basin",
    description:
      "Crystalline canyons with rich mineral seams and gentle terrain—perfect for onboarding expeditions.",
    climate: "Temperate",
    challenge: "Low",
  },
  {
    id: "ember-expanse",
    name: "Ember Expanse",
    description:
      "Volcanic plateaus riddled with thermal vents that power remote fabrication beacons.",
    climate: "Volcanic",
    challenge: "Medium",
  },
  {
    id: "zephyr-steppe",
    name: "Zephyr Steppe",
    description:
      "Wide-open lowlands where high winds demand agile vehicles and rapid tactical choices.",
    climate: "Arid",
    challenge: "High",
  },
  {
    id: "lumen-reef",
    name: "Lumen Reef",
    description:
      "Bioluminescent wetlands hiding rare flora used for advanced medical synthesis.",
    climate: "Tropical",
    challenge: "Medium",
  },
] as const

type RegionId = (typeof worldRegions)[number]["id"]

//2.- Expose the interactive explorer that allows unauthenticated visitors to inspect regions.
export function WorldExplorer() {
  const initialRegion = (worldRegions[0]?.id ?? "aurora-basin") as RegionId
  const [activeRegionId, setActiveRegionId] = useState<RegionId>(initialRegion)

  //3.- Compute the active region so the detail panel always reflects the current selection.
  const activeRegion = useMemo(
    () => worldRegions.find(region => region.id === activeRegionId) ?? worldRegions[0],
    [activeRegionId],
  )

  return (
    <section className="grid gap-6 lg:grid-cols-[1.4fr,1fr]">
      <div className="grid gap-4 sm:grid-cols-2">
        {worldRegions.map(region => (
          <button
            key={region.id}
            type="button"
            onClick={() => setActiveRegionId(region.id)}
            data-active={activeRegion?.id === region.id}
            className="group rounded-xl border border-border bg-gradient-to-br from-background to-muted p-4 text-left shadow-sm transition hover:border-primary hover:shadow-lg data-[active=true]:border-primary data-[active=true]:shadow-lg"
          >
            <span className="block text-sm font-semibold uppercase tracking-wide text-primary">{region.climate}</span>
            <span className="mt-2 block text-lg font-bold text-foreground">{region.name}</span>
            <p className="mt-3 text-sm text-muted-foreground">{region.description}</p>
            <span className="mt-4 inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              Challenge: {region.challenge}
            </span>
          </button>
        ))}
      </div>

      <aside className="flex flex-col justify-between rounded-xl border border-border bg-card p-6 shadow-sm">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Now exploring</h2>
          <p className="mt-1 text-sm uppercase tracking-wide text-muted-foreground">{activeRegion?.climate} biome</p>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">{activeRegion?.description}</p>
        </div>
        <dl className="mt-6 grid grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="font-semibold text-muted-foreground">Region</dt>
            <dd className="text-lg font-bold text-foreground">{activeRegion?.name}</dd>
          </div>
          <div>
            <dt className="font-semibold text-muted-foreground">Difficulty</dt>
            <dd className="text-lg font-bold text-foreground">{activeRegion?.challenge}</dd>
          </div>
        </dl>
        <p className="mt-6 text-xs text-muted-foreground">
          Select any biome to update your expedition briefing—no login or character assignment required.
        </p>
      </aside>
    </section>
  )
}
