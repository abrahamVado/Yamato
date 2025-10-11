import Shell from "@/components/secure/shell"

export default function Page() {
  //1.- Continue to host role permission management within the secure shell.
  //2.- Offer a descriptive placeholder until the permission matrix is implemented.
  const placeholderMessage = "Adjust role permissions and scopes from this upcoming interface."

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
