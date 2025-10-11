import Shell from "@/components/secure/shell"

export default function Page() {
  //1.- Reuse the secure shell to guarantee consistent chrome for the team maintenance workflow.
  //2.- Present a transitional callout so navigation has meaningful content.
  const placeholderMessage = "Create or update a team configuration from this workspace."

  return (
    <Shell>
      <div className="grid gap-6">
        <div className="rounded-md border border-dashed p-6 text-sm text-muted-foreground">
          {placeholderMessage}
        </div>
      </div>
    </Shell>
  )
}
