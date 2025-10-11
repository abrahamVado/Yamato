import { act, fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi, afterEach } from "vitest"
import { AdminUserForm } from "./AdminUserForm"

const useAdminResourceMock = vi.fn()

vi.mock("@/hooks/use-admin-resource", () => ({
  useAdminResource: (path: string) => useAdminResourceMock(path),
}))

afterEach(() => {
  useAdminResourceMock.mockReset()
})

describe("AdminUserForm", () => {
  it("prevents creating a user without a password", () => {
    const createMock = vi.fn().mockResolvedValue(undefined)
    const baseResource = {
      items: [],
      create: vi.fn(),
      update: vi.fn(),
      destroy: vi.fn(),
      refresh: vi.fn(),
      isLoading: false,
      error: null,
    }

    useAdminResourceMock.mockImplementation((path: string) => {
      if (path === "admin/users") {
        return { ...baseResource, items: [], create: createMock }
      }
      if (path === "admin/roles") {
        return {
          ...baseResource,
          items: [
            { id: 1, name: "commander", display_name: "Commander" },
            { id: 2, name: "navigator", display_name: "Navigator" },
          ],
        }
      }
      if (path === "admin/teams") {
        return { ...baseResource, items: [{ id: 7, name: "Orbit" }] }
      }
      return baseResource
    })

    render(<AdminUserForm />)

    fireEvent.change(screen.getByLabelText(/Full name/i), { target: { value: "Aiko" } })
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: "aiko@example.com" } })
    fireEvent.click(screen.getByRole("button", { name: /Create user/i }))

    expect(
      screen.getByText(/Password must be at least six characters when creating a new operator/i),
    ).toBeInTheDocument()
    expect(createMock).not.toHaveBeenCalled()
  })

  it("hydrates fields when editing an existing user", async () => {
    const updateMock = vi.fn().mockResolvedValue(undefined)
    const baseResource = {
      items: [],
      create: vi.fn(),
      update: vi.fn(),
      destroy: vi.fn(),
      refresh: vi.fn(),
      isLoading: false,
      error: null,
    }

    const existingUser = {
      id: 42,
      name: "Mika",
      email: "mika@yamato.io",
      roles: [
        { id: 2, name: "navigator", display_name: "Navigator" },
      ],
      teams: [
        { id: 7, name: "Orbit", role: "Lead" },
      ],
      profile: { name: "Night shift", phone: "+81 50 0000 0000" },
    }

    useAdminResourceMock.mockImplementation((path: string) => {
      if (path === "admin/users") {
        return { ...baseResource, items: [existingUser], update: updateMock }
      }
      if (path === "admin/roles") {
        return {
          ...baseResource,
          items: [
            { id: 2, name: "navigator", display_name: "Navigator" },
            { id: 5, name: "observer", display_name: "Observer" },
          ],
        }
      }
      if (path === "admin/teams") {
        return {
          ...baseResource,
          items: [
            { id: 7, name: "Orbit" },
            { id: 8, name: "Telemetry" },
          ],
        }
      }
      return baseResource
    })

    render(<AdminUserForm userId={42} />)

    expect(screen.getByLabelText(/Full name/i)).toHaveValue("Mika")
    expect(screen.getByLabelText(/Email/i)).toHaveValue("mika@yamato.io")
    expect(screen.getByLabelText(/Phone/i)).toHaveValue("+81 50 0000 0000")
    expect(screen.getByLabelText(/Profile note/i)).toHaveValue("Night shift")
    expect(screen.getByRole("checkbox", { name: /Toggle role Navigator/i })).toBeChecked()
    expect(screen.getByText(/Orbit · Lead/)).toBeInTheDocument()

    fireEvent.change(screen.getByLabelText(/Phone/i), { target: { value: "+81 50 9999 9999" } })
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /Update user/i }))
      await Promise.resolve()
    })

    expect(updateMock).toHaveBeenCalledTimes(1)
    expect(updateMock).toHaveBeenCalledWith(
      42,
      expect.objectContaining({
        name: "Mika",
        email: "mika@yamato.io",
        roles: [2],
      }),
      expect.any(Object),
    )
  })
})
