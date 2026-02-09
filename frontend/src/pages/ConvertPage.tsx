import { GlassCard } from '../components/GlassCard.tsx'

export default function ConvertPage() {
  return (
    <GlassCard>
      <h1 className="text-2xl font-semibold tracking-tight text-(--pc-text)">Convert</h1>
      <p className="mt-2 max-w-2xl text-sm opacity-80">
        Conversion workspace placeholder. This will become a step-based flow: pick source playlist → match tracks →
        resolve conflicts → create target playlist.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-3xl border border-black/10 bg-white/30 p-5">
          <p className="text-sm font-semibold">1) Choose playlist</p>
          <p className="mt-1 text-sm opacity-80">List + search your playlists (empty for now).</p>
        </div>
        <div className="rounded-3xl border border-black/10 bg-white/30 p-5">
          <p className="text-sm font-semibold">2) Review matches</p>
          <p className="mt-1 text-sm opacity-80">Show matched/ambiguous/unmatched with user control.</p>
        </div>
      </div>
    </GlassCard>
  )
}

