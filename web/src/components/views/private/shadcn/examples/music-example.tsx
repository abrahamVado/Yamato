"use client"

//1.- Recreate the music app shell using tabs, scroll areas and album data arrays.
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

const listenNowAlbums = [
  { name: "Aurora Signals", artist: "The Operators", color: "from-purple-500 via-indigo-500 to-blue-500" },
  { name: "Policy Mesh", artist: "Runbooks", color: "from-emerald-500 via-green-500 to-lime-500" },
  { name: "Velocity", artist: "Night Deploy", color: "from-amber-500 via-orange-500 to-rose-500" },
  { name: "Automation Dreams", artist: "Ops AI", color: "from-sky-500 via-cyan-500 to-indigo-500" },
]

const madeForYouAlbums = [
  { name: "Incident Zero", artist: "Pagerdance", color: "from-rose-500 via-pink-500 to-purple-500" },
  { name: "Runbook Jazz", artist: "Ops Collective", color: "from-blue-500 via-slate-500 to-slate-700" },
  { name: "Async Nights", artist: "Remote Crew", color: "from-amber-500 via-yellow-500 to-orange-500" },
  { name: "Tenants", artist: "Billing Labs", color: "from-emerald-500 via-teal-500 to-cyan-500" },
]

function AlbumArtwork({
  name,
  artist,
  color,
  size = "w-[240px]",
  square = false,
}: {
  name: string
  artist: string
  color: string
  size?: string
  square?: boolean
}) {
  //2.- Render a gradient tile instead of remote images to keep the example fast and self-contained.
  return (
    <div
      className={`group relative overflow-hidden rounded-xl bg-gradient-to-br ${color} ${size} ${
        square ? "aspect-square" : "aspect-[4/5]"
      }`}
    >
      <div className="absolute inset-0 bg-black/10 opacity-0 transition-opacity group-hover:opacity-100" />
      <div className="absolute inset-0 flex flex-col justify-end p-4 text-white drop-shadow-lg">
        <p className="text-sm font-medium">{name}</p>
        <p className="text-xs text-white/80">{artist}</p>
      </div>
    </div>
  )
}

export function MusicExample() {
  //3.- Combine sidebar cards and the listening tabs just like the official example.
  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>Music app</CardTitle>
        <CardDescription>Explore playlists and podcasts sourced from shadcn demos.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6 lg:grid-cols-5">
        <div className="hidden space-y-4 lg:col-span-1 lg:flex lg:flex-col">
          <div className="rounded-lg border bg-muted/40 p-4">
            <p className="text-sm font-medium">Favourites</p>
            <p className="text-xs text-muted-foreground">12 curated playlists</p>
          </div>
          <div className="rounded-lg border bg-muted/40 p-4">
            <p className="text-sm font-medium">Recently played</p>
            <p className="text-xs text-muted-foreground">Jazz, Ambient Ops, Incident Zero</p>
          </div>
          <div className="rounded-lg border border-dashed bg-muted/20 p-4 text-sm text-muted-foreground">
            Add another collection
          </div>
        </div>
        <div className="lg:col-span-4">
          <Tabs defaultValue="music" className="space-y-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <TabsList>
                <TabsTrigger value="music">Music</TabsTrigger>
                <TabsTrigger value="podcasts">Podcasts</TabsTrigger>
                <TabsTrigger value="live" disabled>
                  Live
                </TabsTrigger>
              </TabsList>
              <Button className="sm:w-auto" size="sm">
                Add music
              </Button>
            </div>
            <TabsContent value="music" className="space-y-6">
              <div className="space-y-1">
                <h3 className="text-2xl font-semibold tracking-tight">Listen Now</h3>
                <p className="text-sm text-muted-foreground">Top picks for you. Updated daily.</p>
              </div>
              <Separator />
              <ScrollArea>
                <div className="flex space-x-4 pb-4">
                  {listenNowAlbums.map((album) => (
                    <AlbumArtwork key={album.name} {...album} />
                  ))}
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>

              <div className="space-y-1">
                <h3 className="text-2xl font-semibold tracking-tight">Made for you</h3>
                <p className="text-sm text-muted-foreground">Personalized playlists from your automation history.</p>
              </div>
              <Separator />
              <ScrollArea>
                <div className="flex space-x-4 pb-4">
                  {madeForYouAlbums.map((album) => (
                    <AlbumArtwork key={album.name} {...album} size="w-[160px]" square />
                  ))}
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </TabsContent>
            <TabsContent value="podcasts" className="space-y-6">
              <div className="space-y-1">
                <h3 className="text-2xl font-semibold tracking-tight">New episodes</h3>
                <p className="text-sm text-muted-foreground">Your favourite shows, refreshed every morning.</p>
              </div>
              <Separator />
              <div className="grid gap-4 rounded-lg border border-dashed bg-muted/20 p-6 text-center text-sm text-muted-foreground">
                No new episodes yet. Add feeds to start listening.
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  )
}
