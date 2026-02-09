import { GlassCard } from '../components/GlassCard.tsx'

export default function PlaylistsPage() {
  return (
    <GlassCard>
      <h1 className="text-2xl font-semibold tracking-tight text-(--pc-text)">Playlists</h1>
      <p className="mt-2 max-w-2xl text-sm opacity-80">
        Nothing here yet. Once the backend + provider APIs are wired, this page will list playlists from the linked
        account(s) with clear loading/empty/error states.
      </p>

      <div className="mt-6 rounded-3xl border border-black/10 bg-white/30 p-5">
        <p className="text-sm font-semibold">Empty state</p>
        <p className="mt-1 text-sm opacity-80">Connect your accounts and we’ll surface playlists here.</p>
      </div>
    </GlassCard>
  )
}

