export default function PublicFooter() {
  return (
    <footer className="border-t py-8 text-sm text-muted-foreground">
      <div className="mx-auto max-w-6xl px-4 flex items-center justify-between">
        <span>© {new Date().getFullYear()} Yamato</span>
        <span>Built with shadcn/ui</span>
      </div>
    </footer>
  )
}
