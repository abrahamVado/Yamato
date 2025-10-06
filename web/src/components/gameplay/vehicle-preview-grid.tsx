"use client"

import { useMemo, useState } from "react"
import { vehicleModels } from "@/3dmodel/vehicles"

//1.- Present every vehicle card so visitors can quickly compare capabilities without authenticating.
export function VehiclePreviewGrid() {
  const [focusedVehicleId, setFocusedVehicleId] = useState(vehicleModels[0]?.id ?? "")

  //2.- Resolve which vehicle is currently highlighted to drive the detail inspector.
  const focusedVehicle = useMemo(
    () => vehicleModels.find(vehicle => vehicle.id === focusedVehicleId) ?? vehicleModels[0],
    [focusedVehicleId],
  )

  if (!focusedVehicle) {
    return (
      <p className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
        Vehicle data is loading.
      </p>
    )
  }

  return (
    <section className="grid gap-6 lg:grid-cols-[1.6fr,1fr]">
      <div className="grid gap-4 sm:grid-cols-2">
        {vehicleModels.map(vehicle => (
          <button
            key={vehicle.id}
            type="button"
            onClick={() => setFocusedVehicleId(vehicle.id)}
            data-active={vehicle.id === focusedVehicle.id}
            className="group rounded-xl border border-border bg-gradient-to-br from-background to-muted p-4 text-left shadow-sm transition hover:border-primary hover:shadow-lg data-[active=true]:border-primary data-[active=true]:shadow-lg"
          >
            <div
              className={`h-32 rounded-lg bg-gradient-to-br ${vehicle.previewColor} flex items-center justify-center text-sm font-semibold text-primary-foreground`}
            >
              {vehicle.name}
            </div>
            <div className="mt-4 flex items-center justify-between text-xs uppercase tracking-wide text-muted-foreground">
              <span>{vehicle.role}</span>
              <span className="rounded-full bg-primary/10 px-2 py-0.5 font-medium text-primary">
                {vehicle.stats.speed}
              </span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{vehicle.description}</p>
          </button>
        ))}
      </div>

      <aside className="flex flex-col justify-between rounded-xl border border-border bg-card p-6 shadow-sm">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">{focusedVehicle.name}</h2>
          <p className="mt-1 text-sm uppercase tracking-wide text-muted-foreground">Role: {focusedVehicle.role}</p>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">{focusedVehicle.description}</p>
        </div>
        <dl className="mt-6 grid grid-cols-3 gap-4 text-sm">
          <div>
            <dt className="font-semibold text-muted-foreground">Top speed</dt>
            <dd className="text-lg font-bold text-foreground">{focusedVehicle.stats.speed}</dd>
          </div>
          <div>
            <dt className="font-semibold text-muted-foreground">Range</dt>
            <dd className="text-lg font-bold text-foreground">{focusedVehicle.stats.range}</dd>
          </div>
          <div>
            <dt className="font-semibold text-muted-foreground">Payload</dt>
            <dd className="text-lg font-bold text-foreground">{focusedVehicle.stats.capacity}</dd>
          </div>
        </dl>
        <p className="mt-6 text-xs text-muted-foreground">
          Choose any vehicle tile to preview its briefing module—no pilot call sign required.
        </p>
      </aside>
    </section>
  )
}
