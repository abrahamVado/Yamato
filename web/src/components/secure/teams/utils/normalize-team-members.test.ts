//1.- Validate the roster normalization logic to guarantee the UI sees readable names.
import { describe, expect, it } from "vitest"
import { normalizeTeamMembers } from "./normalize-team-members"

describe("normalizeTeamMembers", () => {
  it("adds fallback names when the source payload omits them", () => {
    const members = [
      { id: 7, role: "Responder" },
      { id: 8, role: "Pilot", name: "" },
    ]

    const normalized = normalizeTeamMembers(members)

    expect(normalized).toEqual([
      { id: 7, role: "Responder", name: "Operator 7" },
      { id: 8, role: "Pilot", name: "Operator 8" },
    ])
  })

  it("retains provided names when they are present", () => {
    const members = [
      { id: 12, role: "Navigator", name: "Ada" },
    ]

    const normalized = normalizeTeamMembers(members)

    expect(normalized).toEqual([
      { id: 12, role: "Navigator", name: "Ada" },
    ])
  })
})
