import type { ReactNode } from "react"
import { cleanup, render, screen } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import RolesAddEditPage from "../roles/add-edit/page"
import PermissionsPage from "../roles/edit-permissions/page"
import TeamsAddEditPage from "../teams/add-edit/page"
import UsersAddEditPage from "../users/add-edit/page"

const layoutSpy = vi.fn()
const shellSpy = vi.fn()

vi.mock("@/components/secure/shell", () => ({
  __esModule: true,
  default: ({ children }: { children: ReactNode }) => (
    <div data-testid="shell">{children}</div>
  ),
}))

vi.mock("@/components/views/private/PrivateViewLayout", () => ({
  PrivateViewLayout: ({ title, children }: { title: string; children: ReactNode }) => {
    layoutSpy(title)
    return (
      <div data-testid="layout" data-title={title}>
        {children}
      </div>
    )
  },
}))

vi.mock("@/components/views/private/PrivateNeumorphicShell", () => ({
  PrivateNeumorphicShell: ({ children, testId }: { children: ReactNode; testId?: string }) => {
    shellSpy(testId)
    return <div data-testid={testId ?? "neumorphic-shell"}>{children}</div>
  },
}))

vi.mock("@/components/secure/users/AdminUserForm", () => ({
  AdminUserForm: ({ userId }: { userId?: number }) => (
    <div data-testid="user-form" data-user-id={userId ?? ""} />
  ),
}))

vi.mock("@/components/secure/teams/AdminTeamForm", () => ({
  AdminTeamForm: ({ teamId }: { teamId?: number }) => (
    <div data-testid="team-form" data-team-id={teamId ?? ""} />
  ),
}))

vi.mock("@/components/secure/roles/AdminRoleForm", () => ({
  AdminRoleForm: ({ roleId }: { roleId?: number }) => (
    <div data-testid="role-form" data-role-id={roleId ?? ""} />
  ),
}))

vi.mock("@/components/secure/roles/RolePermissionsForm", () => ({
  RolePermissionsForm: () => <div data-testid="permissions-form" />,
}))

describe("add edit private pages", () => {
  beforeEach(() => {
    layoutSpy.mockClear()
    shellSpy.mockClear()
  })

  afterEach(() => {
    cleanup()
  })

  it("shows a create header for the user form when no id is provided", () => {
    render(<UsersAddEditPage />)

    expect(screen.getByTestId("layout")).toHaveAttribute("data-title", "Create user")
    expect(layoutSpy).toHaveBeenCalledWith("Create user")
    expect(shellSpy).toHaveBeenCalledWith("users-add-edit-neumorphic-shell")
    const neumorphicShell = screen.getByTestId("users-add-edit-neumorphic-shell")
    expect(neumorphicShell).toBeInTheDocument()
    expect(neumorphicShell).toContainElement(screen.getByTestId("user-form"))
  })

  it("shows an edit header for the user form when an id is provided", () => {
    render(<UsersAddEditPage searchParams={{ id: "12" }} />)

    expect(screen.getByTestId("layout")).toHaveAttribute("data-title", "Edit user")
    expect(layoutSpy).toHaveBeenCalledWith("Edit user")
    expect(shellSpy).toHaveBeenCalledWith("users-add-edit-neumorphic-shell")
  })

  it("renders the correct header for creating a team", () => {
    render(<TeamsAddEditPage />)

    expect(screen.getByTestId("layout")).toHaveAttribute("data-title", "Create team")
    expect(layoutSpy).toHaveBeenCalledWith("Create team")
    expect(shellSpy).toHaveBeenCalledWith("teams-add-edit-neumorphic-shell")
    const neumorphicShell = screen.getByTestId("teams-add-edit-neumorphic-shell")
    expect(neumorphicShell).toBeInTheDocument()
    expect(neumorphicShell).toContainElement(screen.getByTestId("team-form"))
  })

  it("renders the correct header for editing a team", () => {
    render(<TeamsAddEditPage searchParams={{ id: "33" }} />)

    expect(screen.getByTestId("layout")).toHaveAttribute("data-title", "Edit team")
    expect(layoutSpy).toHaveBeenCalledWith("Edit team")
    expect(shellSpy).toHaveBeenCalledWith("teams-add-edit-neumorphic-shell")
  })

  it("renders the correct header for editing a role", () => {
    render(<RolesAddEditPage searchParams={{ id: "9" }} />)

    expect(screen.getByTestId("layout")).toHaveAttribute("data-title", "Edit role")
    expect(layoutSpy).toHaveBeenCalledWith("Edit role")
    expect(shellSpy).toHaveBeenCalledWith("roles-add-edit-neumorphic-shell")
  })

  it("renders the correct header for creating a role", () => {
    render(<RolesAddEditPage />)

    expect(screen.getByTestId("layout")).toHaveAttribute("data-title", "Create role")
    expect(layoutSpy).toHaveBeenCalledWith("Create role")
    expect(shellSpy).toHaveBeenCalledWith("roles-add-edit-neumorphic-shell")
    const neumorphicShell = screen.getByTestId("roles-add-edit-neumorphic-shell")
    expect(neumorphicShell).toBeInTheDocument()
    expect(neumorphicShell).toContainElement(screen.getByTestId("role-form"))
  })

  it("renders the permissions editor with the edit permissions header", () => {
    render(<PermissionsPage />)

    expect(screen.getByTestId("layout")).toHaveAttribute("data-title", "Edit permissions")
    expect(layoutSpy).toHaveBeenCalledWith("Edit permissions")
    expect(shellSpy).toHaveBeenCalledWith("permissions-edit-neumorphic-shell")
    const neumorphicShell = screen.getByTestId("permissions-edit-neumorphic-shell")
    expect(neumorphicShell).toBeInTheDocument()
    expect(neumorphicShell).toContainElement(screen.getByTestId("permissions-form"))
  })
})
