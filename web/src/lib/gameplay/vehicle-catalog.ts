import fs from "fs"
import path from "path"

export type VehicleModel = {
  id: string
  name: string
  role: string
  description: string
  file: string
}

//1.- Read the vehicle metadata that lives alongside the 3D assets so editors can extend the roster without touching code.
function loadVehicleCatalog(): VehicleModel[] {
  const vehiclesDir = path.join(process.cwd(), "public/3dmodel/vehicles")
  const indexPath = path.join(vehiclesDir, "index.json")

  try {
    //2.- Parse the curated metadata file and coerce it into the strongly typed catalog.
    const raw = fs.readFileSync(indexPath, "utf-8")
    const parsed = JSON.parse(raw) as VehicleModel[]

    //3.- Validate that each entry references an existing asset before exposing it to the UI.
    return parsed.filter(entry => {
      if (!entry.file) return false
      const relative = entry.file.startsWith("/") ? entry.file.slice(1) : entry.file
      const assetPath = path.join(process.cwd(), "public", relative)
      return fs.existsSync(assetPath)
    })
  } catch (error) {
    //4.- Fail gracefully by returning an empty catalog when metadata is missing or malformed.
    console.warn("Vehicle catalog unavailable:", error)
    return []
  }
}

//5.- Export a cached snapshot so server components can access the catalog synchronously.
export const vehicleCatalog: VehicleModel[] = loadVehicleCatalog()
