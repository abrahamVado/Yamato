import { VehiclePreviewGrid } from "@/components/gameplay/vehicle-preview-grid"

//1.- Surface the vehicle preview bay showcasing every model stored in the 3D catalogue.
export default function GameplayVehiclesPage() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-6 py-16">
      <header className="space-y-4">
        <h1 className="text-4xl font-bold text-foreground">Fleet preview bay</h1>
        <p className="text-base text-muted-foreground">
          Compare every vehicle model in the Yamato garage before you commit to a loadout—no login, no pilot callsigns.
        </p>
      </header>
      <VehiclePreviewGrid />
    </main>
  )
}
