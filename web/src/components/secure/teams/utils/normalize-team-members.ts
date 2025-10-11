//1.- Transform raw roster entries to guarantee a presentable display name per operator.
import type { TeamMember } from "../team-types"

//2.- Provide a deterministic fallback label for each roster entry.
const DEFAULT_NAME_PREFIX = "Operator"

//3.- Normalize roster entries to always include a name, even if the API omits it.
export function normalizeTeamMembers(members: TeamMember[] | undefined): TeamMember[] {
  if (!members?.length) {
    return []
  }

  return members.map((member) => ({
    ...member,
    name: member.name && member.name.trim().length > 0 ? member.name : `${DEFAULT_NAME_PREFIX} ${member.id}`,
  }))
}
