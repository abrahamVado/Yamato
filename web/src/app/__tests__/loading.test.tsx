import { render } from "@testing-library/react"
import Loading from "../loading"

describe("app loading fallback", () => {
  it("renders the cat loader markup during server transitions", () => {
    //1.- Render the loading component to inspect the markup sent during pending routes.
    const { container, getByRole } = render(<Loading />)

    //2.- Verify the status region exists so screen readers announce the pending navigation immediately.
    expect(getByRole("status")).toHaveAttribute("aria-busy", "true")

    //3.- Confirm the decorative cat pieces are present so the animation paints once styles load.
    expect(container.querySelectorAll("[data-cat-loader-part]")).toHaveLength(4)
  })
})
