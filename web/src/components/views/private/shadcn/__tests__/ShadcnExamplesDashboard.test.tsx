//1.- Validate that the gallery renders each example and wiring for shell toggles behaves as expected.
import React from "react"
import { render, screen, fireEvent } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { I18nProvider } from "@/app/providers/I18nProvider"
import { ShadcnExamplesDashboard } from "../ShadcnExamplesDashboard"

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
  usePathname: () => "/dashboard",
  useSearchParams: () => new URLSearchParams(),
}))

vi.mock("@/components/admin-panel/content-layout", () => ({
  ContentLayout: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

describe("ShadcnExamplesDashboard", () => {
  const baseProps = {
    isHoverOpen: false,
    isSidebarDisabled: false,
    onToggleHover: vi.fn(),
    onToggleSidebar: vi.fn(),
  }

  function renderWithProviders() {
    return render(
      <I18nProvider defaultLocale="en">
        <ShadcnExamplesDashboard {...baseProps} />
      </I18nProvider>,
    )
  }

  it("shows the dashboard tab by default", () => {
    renderWithProviders()
    expect(screen.getByText(/all official ui\.shadcn\.com examples/i)).toBeInTheDocument()
    expect(screen.getByText(/Total Revenue/i)).toBeInTheDocument()
    expect(screen.getByText(/Recent Sales/i)).toBeInTheDocument()
  })

  it("wraps the experience in the shared neumorphic card", () => {
    renderWithProviders()
    const card = screen.getByTestId("dashboard-neumorphic-card")
    expect(card).toBeInTheDocument()
    expect(card).toHaveClass("neumorphic-card")
  })

  it("renders the cards example so operators can review the layout", () => {
    renderWithProviders()
    const cardsTrigger = screen.getByRole("tab", { name: /cards/i })
    expect(cardsTrigger).toBeInTheDocument()
    // The content is initially hidden until selected, but we can still assert it is mounted.
    expect(screen.getByRole("button", { name: /Create workspace/i, hidden: true })).toBeInTheDocument()
    expect(screen.getByText(/Payment method/i, { selector: "h2, h3, p", exact: false, hidden: true })).toBeInTheDocument()
  })

  it("bubbles shell toggle changes", () => {
    renderWithProviders()
    fireEvent.click(screen.getByLabelText(/Hover open sidebar/i))
    fireEvent.click(screen.getByLabelText(/Disable sidebar/i))
    expect(baseProps.onToggleHover).toHaveBeenCalled()
    expect(baseProps.onToggleSidebar).toHaveBeenCalled()
  })
})
