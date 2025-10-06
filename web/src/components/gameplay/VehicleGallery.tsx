"use client"

import Script from "next/script"
import type { VehicleModel } from "@/lib/gameplay/vehicle-catalog"

export function VehicleGallery({ vehicles }: { vehicles: VehicleModel[] }) {
  //1.- Load the web component responsible for rendering GLTF previews only once on the client.
  const hasVehicles = vehicles.length > 0

  return (
    <section className="space-y-6">
      <Script src="https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js" strategy="afterInteractive" />

      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">Vehicle hangar</h1>
        <p className="text-sm text-muted-foreground">
          Inspect each craft, rotate the model, and brief your squad before the next sortie.
        </p>
      </header>

      {!hasVehicles ? (
        <div className="rounded-lg border border-dashed border-border p-6 text-center text-muted-foreground">
          Drop GLTF assets into <code>/public/3dmodel/vehicles</code> with an accompanying metadata entry to see them listed here.
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {vehicles.map(vehicle => (
            <article key={vehicle.id} className="space-y-3 rounded-xl border bg-card p-4 shadow-sm">
              <header className="space-y-1">
                <h2 className="text-xl font-semibold">{vehicle.name}</h2>
                <p className="text-sm uppercase tracking-wide text-muted-foreground">{vehicle.role}</p>
              </header>

              <model-viewer
                src={vehicle.file}
                ar
                camera-controls
                auto-rotate
                autoplay
                style={{ width: "100%", height: "240px", background: "var(--muted)" }}
              />

              <p className="text-sm text-muted-foreground">{vehicle.description}</p>

              <a
                className="inline-flex w-full items-center justify-center rounded-md border border-border px-3 py-2 text-sm font-medium text-primary transition hover:border-primary"
                href={vehicle.file}
                download
              >
                Download model
              </a>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}
