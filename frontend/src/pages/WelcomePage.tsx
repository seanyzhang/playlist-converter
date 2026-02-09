import { Link } from 'react-router-dom'
import { GlassButton } from '../components/GlassButton.tsx'
import { GlassCard } from '../components/GlassCard.tsx'

export default function WelcomePage() {
  return (
    <GlassCard>
      <h1 className="text-2xl font-semibold tracking-tight text-(--pc-text)">Spotify ↔ NetEase playlist converter</h1>
      <p className="mt-3 max-w-2xl text-sm opacity-80">
        Link your accounts, pick a playlist, and generate a matched copy on the other platform. When tracks don’t
        match, you’ll get a transparent review step instead of silent guessing.
      </p>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-black/10 bg-white/35 p-4">
          <div className="text-sm font-semibold">Deterministic matching</div>
          <p className="mt-1 text-xs opacity-75">Prefer IDs/ISRC; fall back to normalized metadata with confidence.</p>
        </div>
        <div className="rounded-2xl border border-black/10 bg-white/35 p-4">
          <div className="text-sm font-semibold">Conflict workflow</div>
          <p className="mt-1 text-xs opacity-75">Ambiguous results are user-controlled: choose, search, or skip.</p>
        </div>
        <div className="rounded-2xl border border-black/10 bg-white/35 p-4">
          <div className="text-sm font-semibold">No surprises</div>
          <p className="mt-1 text-xs opacity-75">Never overwrite playlists without an explicit confirmation.</p>
        </div>
      </div>

      <div className="mt-7 flex flex-wrap items-center gap-3">
        <Link to="/auth">
          <GlassButton type="button">Get started</GlassButton>
        </Link>
        <p className="text-xs opacity-70">
          This pass uses mocked auth + linking (no backend in repo yet).
        </p>
      </div>
    </GlassCard>
  )
}

