"use client"

import { useMemo, useState } from "react"
import type { WorldRegion } from "@/lib/gameplay/world-regions"

export function WorldExplorer({ regions }: { regions: WorldRegion[] }) {
  //1.- Remember the currently highlighted region to drive the detail panel.
  const [activeRegionId, setActiveRegionId] = useState(regions[0]?.id ?? null)

  //2.- Derive the region metadata every time the selection changes.
  const activeRegion = useMemo(
    () => regions.find(region => region.id === activeRegionId) ?? null,
    [activeRegionId, regions],
  )

  //3.- Provide a graceful fallback when the dataset is empty.
  if (!regions.length) {
    return (
      <section className="rounded-lg border border-dashed border-border p-6 text-center text-muted-foreground">
        Add regions to the world-regions registry to explore this planet.
      </section>
    )
  }

  return (
    <section className="grid gap-6 md:grid-cols-[minmax(0,18rem)_1fr]">
      <aside className="space-y-3">
        <h2 className="text-lg font-semibold">Regions</h2>
        <p className="text-sm text-muted-foreground">
          Tap a destination to inspect its terrain, story hooks, and logistics notes.
        </p>
        <ul className="space-y-2">
          {regions.map(region => {
            const isActive = region.id === activeRegionId
            return (
              <li key={region.id}>
                <button
                  type="button"
                  onClick={() => setActiveRegionId(region.id)}
                  className={`w-full rounded-lg border px-4 py-3 text-left transition ${
                    isActive
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border hover:border-primary/60 hover:text-primary"
                  }`}
                >
                  <div className="text-sm font-medium">{region.name}</div>
                  <div className="text-xs uppercase tracking-wide text-muted-foreground">{region.climate}</div>
                </button>
              </li>
            )
          })}
        </ul>
      </aside>

      <article className="rounded-xl border bg-card p-6 shadow-sm">
        {activeRegion ? (
          <div className="space-y-4">
            <header className="space-y-1">
              <h2 className="text-2xl font-semibold">{activeRegion.name}</h2>
              <p className="text-sm uppercase tracking-wide text-muted-foreground">{activeRegion.climate}</p>
            </header>
            <p className="text-base leading-relaxed text-muted-foreground">{activeRegion.description}</p>
            <section>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Points of interest</h3>
              <ul className="mt-2 grid gap-2 text-sm sm:grid-cols-2">
                {activeRegion.highlights.map(item => (
                  <li key={item} className="rounded-md border border-border px-3 py-2">
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          </div>
        ) : (
          <div className="grid h-full place-items-center text-muted-foreground">
            Choose a region on the left to see its story threads.
          </div>
        )}
      </article>
    </section>
  )
}
