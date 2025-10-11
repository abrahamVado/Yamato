import { render, screen } from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"
import AdminUsersPanel from "./AdminUsersPanel"

const useAdminResourceMock = vi.fn()

vi.mock("@/hooks/use-admin-resource", () => ({
  useAdminResource: () => useAdminResourceMock(),
}))

afterEach(() => {
  useAdminResourceMock.mockReset()
})

describe("AdminUsersPanel", () => {
  it("shows an empty state when no operators exist", () => {
    useAdminResourceMock.mockReturnValue({
      items: [],
      isLoading: false,
      error: null,
      create: vi.fn(),
      update: vi.fn(),
      destroy: vi.fn(),
      refresh: vi.fn(),
    })

    render(<AdminUsersPanel />)

    expect(
      screen.getByText(/No operators found yet\. Seed a demo profile or create one manually/i),
    ).toBeInTheDocument()
  })
})
