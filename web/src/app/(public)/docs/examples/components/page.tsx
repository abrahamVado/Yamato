// src/app/(public)/docs/examples/components/page.tsx
"use client"

const componentExamples = [
  {
    //1.- Document the button sample so teams can reference a primary action pattern quickly.
    name: "Button",
    description:
      "Use buttons for primary and secondary actions. Shadcn provides solid, outline, and ghost variants ready to drop in.",
    docsUrl: "https://ui.shadcn.com/docs/components/button",
    code: `import { Button } from "@/components/ui/button"

export function ActionButtons() {
  return (
    <div className="flex gap-2">
      <Button>Primary</Button>
      <Button variant="outline">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
    </div>
  )
}`,
  },
  {
    //1.- Showcase how cards help present grouped content or KPIs within dashboards.
    name: "Card",
    description:
      "Cards frame related information with headers, bodies, and footers. They are ideal for metrics, summaries, and quick actions.",
    docsUrl: "https://ui.shadcn.com/docs/components/card",
    code: `import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function MetricCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Active subscriptions</CardTitle>
        <CardDescription>Rolling 30 day count</CardDescription>
      </CardHeader>
      <CardContent className="text-3xl font-semibold">1,248</CardContent>
    </Card>
  )
}`,
  },
  {
    //1.- Highlight dialog interactions so modal flows remain consistent with the design system.
    name: "Dialog",
    description:
      "Dialogs present blocking tasks such as confirmations or form inputs. Shadcn handles accessibility and focus management out of the box.",
    docsUrl: "https://ui.shadcn.com/docs/components/dialog",
    code: `import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

export function ArchiveDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Archive</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Archive project?</DialogTitle>
          <DialogDescription>This moves the project to a read-only state.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button type="button" variant="outline">Cancel</Button>
          <Button type="button">Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}`,
  },
  {
    //1.- Include data table guidance for multi-row management experiences in the admin area.
    name: "Data Table",
    description:
      "Compose interactive tables with column sorting, filtering, and pagination. Pair them with TanStack Table to support robust data workflows.",
    docsUrl: "https://ui.shadcn.com/docs/components/data-table",
    code: `import { DataTable } from "@/components/ui/data-table"
import { columns } from "./columns"

export function CustomersTable({ data }) {
  return <DataTable columns={columns} data={data} />
}`,
  },
]

export default function ExamplesComponentsPage() {
  //1.- Introduce the overview for teams exploring reusable UI snippets.
  return (
    <div className="space-y-8">
      <header className="space-y-4">
        <h1 className="text-3xl font-semibold">Component Examples</h1>
        <p className="text-muted-foreground">
          Explore curated snippets sourced from the official Shadcn UI component catalog. Use these
          examples as a starting point when integrating Yamato with the design system.
        </p>
      </header>

      <section className="space-y-6">
        {componentExamples.map(example => (
          <article key={example.name} className="space-y-3">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-2xl font-medium">{example.name}</h2>
                <p className="text-muted-foreground">{example.description}</p>
              </div>
              <a
                href={example.docsUrl}
                className="text-sm font-medium text-primary underline underline-offset-4"
                rel="noreferrer"
                target="_blank"
              >
                View on shadcn/ui
              </a>
            </div>
            <pre className="overflow-x-auto rounded-lg border bg-muted/40 p-4 text-sm">
              <code>{example.code}</code>
            </pre>
          </article>
        ))}
      </section>
    </div>
  )
}
