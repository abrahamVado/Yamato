import { render, waitFor } from "@testing-library/react"
import CatLoader, { CAT_LOADER_STYLE_ID } from "../CatLoader"

const INLINE_STYLE_SELECTOR = `#${CAT_LOADER_STYLE_ID}__inline`

//1.- Reset the document between tests so the stylesheet assertions stay deterministic.
beforeEach(() => {
  document.head.querySelectorAll(`#${CAT_LOADER_STYLE_ID}`).forEach((node) => node.remove())
  document.body.querySelectorAll(`#${CAT_LOADER_STYLE_ID}`).forEach((node) => node.remove())
  document.body.querySelectorAll(INLINE_STYLE_SELECTOR).forEach((node) => node.remove())
})

describe("CatLoader", () => {
  it("embeds inline styles during the first paint", () => {
    //2.- Render the loader without waiting for effects to verify the markup already contains styling.
    const { container } = render(<CatLoader label="Checking whiskers" />)

    expect(container.querySelector(INLINE_STYLE_SELECTOR)).not.toBeNull()
  })

  it("deduplicates the head stylesheet across remounts", async () => {
    //3.- Mount the loader once so the effect can migrate styles to the document head.
    const firstRender = render(<CatLoader label="Chasing yarn" />)

    await waitFor(() => {
      expect(document.head.querySelector(`#${CAT_LOADER_STYLE_ID}`)).not.toBeNull()
    })

    await waitFor(() => {
      expect(firstRender.container.querySelector(INLINE_STYLE_SELECTOR)).toBeNull()
    })

    firstRender.unmount()

    //4.- Mount the loader again and confirm the stylesheet stays single-instanced.
    render(<CatLoader label="Chasing yarn" />)

    await waitFor(() => {
      expect(document.head.querySelectorAll(`#${CAT_LOADER_STYLE_ID}`)).toHaveLength(1)
    })
  })
})
