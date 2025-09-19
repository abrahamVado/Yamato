// src/app/loader-demo/page.tsx
export const dynamic = "force-dynamic"; // ensures the delay runs on each request

export default async function LoaderDemoPage() {
  // Simulate server work so loading.tsx appears immediately
  await new Promise((r) => setTimeout(r, 1500));

  const seeds = Array.from({ length: 12 }, (_, i) => i + 1);

  return (
    <main className="container mx-auto max-w-5xl px-6 py-12">

        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Loader Demo</h1>
          <p className="text-muted-foreground">
            This page intentionally delays on the server and then loads several large images.
            Your overlay should stay visible until all images &amp; fonts finish loading.
          </p>
        </header>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {seeds.map((i) => (
            <img
              key={i}
              src={`https://picsum.photos/seed/cat${i}/1280/860`}
              alt={`Random scenic ${i}`}
              className="h-auto w-full rounded-xl object-cover shadow"
              loading="eager"
              decoding="async"
            />
          ))}
        </section>
    </main>
  );
}
