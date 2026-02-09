import { NavLink, Outlet } from 'react-router-dom'
import { useSession } from '../session/useSession.ts'

function navLinkClass(isActive: boolean): string {
  return [
    'rounded-xl px-3 py-2 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/10',
    isActive ? 'bg-white/60' : 'hover:bg-white/40',
  ].join(' ')
}

export function AppLayout() {
  const { user, linkedAccounts } = useSession()

  return (
    <div className="min-h-screen px-6 py-6">
      <header className="glass-surface mx-auto flex w-full max-w-5xl flex-col gap-3 rounded-2xl px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-sm font-semibold tracking-tight">Playlist Converter</div>
            <div className="text-xs opacity-70">
              Signed in as {user?.displayName ?? '—'} · Spotify {linkedAccounts.spotify ? 'linked' : 'not linked'} ·
              NetEase {linkedAccounts.netease ? 'linked' : 'not linked'}
            </div>
          </div>
        </div>

        <nav className="flex flex-wrap items-center gap-1 text-sm">
          <NavLink className={({ isActive }) => navLinkClass(isActive)} end to="/app">
            Home
          </NavLink>
          <NavLink className={({ isActive }) => navLinkClass(isActive)} to="/app/playlists">
            Playlists
          </NavLink>
          <NavLink className={({ isActive }) => navLinkClass(isActive)} to="/app/convert">
            Convert
          </NavLink>
          <NavLink className={({ isActive }) => navLinkClass(isActive)} to="/app/account">
            Account
          </NavLink>
        </nav>
      </header>

      <main className="mx-auto mt-10 w-full max-w-5xl">
        <Outlet />
      </main>
    </div>
  )
}

