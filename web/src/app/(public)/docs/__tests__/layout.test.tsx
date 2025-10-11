import { render, screen } from "@testing-library/react"

import DocsLayout from "../layout"

//1.- Ensure the docs layout wraps its children inside the expected structure.
describe("DocsLayout", () => {
  it("wraps docs content inside a centered card", () => {
    //2.- Render the layout with sample content so we can assert against its markup.
    render(
      <DocsLayout>
        <p>Doc content</p>
      </DocsLayout>
    )

    //3.- Confirm the docs card exists and enforces the maximum width constraint.
    const card = screen.getByTestId("docs-content-card")
    expect(card).toHaveClass("max-w-3xl")

    //5.- Check that the neumorphic treatment is applied for the docs surface.
    expect(card).toHaveClass("neumorphic-card")
    expect(card).toHaveClass("shadow-none")

    //4.- Verify the prose container is present to keep typography styling intact.
    const proseContainer = card.querySelector(".prose")
    expect(proseContainer).not.toBeNull()
    expect(proseContainer?.textContent).toContain("Doc content")
  })
})
