import { Link, Outlet } from 'react-router-dom'

export function PublicLayout() {
  return (
    <div className="min-h-screen px-6 py-6">
      <header className="glass-surface mx-auto flex w-full max-w-5xl items-center justify-between rounded-2xl px-5 py-3">
        <Link className="text-sm font-semibold tracking-tight" to="/welcome">
          Playlist Converter
        </Link>
        <nav className="flex items-center gap-1 text-sm">
          <Link
            className="rounded-xl px-3 py-2 transition hover:bg-white/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/10"
            to="/welcome"
          >
            Welcome
          </Link>
          <Link
            className="rounded-xl px-3 py-2 transition hover:bg-white/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/10"
            to="/auth"
          >
            Sign in
          </Link>
        </nav>
      </header>

      <main className="mx-auto mt-10 w-full max-w-5xl">
        <Outlet />
      </main>
    </div>
  )
}

