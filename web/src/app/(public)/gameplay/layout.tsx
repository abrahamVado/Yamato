import { GameplayNavigation } from "@/components/gameplay/GameplayNavigation"

export default function GameplayLayout({ children }: { children: React.ReactNode }) {
  //1.- Wrap every gameplay surface with a shared navigation strip for quick context switching.
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-10">
      <header className="space-y-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-semibold">Gameplay laboratory</h1>
          <p className="text-muted-foreground">
            Preview the sandbox experiences available to guests before they create a callsign.
          </p>
        </div>
        <GameplayNavigation />
      </header>
      {/*2.- Render the active child route below the navigation rail.*/}
      <main>{children}</main>
    </div>
  )
}
