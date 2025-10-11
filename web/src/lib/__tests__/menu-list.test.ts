//1.- Validate the submenu blueprint emitted by getMenuList for the management section.
import { describe, expect, it } from "vitest"
//2.- Import the navigation factory under test.
import { getMenuList } from "../menu-list"

describe("getMenuList management submenus", () => {
  //3.- Confirm the Users, Teams, and Roles menus expose the required submenu entries.
  it("includes the expected management submenus", () => {
    const menuList = getMenuList("/private/dashboard")
    const managementGroup = menuList.find((group) => group.groupLabel === "Management")

    expect(managementGroup).toBeDefined()

    const summarizedSubmenus = Object.fromEntries(
      (managementGroup?.menus ?? [])
        .filter((menu) => ["Users", "Teams", "Roles"].includes(menu.label))
        .map((menu) => [
          menu.label,
          (menu.submenus ?? []).map((submenu) => ({ label: submenu.label, href: submenu.href }))
        ])
    )

    expect(summarizedSubmenus).toEqual({
      Users: [
        { label: "User Dashboard", href: "/private/users" },
        { label: "Add / Edit User", href: "/private/users/add-edit" }
      ],
      Teams: [
        { label: "Teams Dashboard", href: "/private/teams" },
        { label: "Add / Edit Team", href: "/private/teams/add-edit" }
      ],
      Roles: [
        { label: "Roles Dashboard", href: "/private/roles" },
        { label: "Add / Edit Role", href: "/private/roles/add-edit" },
        { label: "Edit Permissions", href: "/private/roles/edit-permissions" }
      ]
    })
  })

  //4.- Ensure submenu active flags respond to matching pathnames.
  it("activates submenu entries when their pathname matches", () => {
    const usersMenu = getMenuList("/private/users/add-edit")
      .find((group) => group.groupLabel === "Management")
      ?.menus.find((menu) => menu.label === "Users")

    expect(usersMenu?.active).toBe(true)
    expect(usersMenu?.submenus?.find((submenu) => submenu.label === "Add / Edit User")?.active).toBe(true)
    expect(usersMenu?.submenus?.find((submenu) => submenu.label === "User Dashboard")?.active).toBe(false)

    const rolesMenu = getMenuList("/private/roles/edit-permissions")
      .find((group) => group.groupLabel === "Management")
      ?.menus.find((menu) => menu.label === "Roles")

    expect(rolesMenu?.active).toBe(true)
    expect(rolesMenu?.submenus?.find((submenu) => submenu.label === "Edit Permissions")?.active).toBe(true)
    expect(rolesMenu?.submenus?.find((submenu) => submenu.label === "Add / Edit Role")?.active).toBe(false)
  })
})
