import Link from "next/link"

//1.- Provide a simple hub that routes visitors to each gameplay showcase without any authentication gates.
export default function GameplayHubPage() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-6 py-16">
      <header className="space-y-4 text-center">
        <h1 className="text-4xl font-bold text-foreground">Gameplay sandboxes</h1>
        <p className="text-base text-muted-foreground">
          Explore the Yamato frontier instantly—jump into world scouting or inspect your vehicles without logging in.
        </p>
      </header>
      <section className="grid gap-6 md:grid-cols-2">
        <Link
          href="/gameplay/world"
          className="group rounded-xl border border-border bg-card p-6 shadow-sm transition hover:border-primary hover:shadow-lg"
        >
          <span className="text-sm font-semibold uppercase tracking-wide text-primary">World</span>
          <h2 className="mt-2 text-2xl font-semibold text-foreground">Open world explorer</h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Survey biomes, plan expeditions, and understand terrain challenges—no identity setup required.
          </p>
          <span className="mt-4 inline-flex items-center text-sm font-medium text-primary">
            Enter the world →
          </span>
        </Link>
        <Link
          href="/gameplay/vehicles"
          className="group rounded-xl border border-border bg-card p-6 shadow-sm transition hover:border-primary hover:shadow-lg"
        >
          <span className="text-sm font-semibold uppercase tracking-wide text-primary">Vehicles</span>
          <h2 className="mt-2 text-2xl font-semibold text-foreground">Fleet preview bay</h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Inspect every rover and hauler in the 3D garage to pick the perfect companion for your journey.
          </p>
          <span className="mt-4 inline-flex items-center text-sm font-medium text-primary">
            View the fleet →
          </span>
        </Link>
      </section>
    </main>
  )
}
