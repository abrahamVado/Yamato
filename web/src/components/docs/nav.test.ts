// src/components/docs/nav.test.ts
import { describe, expect, it } from "vitest"

import { docsNav } from "./nav"

describe("docsNav", () => {
  it("includes the Examples section with a components link", () => {
    //1.- Locate the Examples section in the navigation configuration.
    const examplesSection = docsNav.find(section => section.title === "Examples")

    //2.- Assert the section exists and references the components showcase route.
    expect(examplesSection).toBeDefined()
    expect(examplesSection?.links).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ href: "/public/docs/examples/components", title: "Components" }),
      ])
    )
  })
})
