export default function App() {
  return (
    <div className="min-h-screen px-6 py-6">
      <header className="glass-surface mx-auto flex w-full max-w-5xl items-center justify-between rounded-2xl px-5 py-3">
        <div className="text-sm font-semibold tracking-tight">Playlist Converter</div>
        <nav className="flex items-center gap-1 text-sm">
          <a
            className="rounded-xl px-3 py-2 transition hover:bg-white/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/10"
            href="#"
          >
            Convert
          </a>
          <a
            className="rounded-xl px-3 py-2 transition hover:bg-white/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/10"
            href="#"
          >
            Library
          </a>
        </nav>
      </header>

      <main className="mx-auto mt-10 w-full max-w-5xl">
        <section className="glass-surface rounded-3xl p-6 sm:p-8">
          <h1 className="text-2xl font-semibold tracking-tight text-(--pc-text)">
            Hello World
          </h1>
          <p className="mt-2 max-w-2xl text-sm opacity-80">
            This is the starting point for the Spotify ↔ NetEase playlist converter. We’ll keep
            the UI Apple-like (glassmorphism), fast-loading, and type-safe.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button className="glass-button" type="button">
              Link Spotify
            </button>
            <button className="glass-button" type="button">
              Link NetEase
            </button>
          </div>
        </section>
      </main>
    </div>
  )
}
