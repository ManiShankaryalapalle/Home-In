export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto flex max-w-7xl flex-col items-center justify-center px-6 py-24 text-center">
        
        <p className="mb-4 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-1 text-sm text-cyan-200">
          Home-in
        </p>

        <h1 className="max-w-4xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
          Find the right rental faster, safer, and smarter.
        </h1>

        <p className="mt-6 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
          Home-in is an AI-powered rental discovery platform that helps users
          search homes across multiple sources, compare listings, understand
          affordability, and explore nearby lifestyle insights.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <button className="rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:scale-105">
            Start Searching
          </button>
          <button className="rounded-2xl border border-white/20 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
            View Listings
          </button>
        </div>

      </section>
    </main>
  );
}