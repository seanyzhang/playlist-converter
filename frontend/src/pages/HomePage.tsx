import { Link } from 'react-router-dom'
import { GlassButton } from '../components/GlassButton.tsx'
import { GlassCard } from '../components/GlassCard.tsx'
import { useSession } from '../session/useSession.ts'

export default function HomePage() {
  const { isFullyLinked } = useSession()

  return (
    <GlassCard>
      <h1 className="text-2xl font-semibold tracking-tight text-(--pc-text)">Dashboard</h1>
      <p className="mt-2 max-w-2xl text-sm opacity-80">
        This is the app shell. Playlists and conversion are stubbed for now; the goal is to lock in navigation, auth,
        and onboarding flows without introducing backend assumptions.
      </p>

      {!isFullyLinked ? (
        <div className="mt-6 rounded-3xl border border-black/10 bg-white/30 p-5">
          <p className="text-sm font-semibold">Next step: link your accounts</p>
          <p className="mt-1 text-sm opacity-80">
            You can browse the app, but conversion is gated until Spotify and NetEase are linked.
          </p>
          <div className="mt-4">
            <Link to="/onboarding/link">
              <GlassButton type="button">Link accounts</GlassButton>
            </Link>
          </div>
        </div>
      ) : null}

      <div className="mt-7 flex flex-wrap items-center gap-3">
        <Link to="/app/playlists">
          <GlassButton type="button">Browse playlists</GlassButton>
        </Link>
        <Link to="/app/convert">
          <GlassButton type="button">Start a conversion</GlassButton>
        </Link>
      </div>
    </GlassCard>
  )
}

