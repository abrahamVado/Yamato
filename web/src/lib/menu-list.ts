import type { ComponentType } from "react";
import { Tag, Users, Settings, Bookmark, SquarePen, LayoutGrid } from "lucide-react";
import { HiMiniMap, HiMiniPresentationChartBar, HiMiniDocumentChartBar, HiMiniListBullet } from "react-icons/hi2";

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

export function getMenuList(pathname: string): Group[] {
  return [
    {
      groupLabel: "",
      menus: [
        {
          href: "/dashboard",
          label: "Dashboard",
          icon: LayoutGrid,
          submenus: []
        }
      ]
    },
    {
      groupLabel: "Settings",
      menus: [
        {
          href: "/users",
          label: "Users",
          icon: Users
        },
        {
          href: "",
          label: "Teams",
          icon: SquarePen,
          submenus: [
            {
              href: "/posts",
              label: "Chatgpt"
            },
            {
              href: "/posts/new",
              label: "Translations"
            },
            {
              href: "/posts/new",
              label: "Matematical Reasoning"
            },
            {
              href: "/posts/new",
              label: "Python Examples"
            },
            {
              href: "/posts/new",
              label: "API Key's"
            }
          ]
        },
        {
          href: "",
          label: "Join requests",
          icon: SquarePen,
          submenus: [
            {
              href: "/posts",
              label: "Chatgpt"
            },
            {
              href: "/posts/new",
              label: "Translations"
            },
            {
              href: "/posts/new",
              label: "Matematical Reasoning"
            },
            {
              href: "/posts/new",
              label: "Python Examples"
            },
            {
              href: "/posts/new",
              label: "API Key's"
            }
          ]
        },
        {
          href: "/account",
          label: "Account",
          icon: Settings
        }
      ]
    }
  ];
}
