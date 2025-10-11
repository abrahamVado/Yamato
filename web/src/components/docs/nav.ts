// src/components/docs/nav.ts
export type DocsLink = { title: string; href: string }
export type DocsSection = { title: string; links: DocsLink[] }

export const docsNav: DocsSection[] = [
  {
    title: "Getting started",
    links: [
      { title: "Introduction", href: "/public/docs" },
      { title: "Installation", href: "/public/docs/installation" },
      { title: "Configuration", href: "/public/docs/configuration" },
    ],
  },
  {
    title: "Core",
    links: [
      { title: "Auth", href: "/public/docs/auth" },
      { title: "Tenants", href: "/public/docs/tenants" },
      { title: "RBAC", href: "/public/docs/rbac" },
    ],
  },
  {
    title: "Guides",
    links: [
      { title: "Deploy", href: "/public/docs/deploy" },
      { title: "Observability", href: "/public/docs/observability" },
      { title: "Troubleshooting", href: "/public/docs/troubleshooting" },
    ],
  },
  {
    //1.- Surface the collection of component demos so visitors can quickly find hands-on UI references.
    title: "Examples",
    links: [
      //2.- Route to the Shadcn UI component gallery that we curate within our documentation area.
      { title: "Components", href: "/public/docs/examples/components" },
    ],
  },
]
