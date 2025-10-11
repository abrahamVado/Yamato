import Shell from "@/components/secure/shell"

export default function Page() {
  //1.- Wrap the role creation surface with the secure shell used across management routes.
  //2.- Provide a guided message until the role editor experience ships.
  const placeholderMessage = "Define or revise role attributes within this workspace."

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
