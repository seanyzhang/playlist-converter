import { Link, NavLink, Outlet } from 'react-router-dom'

export function PublicLayout() {
  const navItemClassBase =
    'rounded-xl px-3 py-2 transition duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/10 border-[1px] border-transparent bg-white/0 hover:bg-white/35 hover:border-black/10 hover:shadow-[0_10px_26px_var(--pc-shadow)] hover:scale-[1.02] active:scale-[0.99] motion-reduce:hover:scale-100 motion-reduce:active:scale-100'

  return (
    <div className="min-h-screen px-6 py-6">
      <header className="glass-surface mx-auto flex w-full max-w-5xl items-center justify-between rounded-2xl px-5 py-3">
        <Link className="text-sm font-semibold tracking-tight" to="/welcome">
          Playlist Converter
        </Link>
        <nav className="flex items-center gap-1 text-sm">
          <NavLink
            className={({ isActive }) =>
              [navItemClassBase, isActive ? 'bg-white/55 border-black/10' : ''].filter(Boolean).join(' ')
            }
            to="/welcome"
          >
            Welcome
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              [navItemClassBase, isActive ? 'bg-white/55 border-black/10' : ''].filter(Boolean).join(' ')
            }
            to="/auth"
          >
            Sign in
          </NavLink>
        </nav>
      </header>

      <main className="mx-auto mt-10 w-full max-w-5xl">
        <Outlet />
      </main>
    </div>
  )
}

