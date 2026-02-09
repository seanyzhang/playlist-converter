import type { ReactNode } from 'react'
import { Link, Navigate, Outlet, useLocation } from 'react-router-dom'
import { GlassCard } from '../components/GlassCard.tsx'
import { GlassButton } from '../components/GlassButton.tsx'
import { useSession } from '../session/useSession.ts'

function FullPageFallback({ title, detail }: { title: string; detail?: string }) {
  return (
    <div className="min-h-screen px-6 py-8">
      <div className="mx-auto w-full max-w-3xl">
        <GlassCard>
          <h1 className="text-lg font-semibold tracking-tight">{title}</h1>
          {detail ? <p className="mt-2 text-sm opacity-80">{detail}</p> : null}
        </GlassCard>
      </div>
    </div>
  )
}

export function RequireAuth() {
  const { status, user } = useSession()
  const location = useLocation()

  if (status === 'loading') {
    return <FullPageFallback detail="Loading your session…" title="One moment" />
  }

  if (!user) {
    return <Navigate replace state={{ from: location.pathname }} to="/welcome" />
  }

  return <Outlet />
}

export function RequireLinkedAccounts({ children }: { children: ReactNode }) {
  const { linkedAccounts } = useSession()
  const isLinked = linkedAccounts.spotify && linkedAccounts.netease
  if (isLinked) return <>{children}</>

  return (
    <GlassCard>
      <h2 className="text-lg font-semibold tracking-tight">Link accounts to convert playlists</h2>
      <p className="mt-2 text-sm opacity-80">
        To convert between Spotify and NetEase, we need both accounts linked.
      </p>
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <Link to="/onboarding/link">
          <GlassButton type="button">Link accounts</GlassButton>
        </Link>
        <Link className="text-sm underline opacity-80 hover:opacity-100" to="/app/account">
          View account
        </Link>
      </div>
    </GlassCard>
  )
}

