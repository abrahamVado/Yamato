import Shell from "@/components/secure/shell"

export default function Page() {
  //1.- Render the secure shell to align the Add / Edit User workflow with the authenticated layout.
  //2.- Surface a lightweight placeholder message until the dedicated form is produced.
  const placeholderMessage = "Add or edit a user from this management workspace."

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
