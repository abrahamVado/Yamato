import type { Metadata } from "next"
import { VehicleGallery } from "@/components/gameplay/VehicleGallery"
import { vehicleCatalog } from "@/lib/gameplay/vehicle-catalog"

export const metadata: Metadata = {
  title: "Vehicle gallery",
}

export default function VehicleGalleryPage() {
  //1.- Pass the validated catalog so pilots can inspect every available craft.
  return <VehicleGallery vehicles={vehicleCatalog} />
}
