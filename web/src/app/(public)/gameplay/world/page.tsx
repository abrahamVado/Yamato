import { WorldExplorer } from "@/components/gameplay/world-explorer"

//1.- Render the open world explorer so visitors can interact with the map immediately.
export default function GameplayWorldPage() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-6 py-16">
      <header className="space-y-4">
        <h1 className="text-4xl font-bold text-foreground">Open world explorer</h1>
        <p className="text-base text-muted-foreground">
          Walk the Yamato frontier instantly—pick a biome to receive mission intel without creating a profile.
        </p>
      </header>
      <WorldExplorer />
    </main>
  )
}
