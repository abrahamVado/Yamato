import { render } from "@testing-library/react"
import Loading from "../loading"
import { CAT_LOADER_STYLE_ID } from "@/components/CatLoader"

describe("app loading fallback", () => {
  it("renders the cat loader markup during server transitions", () => {
    //1.- Render the loading component to inspect the markup sent during pending routes.
    const { container } = render(<Loading />)

    //2.- Verify the status region exists so screen readers announce the pending navigation immediately.
    expect(container.querySelector('[role="status"]')).not.toBeNull()

    //3.- Ensure the inline stylesheet is emitted to paint the animation before hydration completes.
    expect(container.querySelector(`#${CAT_LOADER_STYLE_ID}__inline`)).not.toBeNull()
  })
})
