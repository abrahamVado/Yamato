import { redirect } from "next/navigation"

export default function GameplayIndexPage() {
  //1.- Direct visitors straight into the world explorer to emphasize immediate immersion.
  redirect("/gameplay/world")
}
