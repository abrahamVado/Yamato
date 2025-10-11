import { render } from "@testing-library/react"
import CatLoader from "../CatLoader"
import styles from "../CatLoader.module.css"

//1.- Reset the DOM between tests to keep assertions around class names and data attributes deterministic.
beforeEach(() => {
  document.body.innerHTML = ""
})

describe("CatLoader", () => {
  it("exposes an accessible status region with the provided label", () => {
    //2.- Render the loader and ensure assistive tech can read its busy state and label.
    const { getByRole, getByText } = render(<CatLoader label="Checking whiskers" />)

    const status = getByRole("status")
    expect(status).toHaveAttribute("aria-busy", "true")
    expect(getByText("Checking whiskers")).toBeInTheDocument()
  })

  it("renders all cat segments and honors the mirroring flag", () => {
    //3.- Count the number of decorative parts and assert mirroring toggles when disabled.
    const { container, rerender } = render(<CatLoader />)

    expect(container.querySelectorAll("[data-cat-loader-part]")).toHaveLength(4)
    const frame = container.querySelector(`.${styles.frame}`)
    expect(frame?.classList.contains(styles.mirrored)).toBe(true)

    rerender(<CatLoader mirror={false} />)
    const updatedFrame = container.querySelector(`.${styles.frame}`)
    expect(updatedFrame?.classList.contains(styles.mirrored)).toBe(false)
  })
})
