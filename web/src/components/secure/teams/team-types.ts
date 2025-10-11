//1.- Centralize the admin team domain contracts shared across UI surfaces.
export type TeamMember = {
  id: number
  role: string
  name?: string
}

//2.- Describe the payload shape consumed by admin team resources.
export type AdminTeam = {
  id: number
  name: string
  description?: string
  members: TeamMember[]
}
