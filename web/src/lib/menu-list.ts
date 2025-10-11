import type { ComponentType } from "react";
import { Tag, Users, Settings, Bookmark, SquarePen, LayoutGrid } from "lucide-react";
import { HiMiniMap, HiMiniPresentationChartBar, HiMiniDocumentChartBar } from "react-icons/hi2";

type Submenu = {
  href: string;
  label: string;
  active?: boolean;
};

type Menu = {
  href: string;
  label: string;
  active?: boolean;
  icon: ComponentType<{ size?: number | string; className?: string }>;
  submenus?: Submenu[];
};

type Group = {
  groupLabel: string;
  menus: Menu[];
};

//1.- Describe the canonical navigation blueprint for the authenticated/private application surface.
const PRIVATE_MAIN_MENU_BLUEPRINT: Group[] = [
  {
    groupLabel: "Overview",
    menus: [
      {
        href: "/private/dashboard",
        label: "Dashboard",
        icon: LayoutGrid,
        submenus: []
      }
    ]
  },
  {
    groupLabel: "Management",
    menus: [
      {
        href: "/private/users",
        label: "Users",
        icon: Users,
        submenus: [
          {
            href: "/private/users",
            label: "User Dashboard"
          },
          {
            href: "/private/users/add-edit",
            label: "Add / Edit User"
          }
        ]
      },
      {
        href: "/private/teams",
        label: "Teams",
        icon: SquarePen,
        submenus: [
          {
            href: "/private/teams",
            label: "Teams Dashboard"
          },
          {
            href: "/private/teams/add-edit",
            label: "Add / Edit Team"
          }
        ]
      },
      {
        href: "/private/roles",
        label: "Roles",
        icon: Tag,
        submenus: [
          {
            href: "/private/roles",
            label: "Roles Dashboard"
          },
          {
            href: "/private/roles/add-edit",
            label: "Add / Edit Role"
          },
          {
            href: "/private/roles/edit-permissions",
            label: "Edit Permissions"
          }
        ]
      },
      {
        href: "/private/modules",
        label: "Modules",
        icon: HiMiniMap
      }
    ]
  },
  {
    groupLabel: "Operations",
    menus: [
      {
        href: "/private/views-analysis",
        label: "Views analysis",
        icon: HiMiniDocumentChartBar
      },
      {
        href: "/private/security",
        label: "Security",
        icon: HiMiniPresentationChartBar
      },
      {
        href: "/private/settings",
        label: "Settings",
        icon: Settings
      },
      {
        href: "/private/profile",
        label: "Profile",
        icon: Bookmark
      }
    ]
  }
];

export function getMenuList(pathname: string): Group[] {
  //2.- Clone the blueprint so each caller receives fresh objects for menu item state management.
  return PRIVATE_MAIN_MENU_BLUEPRINT.map((group) => ({
    groupLabel: group.groupLabel,
    menus: group.menus.map((menu) => {
      const submenuActive = menu.submenus?.some((submenu) => submenu.href === pathname) ?? false;
      const isActive = menu.href === pathname || submenuActive;
      return {
        ...menu,
        active: isActive,
        submenus: menu.submenus?.map((submenu) => ({
          ...submenu,
          active: submenu.href === pathname
        }))
      };
    })
  }));
}
