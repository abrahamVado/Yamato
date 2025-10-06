//1.- Define the metadata contract describing how a gameplay vehicle model is represented in the UI layer.
export type VehicleModel = {
  id: string
  name: string
  role: string
  description: string
  previewColor: string
  stats: {
    speed: string
    range: string
    capacity: string
  }
}

//2.- Curate the available vehicle models so the gameplay views can render previews without additional lookups.
export const vehicleModels: VehicleModel[] = [
  {
    id: "scout-rover",
    name: "Scout Rover",
    role: "Recon",
    description:
      "Lightweight rover tuned for scouting new territories and surfacing navigation data for the fleet.",
    previewColor: "from-amber-200 via-amber-300 to-orange-300",
    stats: {
      speed: "45 km/h",
      range: "120 km",
      capacity: "2 research pods",
    },
  },
  {
    id: "atlas-hauler",
    name: "Atlas Hauler",
    role: "Logistics",
    description:
      "Heavy cargo platform engineered to move fabrication modules between forward operating bases.",
    previewColor: "from-slate-200 via-slate-300 to-slate-400",
    stats: {
      speed: "30 km/h",
      range: "240 km",
      capacity: "18 modular crates",
    },
  },
  {
    id: "aegis-warden",
    name: "Aegis Warden",
    role: "Security",
    description:
      "Shielded escort designed to keep expedition columns safe through hazardous corridors.",
    previewColor: "from-blue-200 via-blue-300 to-indigo-400",
    stats: {
      speed: "55 km/h",
      range: "180 km",
      capacity: "6 sentinel drones",
    },
  },
  {
    id: "ember-skimmer",
    name: "Ember Skimmer",
    role: "Support",
    description:
      "Hover-capable responder that delivers repairs and medkits across uneven terrain.",
    previewColor: "from-rose-200 via-rose-300 to-red-300",
    stats: {
      speed: "65 km/h",
      range: "150 km",
      capacity: "4 service racks",
    },
  },
]
