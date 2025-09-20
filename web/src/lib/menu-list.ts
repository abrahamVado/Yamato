import {
  Tag,
  Users,
  Settings,
  Bookmark,
  SquarePen,
  LayoutGrid,
  LucideIcon
} from "lucide-react";

type Submenu = {
  href: string;
  label: string;
  active?: boolean;
};

type Menu = {
  href: string;
  label: string;
  active?: boolean;
  icon: LucideIcon;
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
      groupLabel: "Collaboration",
      menus: [
        {
          href: "",
          label: "Coordinating centers",
          icon: SquarePen,
          submenus: [
            {
              href: "/posts",
              label: "MPC"
            },
            {
              href: "/posts/new",
              label: "IAU"
            },
            {
              href: "/posts/new",
              label: "AAVSO"
            },
            {
              href: "/private/center/xls/upload",
              label: "Shared Files"
            },
            {
              href: "/private/center/xls/uploadgo",
              label: "Shared Files v2"
            }
          ]
        },
        {
          href: "/categories",
          label: "Geocodes",
          icon: Bookmark
        },
        {
          href: "/tags",
          label: "Calendar",
          icon: Tag
        },
        {
          href: "",
          label: "Marketplace",
          icon: SquarePen,
          submenus: [
            {
              href: "/posts",
              label: "Market"
            },
            {
              href: "/posts/new",
              label: "Add Product"
            },
            {
              href: "/posts/new",
              label: "Categories"
            },
            {
              href: "/posts/new",
              label: "Payment integration"
            },
            {
              href: "/posts/new",
              label: ""
            }
          ]
        },
        {
          href: "/tags",
          label: "Open Positions",
          icon: Tag
        },
        {
          href: "",
          label: "API Settings",
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
          label: "Payments",
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
          label: "OpenAI Tool's",
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
