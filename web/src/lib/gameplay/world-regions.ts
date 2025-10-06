export type WorldRegion = {
  id: string
  name: string
  climate: "temperate" | "arid" | "tundra" | "tropical"
  description: string
  highlights: string[]
}

//1.- Provide a curated list of explorable regions so the gameplay UI has deterministic content.
export const worldRegions: WorldRegion[] = [
  {
    id: "azure-steppe",
    name: "Azure Steppe",
    climate: "temperate",
    description:
      "Rolling grasslands dotted with crystalline monoliths that hum whenever storm fronts approach.",
    highlights: [
      "Nomadic caravan routes that change every season",
      "Wind-tempered outposts for long range patrols",
      "Hidden groves of luminous reeds"
    ]
  },
  {
    id: "ember-hollows",
    name: "Ember Hollows",
    climate: "arid",
    description:
      "Sunken basins carved by ancient lava flows now repurposed as a geothermal energy lattice.",
    highlights: [
      "Subterranean markets cooled by mineral vents",
      "Supply depots built into volcanic glass",
      "Observation towers with panoramic horizons"
    ]
  },
  {
    id: "silver-fjords",
    name: "Silver Fjords",
    climate: "tundra",
    description:
      "Glacial cliffs that descend into mirror-like bays, watched over by automated lighthouse beacons.",
    highlights: [
      "Icebreaker docks operated by autonomous drones",
      "Aurora research labs tracing magnetic storms",
      "Sheltered caverns warmed by thermal springs"
    ]
  },
  {
    id: "verdant-canopy",
    name: "Verdant Canopy",
    climate: "tropical",
    description:
      "Layered jungles suspended by colossal trees where ropeways connect research sanctuaries.",
    highlights: [
      "Biodiversity observatories perched above the canopy",
      "Waterfall turbines powering remote villages",
      "Night markets illuminated by bioluminescent flora"
    ]
  }
]
