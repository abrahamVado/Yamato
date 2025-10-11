import { render, screen } from "@testing-library/react"
import { PrivateNeumorphicShell } from "../PrivateNeumorphicShell"

describe("PrivateNeumorphicShell", () => {
  it("applies wide breakpoints so large screens stay filled", () => {
    //1.- Render the shell with a test id to inspect the generated wrapper and card classes.
    render(
      <PrivateNeumorphicShell testId="shell">
        <div>Content</div>
      </PrivateNeumorphicShell>,
    )

    const card = screen.getByTestId("shell")
    const wrapper = card.parentElement

    //2.- Guarantee the wrapper node exists before performing class-based assertions.
    if (!wrapper) {
      throw new Error("Wrapper element should exist for the neumorphic shell test")
    }

    expect(wrapper).toHaveClass("px-4")
    expect(card).toHaveClass("xl:max-w-[calc(100vw-6rem)]")
    expect(card).toHaveClass("2xl:max-w-[calc(100vw-8rem)]")
  })

  it("merges custom class names for wrapper and card", () => {
    //3.- Pass bespoke classes so downstream views can continue tailoring spacing.
    render(
      <PrivateNeumorphicShell
        testId="shell"
        wrapperClassName="bg-muted"
        cardClassName="border"
      >
        <div>Content</div>
      </PrivateNeumorphicShell>,
    )

    const card = screen.getByTestId("shell")
    const wrapper = card.parentElement

    //4.- Guard against null wrappers so the expectations receive a concrete HTMLElement.
    if (!wrapper) {
      throw new Error("Wrapper element should exist for the neumorphic shell test")
    }

    expect(wrapper).toHaveClass("bg-muted")
    expect(card).toHaveClass("border")
  })
})
