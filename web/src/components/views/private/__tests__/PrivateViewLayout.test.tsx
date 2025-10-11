import { render, screen } from "@testing-library/react"
import type { ReactNode } from "react"
import { describe, expect, it, vi } from "vitest"

//1.- Mock the content layout so we can inspect the title prop without rendering the entire navbar tree.
vi.mock("@/components/admin-panel/content-layout", () => ({
  ContentLayout: ({ title, children }: { title: string; children: ReactNode }) => (
    <div data-testid="content-layout">
      <span data-testid="navbar-title">{title}</span>
      {children}
    </div>
  ),
}))

import { PrivateViewLayout } from "../PrivateViewLayout"

describe("PrivateViewLayout", () => {
  it("renders the dashboard header title and wraps children in the shared grid", () => {
    //2.- Render the layout with sample content to verify the navbar title propagates correctly.
    render(
      <PrivateViewLayout title="Teams">
        <p>Team overview</p>
      </PrivateViewLayout>,
    )

    //3.- Confirm the mocked navbar receives the same title used by the dashboard header.
    expect(screen.getByTestId("navbar-title")).toHaveTextContent("Teams")

    //4.- Ensure the reusable grid wrapper surrounds the private view content for consistent spacing.
    const child = screen.getByText("Team overview")
    expect(child.parentElement).toHaveClass("grid", "gap-6")
  })
})
